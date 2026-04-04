// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import api from '@/lib/apiServerClient';
import { toast } from 'sonner';

// ─── Constantes ───────────────────────────────────────────────────────────────
const INACTIVITY_TIMEOUT  = 15 * 60 * 1000; // 15 min
const SESSION_TIMEOUT     = 30 * 60 * 1000; // 30 min
const SESSION_WARN_BEFORE = 2  * 60 * 1000; // avisa 2 min antes
const ACTIVITY_EVENTS     = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
const STORAGE_KEYS = {
  token:     'authToken',
  user:      'authUser',
  sessionAt: 'sessionStartTime',
};

const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [currentUser,     setCurrentUser]     = useState(null);
  const [initialLoading,  setInitialLoading]  = useState(true);
  const [sessionExpiring, setSessionExpiring] = useState(false); // aviso de expiração

  // Refs para timers — não causam re-render
  const inactivityRef  = useRef(null);
  const sessionRef     = useRef(null);
  const warnRef        = useRef(null);
  const isMountedRef   = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback((reason = null) => {
    // Limpa timers
    clearTimeout(inactivityRef.current);
    clearInterval(sessionRef.current);
    clearTimeout(warnRef.current);

    // Limpa storage
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));

    if (isMountedRef.current) {
      setCurrentUser(null);
      setSessionExpiring(false);
    }

    // Feedback ao usuário apenas quando há motivo explícito
    if (reason === 'inactivity') {
      toast.warning('Sessão encerrada por inatividade.', { duration: 6000 });
    } else if (reason === 'expired') {
      toast.warning('Sua sessão expirou. Faça login novamente.', { duration: 6000 });
    } else if (reason === 'unauthorized') {
      toast.error('Acesso não autorizado. Faça login novamente.', { duration: 6000 });
    }
  }, []);

  // ─── Timers de sessão ──────────────────────────────────────────────────────
  const startSessionTimers = useCallback((user) => {
    if (!user) return;

    const sessionStart = parseInt(localStorage.getItem(STORAGE_KEYS.sessionAt) || '0', 10);

    // Timer de inatividade
    const resetInactivity = () => {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = setTimeout(() => logout('inactivity'), INACTIVITY_TIMEOUT);
    };

    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, resetInactivity, { passive: true }));
    resetInactivity();

    // Aviso de expiração próxima
    const timeLeft = SESSION_TIMEOUT - (Date.now() - sessionStart);
    if (timeLeft > SESSION_WARN_BEFORE) {
      warnRef.current = setTimeout(() => {
        if (isMountedRef.current) setSessionExpiring(true);
        toast.warning('Sua sessão expira em 2 minutos.', {
          duration: SESSION_WARN_BEFORE,
          id: 'session-warn',
        });
      }, timeLeft - SESSION_WARN_BEFORE);
    }

    // Verificação periódica do limite de sessão
    sessionRef.current = setInterval(() => {
      const start = parseInt(localStorage.getItem(STORAGE_KEYS.sessionAt) || '0', 10);
      if (start && Date.now() - start > SESSION_TIMEOUT) {
        logout('expired');
      }
    }, 30_000); // checa a cada 30s (era 60s)

    // Cleanup retornado para uso no effect
    return () => {
      clearTimeout(inactivityRef.current);
      clearInterval(sessionRef.current);
      clearTimeout(warnRef.current);
      ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, resetInactivity));
    };
  }, [logout]);

  // ─── Inicia/para timers quando currentUser muda ────────────────────────────
  useEffect(() => {
    if (!currentUser) return;
    const cleanup = startSessionTimers(currentUser);
    return cleanup;
  }, [currentUser, startSessionTimers]);

  // ─── Verificação inicial de auth ───────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.token);
      const raw   = localStorage.getItem(STORAGE_KEYS.user);

      if (!token || !raw) {
        setInitialLoading(false);
        return;
      }

      // Verifica se a sessão já expirou antes mesmo de chamar a API
      const sessionStart = parseInt(localStorage.getItem(STORAGE_KEYS.sessionAt) || '0', 10);
      if (sessionStart && Date.now() - sessionStart > SESSION_TIMEOUT) {
        logout('expired');
        setInitialLoading(false);
        return;
      }

      try {
        const res = await api.fetch('/auth/me');

        if (cancelled) return;

        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        } else if (res.status === 401) {
          logout('unauthorized');
        } else {
          logout();
        }
      } catch (err) {
        if (!cancelled) {
          // Rede offline: mantém usuário do storage temporariamente
          const cached = raw ? JSON.parse(raw) : null;
          if (cached) {
            setCurrentUser(cached);
            toast.info('Sem conexão — usando sessão em cache.', { duration: 5000 });
          } else {
            logout();
          }
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    };

    checkAuth();
    return () => { cancelled = true; };
  }, [logout]);

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await api.fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Credenciais inválidas');
    }

    const data = await res.json();
    const now  = Date.now().toString();

    localStorage.setItem(STORAGE_KEYS.token,     data.token);
    localStorage.setItem(STORAGE_KEYS.user,      JSON.stringify(data.user));
    localStorage.setItem(STORAGE_KEYS.sessionAt, now);

    setCurrentUser(data.user);
    setSessionExpiring(false);

    return data;
  }, []);

  // ─── Renovar sessão (estende o timer sem novo login) ──────────────────────
  const renewSession = useCallback(() => {
    if (!currentUser) return;
    const now = Date.now().toString();
    localStorage.setItem(STORAGE_KEYS.sessionAt, now);
    setSessionExpiring(false);
    toast.dismiss('session-warn');
    toast.success('Sessão renovada com sucesso!', { duration: 3000 });
    // Reinicia timers
    clearInterval(sessionRef.current);
    clearTimeout(warnRef.current);
    startSessionTimers(currentUser);
  }, [currentUser, startSessionTimers]);

  // ─── Context value ────────────────────────────────────────────────────────
  const value = {
    currentUser,
    login,
    logout,
    renewSession,
    isAuthenticated: !!currentUser,
    initialLoading,
    sessionExpiring,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within <AuthProvider>');
  return context;
};
