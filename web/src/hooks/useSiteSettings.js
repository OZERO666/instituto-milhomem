// src/hooks/useSiteSettings.js
// Cache em memória compartilhado entre todos os componentes que usam este hook
import { useState, useEffect } from 'react';
import api from '@/lib/apiServerClient';

let _cache = null;
let _listeners = [];

function notifyListeners(data) {
  _cache = data;
  _listeners.forEach((fn) => fn(data));
}

// Chamado pelo hook useSettings do admin após salvar — força refetch em todos
export function invalidateSiteSettings() {
  _cache = null;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(_cache);
  const [loading,  setLoading]  = useState(!_cache);

  useEffect(() => {
    const listener = (data) => setSettings(data);
    _listeners.push(listener);

    if (_cache) {
      setSettings(_cache);
      setLoading(false);
    } else {
      setLoading(true);
      api.fetch('/settings')
        .then((r) => r.json())
        .then((data) => {
          notifyListeners(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }

    return () => {
      _listeners = _listeners.filter((fn) => fn !== listener);
    };
  }, []);

  const refetch = () => {
    _cache = null;
    setLoading(true);
    api.fetch('/settings')
      .then((r) => r.json())
      .then((data) => {
        notifyListeners(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  return { settings, loading, refetch };
}
