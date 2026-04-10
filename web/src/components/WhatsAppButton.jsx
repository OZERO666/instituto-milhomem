import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useContatoConfig, buildWhatsappUrl } from '@/hooks/useContatoConfig';
import { useTraducoes } from '@/hooks/useTraducoes';

// Ícone SVG oficial do WhatsApp
const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12.004 2C6.477 2 2 6.477 2 12.004c0 1.771.463 3.432 1.27 4.876L2 22l5.273-1.233A9.953 9.953 0 0012.004 22C17.527 22 22 17.527 22 12.004 22 6.477 17.527 2 12.004 2zm0 18.214a8.21 8.21 0 01-4.186-1.144l-.3-.178-3.129.731.748-3.047-.196-.313a8.214 8.214 0 1114.888-4.259 8.22 8.22 0 01-7.825 8.21z"/>
  </svg>
);

const WhatsAppButton = () => {
  const { t, i18n } = useTranslation();
  const config = useContatoConfig();
  const { apply } = useTraducoes('contato_config', config?.id);
  const translatedConfig = apply(config);
  const [tooltip, setTooltip]   = useState(false);
  const [pulse, setPulse]       = useState(false);

  useEffect(() => {
    // Pulsa periodicamente para chamar atenção
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const whatsappUrl = buildWhatsappUrl(
    translatedConfig?.whatsapp,
    translatedConfig?.mensagem_whatsapp || t('whatsapp_floating.default_message'),
    i18n.resolvedLanguage,
  );

  return (
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-end gap-3">

      {/* TOOLTIP */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, x: 16, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-secondary text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-border whitespace-nowrap max-w-[220px] text-right leading-snug"
          >
              {t('whatsapp_floating.tooltip_title')}
              <p className="text-xs text-muted-foreground font-normal mt-0.5">{t('whatsapp_floating.tooltip_subtitle')}</p>
            {/* Seta */}
            <div className="absolute right-3 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white drop-shadow-sm" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTÃO */}
      <div className="relative">

        {/* PING externo */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />

        {/* PULSE RING ao chamar atenção */}
        <AnimatePresence>
          {pulse && (
            <motion.span
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.9, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 rounded-full bg-[#25D366] pointer-events-none"
            />
          )}
        </AnimatePresence>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('whatsapp_floating.aria_label')}
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          onFocus={() => setTooltip(true)}
          onBlur={() => setTooltip(false)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 18 }}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
          className="relative z-10 flex items-center justify-center w-16 h-16 md:w-[68px] md:h-[68px] rounded-full shadow-2xl transition-shadow duration-300"
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: '0 8px 32px 0 rgba(37,211,102,0.45)',
          }}
        >
          <WhatsAppIcon className="w-8 h-8 md:w-9 md:h-9 text-white drop-shadow" />
        </motion.a>
      </div>
    </div>
  );
};

export default WhatsAppButton;
