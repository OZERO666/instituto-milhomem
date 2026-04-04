/**
 * useTraducoes — hook para tradução de um único registro.
 *
 * Busca /traducoes/:tabela/:registroId?lang=XX e retorna uma função apply()
 * que mescla as traduções sobre o objeto original.
 *
 * Quando o idioma ativo é pt/pt-BR, não faz nenhuma requisição — retorna
 * o dado original sem alteração.
 */
import { useState, useEffect, useRef } from 'react';
import i18n from '@/i18n';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

// Cache em memória — evita refetch em re-renders
const _cache = new Map();
const TTL = 30_000; // 30 s

function getLocale() {
  const lang = i18n.resolvedLanguage || localStorage.getItem('im_lang') || 'pt-BR';
  if (lang.startsWith('pt')) return 'pt';
  return lang; // 'en' | 'es'
}

async function fetchTrad(tabela, registroId, locale) {
  const key = `${tabela}/${registroId}/${locale}`;
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const res = await fetch(`${API_BASE}/traducoes/${tabela}/${encodeURIComponent(registroId)}?lang=${locale}`);
  if (!res.ok) return {};
  const data = await res.json();
  _cache.set(key, { data, ts: Date.now() });
  return data;
}

/**
 * @param {string} tabela - nome da tabela, ex: 'servicos'
 * @param {string|number|null|undefined} registroId - ID do registro
 * @returns {{ apply: (original: object) => object, locale: string, isLoading: boolean }}
 */
export function useTraducoes(tabela, registroId) {
  const [traducoes, setTraducoes] = useState({});
  const [locale, setLocale] = useState(getLocale);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef(null);

  // Observa mudanças de idioma
  useEffect(() => {
    const handler = () => setLocale(getLocale());
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  useEffect(() => {
    if (locale === 'pt' || !registroId) {
      setTraducoes({});
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setIsLoading(true);
    fetchTrad(tabela, registroId, locale)
      .then(data => { if (!ctrl.signal.aborted) setTraducoes(data); })
      .catch(() => {})
      .finally(() => { if (!ctrl.signal.aborted) setIsLoading(false); });

    return () => ctrl.abort();
  }, [tabela, registroId, locale]);

  /**
   * Mescla as traduções sobre o objeto original.
   * Campos vazios na tabela traducoes não sobrescrevem o original.
   */
  const apply = (original) => {
    if (!original || locale === 'pt' || !Object.keys(traducoes).length) return original;
    const merged = { ...original };
    for (const [k, v] of Object.entries(traducoes)) {
      if (v?.trim()) merged[k] = v;
    }
    return merged;
  };

  return { apply, locale, isLoading, traducoes };
}
