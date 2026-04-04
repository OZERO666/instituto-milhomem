// src/components/CookieBanner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CONSENT_KEY = 'im_cookie_consent';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      // Pequeno delay para não atrapalhar o LCP
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
        >
          <div className="bg-secondary text-white rounded-2xl shadow-2xl border border-white/10 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm mb-0.5">Este site usa cookies</p>
                <p className="text-white/60 text-xs leading-relaxed">
                  Utilizamos apenas cookies essenciais para o funcionamento do site, sem rastreamento
                  de terceiros, em conformidade com a{' '}
                  <strong className="text-white/80">LGPD (Lei nº 13.709/2018)</strong>.
                </p>
              </div>
            </div>

            <p className="text-white/50 text-xs mb-4">
              Veja nossa{' '}
              <Link
                to="/politica-de-privacidade"
                className="text-primary hover:underline"
                onClick={accept}
              >
                Política de Privacidade
              </Link>{' '}
              e{' '}
              <Link
                to="/termos-de-uso"
                className="text-primary hover:underline"
                onClick={accept}
              >
                Termos de Uso
              </Link>
              .
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-secondary
                           text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl
                           hover:bg-primary/90 active:scale-95 transition-all duration-200"
              >
                <Check className="w-3.5 h-3.5" />
                Aceitar
              </button>
              <button
                onClick={decline}
                className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/15
                           text-white/40 hover:text-white hover:border-white/30 active:scale-95
                           transition-all duration-200"
                aria-label="Recusar cookies"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
