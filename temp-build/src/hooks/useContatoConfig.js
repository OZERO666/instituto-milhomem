// src/hooks/useContatoConfig.js
import { useState, useEffect } from 'react';
import { CONTATO_DEFAULTS } from '@/config/site';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useContatoConfig() {
  const [config, setConfig] = useState(CONTATO_DEFAULTS);

  useEffect(() => {
    fetch(`${API_URL}/contato-config`)
      .then(r => r.json())
      .then(data => {
        const d = Array.isArray(data) ? data[0] : data;
        if (d?.id) setConfig({ ...CONTATO_DEFAULTS, ...d });
      })
      .catch(() => {});
  }, []);

  return config;
}

// Helper: monta URL do WhatsApp com telefone + mensagem dinâmicos
export function buildWhatsappUrl(phone, message) {
  return `https://api.whatsapp.com/send?l=pt-BR&phone=${phone}&text=${encodeURIComponent(message)}`;
}

// Helper: remove máscara do telefone para usar em href="tel:"
export function formatTelHref(telefone = '') {
  return `tel:+55${telefone.replace(/\D/g, '')}`;
}
