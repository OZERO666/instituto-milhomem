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

export function usePagesConfig(pageKey) {
  const defaults = PAGE_CONFIG_DEFAULTS[pageKey] || {};
  const [config, setConfig] = useState(defaults);

  useEffect(() => {
    let cancelled = false;

    const fetchConfig = async () => {
      try {
        const payload = await api.fetch(`/pages-config/${pageKey}`).then((r) => r.json());
        if (cancelled) return;

        const normalized = { ...(payload || {}) };
        delete normalized.id;
        delete normalized.page_key;

        setConfig(deepMerge(defaults, normalized));
      } catch {
        if (!cancelled) setConfig(defaults);
      }
    };

    fetchConfig();
    return () => {
      cancelled = true;
    };
  }, [pageKey]);

  return config;
}

export { deepMerge };
