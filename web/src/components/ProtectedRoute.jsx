import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import usePermission from '@/hooks/usePermission.js';
import { LOGO_URL } from '@/config/site';

const ProtectedRoute = ({ children, siteConfig, requiredPermission = null }) => {
  const { isAuthenticated, initialLoading } = useAuth();
  const { canAccess } = usePermission();
  const location = useLocation();

  // ─── Loading ──────────────────────────────────────────────────────────────
  const logoUrl = siteConfig?.logo_url || LOGO_URL;

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-6"
        >
          {/* LOGO */}
          <img
            src={logoUrl}
            alt="Instituto Milhomem"
            className="w-20 h-20 mx-auto object-contain opacity-90"
          />

          {/* SPINNER */}
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-primary/40 border-b-transparent border-l-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>

          {/* TEXT */}
          <div className="space-y-1">
            <p className="text-white font-bold uppercase tracking-widest text-sm">
              Verificando acesso
            </p>
            <p className="text-white/50 text-xs flex items-center justify-center gap-1.5">
              <Shield className="w-3 h-3" />
              Sessão segura
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Não autenticado ──────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}  // Permite redirecionar de volta após login
      />
    );
  }

  if (requiredPermission) {
    const [resource, action = 'read'] = requiredPermission.split(':');
    if (!canAccess(resource, action)) {
      return (
        <Navigate
          to="/unauthorized"
          replace
          state={{ from: location.pathname }}
        />
      );
    }
  }

  // ─── Autenticado ──────────────────────────────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
};

export default ProtectedRoute;
