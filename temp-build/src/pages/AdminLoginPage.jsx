import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Eye, EyeOff, Lock, Shield, Mail, Key, AlertTriangle, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { isValidEmail, isStrongPassword } from '@/lib/validateForm.js';
import { sanitizeObject } from '@/lib/sanitizeInput.js';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
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

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-muted to-muted/50">
        <div className="w-full max-w-md relative z-10">
          
          {/* BACKGROUND PATTERN */}
          <div className="absolute inset-0 bg-[radial-gradient(var(--primary)/0.15_0%,transparent_50%)] opacity-50" />

          {/* MAIN CARD */}
          <Card className="relative overflow-hidden shadow-2xl border-primary/20 backdrop-blur-sm bg-card/95">
            <CardHeader className="text-center space-y-4 pb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg"
              >
                <Shield className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold text-secondary uppercase tracking-wider mb-2">
                  Área Administrativa
                </CardTitle>
                <CardDescription className="text-muted-foreground font-medium">
                  Acesso seguro e monitorado ao painel de controle
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 p-6 md:p-8">
              
              {/* LOCKOUT WARNING */}
              <AnimatePresence>
                {lockoutTimeRemaining > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-xl space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <p className="font-bold">Acesso Temporariamente Bloqueado</p>
                        <p className="text-sm">Tente novamente em <span className="font-mono font-bold text-destructive">{lockoutTimeRemaining} min</span></p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FORM */}
              {!lockoutTimeRemaining ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  
                  {/* EMAIL */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-bold text-secondary flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-mail Administrativo
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@institutomilhomem.com.br"
                      className="h-12 focus-visible:ring-primary bg-input"
                      {...register('email', {
                        required: 'E-mail é obrigatório',
                        validate: value => isValidEmail(value) || 'Formato de e-mail inválido'
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive px-3 py-1 bg-destructive/10 rounded-md flex items-center gap-2">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-bold text-secondary flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        className="h-12 pr-12 focus-visible:ring-primary bg-input"
                        {...register('password', {
                          required: 'Senha é obrigatória',
                          minLength: { value: 8, message: 'Mínimo 8 caracteres' }
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* STRENGTH BAR */}
                    {passwordValue && (
                      <div className="space-y-1.5 px-1">
                        <div className="flex gap-1 h-1.5">
                          {['Fraca', 'Média', 'Forte'].map((level, i) => (
                            <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${
                              strength.text === 'Forte' ? 'bg-emerald-500' :
                              strength.text === 'Média' && i < 2 ? 'bg-amber-500' :
                              strength.text === 'Fraca' && i === 0 ? 'bg-red-500' :
                              'bg-muted'
                            }`} />
                          ))}
                        </div>
                        <p className={`text-xs font-semibold ${
                          strength.text === 'Forte' ? 'text-emerald-600' :
                          strength.text === 'Média' ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          Força: {strength.text}
                        </p>
                      </div>
                    )}

                    {errors.password && (
                      <p className="text-sm text-destructive px-3 py-1 bg-destructive/10 rounded-md">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 text-lg font-bold uppercase tracking-widest bg-primary text-primary-foreground hover:bg-secondary hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary/30 mt-2"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-3">
                        <RotateCw className="w-5 h-5 animate-spin" />
                        Autenticando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <Key className="w-5 h-5" />
                        Entrar com Segurança
                      </span>
                    )}
                  </Button>

                  {/* ATTEMPTS WARNING */}
                  {parseInt(localStorage.getItem('loginAttempts') || '0') > 0 && (
                    <p className="text-xs text-center text-muted-foreground">
                      Tentativas: {localStorage.getItem('loginAttempts')}/{MAX_ATTEMPTS} — após {MAX_ATTEMPTS} falhas, o acesso será bloqueado por 15 minutos.
                    </p>
                  )}
                </form>
              ) : (
                /* LOCKOUT: botão para recarregar após o tempo */
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full h-12 font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <RotateCw className="w-4 h-4 mr-2" /> Verificar se o bloqueio expirou
                </Button>
              )}

              {/* DIVIDER */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest">Instituto Milhomem</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* BACK LINK */}
              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  ← Voltar para o site
                </Link>
              </div>

              {/* SECURITY BADGE */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground border border-border rounded-lg p-3 bg-muted/30">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Conexão segura · Sessão monitorada · Dados criptografados</span>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;