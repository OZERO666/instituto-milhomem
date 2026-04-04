/**
 * useTraducoesMulti — hook para tradução de listas de registros.
 *
 * Busca /traducoes/:tabela?lang=XX e retorna funções para aplicar
 * traduções sobre uma lista ou item individual.
 *
 * Exemplo de uso:
 *   const { applyList } = useTraducoesMulti('servicos');
 *   const translatedServices = applyList(services);
 */
import { useState, useEffect, useRef } from 'react';
import i18n from '@/i18n';

const API_BASE = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

const _cache = new Map();
const TTL = 30_000;

function getLocale() {
  const lang = i18n.resolvedLanguage || localStorage.getItem('im_lang') || 'pt-BR';
  if (lang.startsWith('pt')) return 'pt';
  return lang;
}

async function fetchAll(tabela, locale) {
  const key = `multi/${tabela}/${locale}`;
  const hit = _cache.get(key);
  if (hit && Date.now() - hit.ts < TTL) return hit.data;

  const res = await fetch(`${API_BASE}/traducoes/${tabela}?lang=${locale}`);
  if (!res.ok) return {};
  const data = await res.json();
  _cache.set(key, { data, ts: Date.now() });
  return data;
}

/**
 * @param {string} tabela - nome da tabela, ex: 'artigos'
 * @returns {{
 *   applyOne: (item: object) => object,
 *   applyList: (items: object[]) => object[],
 *   locale: string,
 *   map: Record<string, Record<string, string>>
 * }}
 */
export function useTraducoesMulti(tabela) {
  const [map, setMap] = useState({}); // { [id]: { campo: valor } }
  const [locale, setLocale] = useState(getLocale);
  const abortRef = useRef(null);

  useEffect(() => {
    const handler = () => setLocale(getLocale());
    i18n.on('languageChanged', handler);
    return () => i18n.off('languageChanged', handler);
  }, []);

  useEffect(() => {
    if (locale === 'pt') { setMap({}); return; }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    fetchAll(tabela, locale)
      .then(data => { if (!ctrl.signal.aborted) setMap(data); })
      .catch(() => {});

    return () => ctrl.abort();
  }, [tabela, locale]);

  const applyOne = (item) => {
    if (!item?.id || locale === 'pt') return item;
    const tr = map[String(item.id)];
    if (!tr) return item;
    const merged = { ...item };
    for (const [k, v] of Object.entries(tr)) {
      if (v?.trim()) merged[k] = v;
    }
    return merged;
  };

  const applyList = (items) => (Array.isArray(items) ? items.map(applyOne) : items);

  return { applyOne, applyList, locale, map };
}
