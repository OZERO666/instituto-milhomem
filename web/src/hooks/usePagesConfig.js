import { useEffect, useState } from 'react';
import api from '@/lib/apiServerClient';
import { PAGE_CONFIG_DEFAULTS } from '@/config/site';

const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

const deepMerge = (base, override) => {
  if (Array.isArray(base)) {
    return Array.isArray(override) && override.length > 0 ? override : base;
  }

  if (isObject(base)) {
    const output = { ...base };
    if (!isObject(override)) return output;

    Object.keys(override).forEach((key) => {
      const nextValue = override[key];
      if (nextValue === undefined || nextValue === null) return;

      if (key in output) {
        output[key] = deepMerge(output[key], nextValue);
      } else {
        output[key] = nextValue;
      }
    });

    return output;
  }

  return override === undefined || override === null ? base : override;
};

// Cache em memória: { pageKey → { data, promise } }
// "promise" evita requisições duplicadas em paralelo (cache-while-revalidating)
const CACHE_DISABLED = import.meta.env.VITE_DISABLE_CACHE === 'true';
const _cache = {};
const _listeners = {};

function notify(pageKey, data) {
  (_listeners[pageKey] || []).forEach((fn) => fn(data));
}

async function fetchPageConfig(pageKey) {
  if (!CACHE_DISABLED && _cache[pageKey]?.data) return _cache[pageKey].data;
  if (!CACHE_DISABLED && _cache[pageKey]?.promise) return _cache[pageKey].promise;

  const promise = api
    .fetch(`/pages-config/${pageKey}`)
    .then((r) => r.json())
    .then((payload) => {
      const normalized = { ...(payload || {}) };
      delete normalized.id;
      delete normalized.page_key;
      _cache[pageKey] = { data: normalized, promise: null };
      notify(pageKey, normalized);
      return normalized;
    })
    .catch(() => {
      delete _cache[pageKey];
      return null;
    });

  _cache[pageKey] = { data: null, promise };
  return promise;
}

export function usePagesConfig(pageKey) {
  const defaults = PAGE_CONFIG_DEFAULTS[pageKey] || {};
  const [config, setConfig] = useState(() => {
    // Retorna do cache imediatamente se já disponível (respeitando flag de disable)
    const cached = !CACHE_DISABLED && _cache[pageKey]?.data;
    return cached ? deepMerge(defaults, cached) : defaults;
  });

  useEffect(() => {
    let cancelled = false;

    // Registra listener para atualizações futuras
    if (!_listeners[pageKey]) _listeners[pageKey] = [];
    const handler = (data) => {
      if (!cancelled) setConfig(deepMerge(defaults, data));
    };
    _listeners[pageKey].push(handler);

    // Se já está no cache, não refaz fetch (a menos que cache esteja desabilitado)
    if (CACHE_DISABLED || !_cache[pageKey]?.data) {
      fetchPageConfig(pageKey).then((data) => {
        if (!cancelled && data) setConfig(deepMerge(defaults, data));
      });
    }

    return () => {
      cancelled = true;
      _listeners[pageKey] = (_listeners[pageKey] || []).filter((fn) => fn !== handler);
    };
  }, [pageKey]);

  return config;
}

export { deepMerge };
