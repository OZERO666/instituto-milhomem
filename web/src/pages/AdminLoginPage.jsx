import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useContatoConfig } from '@/hooks/useContatoConfig.js';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Eye, EyeOff, Lock, Shield, Mail, Key, AlertTriangle, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidEmail, isStrongPassword } from '@/lib/validateForm.js';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { LOGO_URL } from '@/config/site.js';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const config = useContatoConfig();
  const logoUrl = config?.logo_url || LOGO_URL;
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const passwordValue = watch('password', '');

  // ─── Lockout Logic ────────────────────────────────────────────────────────
  useEffect(() => {
    const checkLockout = () => {
      const attempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10);
      const lockoutTimestamp = parseInt(localStorage.getItem('lockoutTimestamp') || '0', 10);
      
      if (attempts >= MAX_ATTEMPTS && lockoutTimestamp) {
        const timePassed = Date.now() - lockoutTimestamp;
        if (timePassed < LOCKOUT_TIME) {
          setLockoutTimeRemaining(Math.ceil((LOCKOUT_TIME - timePassed) / 60000));
        } else {
          // Lockout expired
          localStorage.removeItem('loginAttempts');
          localStorage.removeItem('lockoutTimestamp');
          setLockoutTimeRemaining(0);
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  // ─── Password Strength ────────────────────────────────────────────────────
  const getPasswordStrength = (pass) => {
    if (!pass) return { text: 'Digite sua senha', color: 'bg-gray-200' };
    if (isStrongPassword(pass)) return { text: 'Forte', color: 'bg-emerald-500' };
    if (pass.length >= 8) return { text: 'Média', color: 'bg-amber-500' };
    return { text: 'Fraca', color: 'bg-red-500' };
  };

  const strength = getPasswordStrength(passwordValue);

  // ─── Submit Handler ───────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (lockoutTimeRemaining > 0) {
      toast.error(`Aguarde ${lockoutTimeRemaining} min antes de tentar novamente.`);
      return;
    }

    const sanitizedData = sanitizeObject(data);
    setIsLoading(true);
    
    try {
      await login(sanitizedData.email, sanitizedData.password);
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTimestamp');
      toast.success('Login realizado com sucesso! 🎉');
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      const attempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10) + 1;
      localStorage.setItem('loginAttempts', attempts.toString());
      
      if (attempts >= MAX_ATTEMPTS) {
        localStorage.setItem('lockoutTimestamp', Date.now().toString());
        setLockoutTimeRemaining(15);
        toast.error('Muitas tentativas. Conta bloqueada por 15 min. 🔒');
      } else {
        toast.error(`Credenciais inválidas. Tentativa ${attempts}/${MAX_ATTEMPTS}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Auto-redirect se já logado ───────────────────────────────────────────
  useEffect(() => {
    if (currentUser) {
      navigate('/admin', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <>
      <Helmet>
        <title>Admin Login | Instituto Milhomem</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Fundo com cor secondary do site + textura sutil */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-secondary relative overflow-hidden">

        {/* Círculos decorativos de fundo */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* ── LOGO ── */}
          <div className="flex flex-col items-center mb-8 gap-4">
            <img
              src={logoUrl}
              alt="Instituto Milhomem"
              className="h-20 w-auto object-contain drop-shadow-lg"
            />
            <div className="text-center">
              <p className="text-primary/70 text-sm font-medium tracking-widest uppercase">Área Administrativa</p>
            </div>
          </div>

          {/* ── CARD BRANCO ── */}
          <div className="bg-white rounded-2xl shadow-2xl border border-white/10 overflow-hidden">

            {/* Topo dourado decorativo */}
            <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

            <div className="px-8 py-8 space-y-6">

              {/* LOCKOUT WARNING */}
              <AnimatePresence>
                {lockoutTimeRemaining > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Acesso Temporariamente Bloqueado</p>
                        <p className="text-xs mt-0.5">Tente novamente em <span className="font-mono font-bold">{lockoutTimeRemaining} min</span></p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FORM */}
              {!lockoutTimeRemaining ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                  {/* EMAIL */}
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-secondary/70 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="h-11 focus-visible:ring-primary border-border/60"
                      {...register('email', {
                        required: 'E-mail é obrigatório',
                        validate: value => isValidEmail(value) || 'Formato de e-mail inválido'
                      })}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-secondary/70 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="h-11 pr-11 focus-visible:ring-primary border-border/60"
                        {...register('password', {
                          required: 'Senha é obrigatória',
                          minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Barra de força */}
                    {passwordValue && (
                      <div className="flex gap-1 h-1 mt-1">
                        {[0, 1, 2].map(i => (
                          <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${
                            strength.text === 'Forte' ? 'bg-emerald-500' :
                            strength.text === 'Média' && i < 2 ? 'bg-amber-400' :
                            strength.text === 'Fraca' && i === 0 ? 'bg-red-400' :
                            'bg-border'
                          }`} />
                        ))}
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* BOTÃO */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 font-bold tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:shadow-primary/30 mt-1"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <RotateCw className="w-4 h-4 animate-spin" /> Autenticando…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Key className="w-4 h-4" /> Entrar
                      </span>
                    )}
                  </Button>

                  {parseInt(localStorage.getItem('loginAttempts') || '0') > 0 && (
                    <p className="text-[11px] text-center text-muted-foreground">
                      Tentativa {localStorage.getItem('loginAttempts')}/{MAX_ATTEMPTS} · bloqueio após {MAX_ATTEMPTS} falhas
                    </p>
                  )}
                </form>
              ) : (
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full h-11 font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <RotateCw className="w-4 h-4 mr-2" /> Verificar se desbloqueou
                </Button>
              )}

              {/* SEGURANÇA */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>Conexão segura · Sessão monitorada</span>
              </div>
            </div>
          </div>

          {/* VOLTAR AO SITE */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              ← Voltar para o site
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AdminLoginPage;