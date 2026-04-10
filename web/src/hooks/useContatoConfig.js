// src/hooks/useContatoConfig.js
import { useState, useEffect } from 'react';
import { CONTATO_DEFAULTS } from '@/config/site';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Cache em memória — evita re-fetch em cada componente que usa o hook
const CACHE_DISABLED = import.meta.env.VITE_DISABLE_CACHE === 'true';
let _cache = null;
let _promise = null;
const _listeners = [];

function notifyAll(data) {
  _listeners.forEach((fn) => fn(data));
}

function fetchContatoConfig() {
  if (!CACHE_DISABLED && _cache) return Promise.resolve(_cache);
  if (!CACHE_DISABLED && _promise) return _promise;

  _promise = fetch(`${API_URL}/contato-config`)
    .then((r) => r.json())
    .then((data) => {
      const d = Array.isArray(data) ? data[0] : data;
      const merged = d?.id ? { ...CONTATO_DEFAULTS, ...d } : CONTATO_DEFAULTS;
      _cache = merged;
      _promise = null;
      notifyAll(merged);
      return merged;
    })
    .catch(() => {
      _promise = null;
      return CONTATO_DEFAULTS;
    });

  return _promise;
}

export function useContatoConfig() {
  const [config, setConfig] = useState(() => (!CACHE_DISABLED && _cache) || CONTATO_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    const handler = (data) => { if (!cancelled) setConfig(data); };
    _listeners.push(handler);

    if (CACHE_DISABLED || !_cache) {
      fetchContatoConfig().then((data) => {
        if (!cancelled) setConfig(data);
      });
    }

    return () => {
      cancelled = true;
      const idx = _listeners.indexOf(handler);
      if (idx !== -1) _listeners.splice(idx, 1);
    };
  }, []);

  return config;
}

// Helper: monta URL do WhatsApp com telefone + mensagem dinâmicos
export function buildWhatsappUrl(phone, message, locale = 'pt-BR') {
  const normalizedPhone = String(phone || '').replace(/\D/g, '');
  const lang = String(locale || 'pt-BR').toLowerCase();
  const waLocale = lang.startsWith('es') ? 'es' : lang.startsWith('en') ? 'en' : 'pt-BR';
  const normalizedMessage = String(message || '');
  return `https://api.whatsapp.com/send?l=${waLocale}&phone=${normalizedPhone}&text=${encodeURIComponent(normalizedMessage)}`;
}

// Helper: remove máscara do telefone para usar em href="tel:"
export function formatTelHref(telefone = '') {
  return `tel:+55${telefone.replace(/\D/g, '')}`;
}
