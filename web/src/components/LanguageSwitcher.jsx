// src/components/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'pt-BR', label: 'Português', flag: '🇧🇷', short: 'PT' },
  { code: 'en',    label: 'English',   flag: '🇺🇸', short: 'EN' },
  { code: 'es',    label: 'Español',   flag: '🇪🇸', short: 'ES' },
];

const LanguageSwitcher = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = i18n.resolvedLanguage || i18n.language || 'pt-BR';
  const activeLang = LANGUAGES.find(l =>
    current === l.code || current.startsWith(l.code.split('-')[0])
  ) || LANGUAGES[0];

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Botão — mostra só a bandeira ativa + seta  */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={`Idioma atual: ${activeLang.label}. Clique para mudar.`}
        aria-expanded={open}
        className="flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                   rounded-full px-2.5 py-1.5 transition-all duration-200 select-none"
      >
        <span className="text-lg leading-none">{activeLang.flag}</span>
        <span className="text-[11px] font-bold text-white/80 hidden lg:inline">{activeLang.short}</span>
        <ChevronDown className={`w-3 h-3 text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 bg-secondary/95 backdrop-blur-md
                        border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden
                        min-w-[130px] animate-in fade-in slide-in-from-top-1 duration-150">
          {LANGUAGES.map(lang => {
            const isActive = activeLang.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => select(lang.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold
                            transition-colors duration-150 text-left
                            ${isActive
                              ? 'bg-primary/20 text-primary'
                              : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="flex-1">{lang.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
