import { useState, useEffect } from 'react';
import { SOBRE_DEFAULTS } from '@/config/site';
import { parseJsonArray } from '@/features/admin/utils/sobreConfig.js';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const normalizeSobreConfig = (data = {}) => ({
  ...SOBRE_DEFAULTS,
  ...data,
  values: parseJsonArray(data.values).length ? parseJsonArray(data.values) : SOBRE_DEFAULTS.values,
  team: parseJsonArray(data.team).length ? parseJsonArray(data.team) : SOBRE_DEFAULTS.team,
  doctor_credentials: parseJsonArray(data.doctor_credentials).length
    ? parseJsonArray(data.doctor_credentials)
    : SOBRE_DEFAULTS.doctor_credentials,
});

export function useSobreConfig() {
  const [config, setConfig] = useState(SOBRE_DEFAULTS);

  useEffect(() => {
    fetch(`${API_URL}/sobre-config`)
      .then(r => r.json())
      .then(data => {
        const d = Array.isArray(data) ? data[0] : data;
        if (d?.id) {
          setConfig(normalizeSobreConfig(d));
        }
      })
      .catch(() => {});
  }, []);

  return config;
}
