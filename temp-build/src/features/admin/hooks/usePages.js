// src/features/admin/hooks/usePages.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { logAction } from '@/features/admin/utils/adminApi.js';
import { PAGE_CONFIG_DEFAULTS } from '@/config/site';
import { deepMerge } from '@/hooks/usePagesConfig';

export const PAGES_CONFIG_KEYS = Object.keys(PAGE_CONFIG_DEFAULTS);

const buildPagesFormDefaults = (rows = []) => {
  const rowsByKey = Array.isArray(rows)
    ? rows.reduce((acc, row) => {
        if (row?.page_key) acc[row.page_key] = row;
        return acc;
      }, {})
    : {};
  return PAGES_CONFIG_KEYS.reduce((acc, key) => {
    const row = rowsByKey[key] || {};
    const normalized = { ...row };
    delete normalized.id;
    delete normalized.page_key;
    acc[key] = deepMerge(PAGE_CONFIG_DEFAULTS[key], normalized);
    return acc;
  }, {});
};

export function usePages(currentUser) {
  const [pagesConfig,  setPagesConfig]  = useState({});
  const [pagesSaving,  setPagesSaving]  = useState(false);
  const [pagesSection, setPagesSection] = useState('home');

  const pagesForm = useForm({ mode: 'onBlur', defaultValues: buildPagesFormDefaults() });

  const fetchPages = useCallback(async () => {
    try {
      const res  = await api.fetch('/pages-config').then(r => r.json());
      const list = Array.isArray(res) ? res : [];
      const byKey = list.reduce((acc, row) => {
        if (row?.page_key) acc[row.page_key] = row;
        return acc;
      }, {});
      setPagesConfig(byKey);
      pagesForm.reset(buildPagesFormDefaults(list));
    } catch (err) { console.error('Error fetching pages config:', err); toast.error('Erro ao carregar configurações de páginas'); }
  }, [pagesForm]);

  const handlePagesSubmit = async (data) => {
    setPagesSaving(true);
    try {
      for (const pageKey of PAGES_CONFIG_KEYS) {
        const payload  = sanitizeObject(data?.[pageKey] || {});
        const response = await api.fetch(`/pages-config/${pageKey}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(await response.text());
        const saved = await response.json();
        await logAction('UPDATE', 'pages_config', saved.id, `Updated page config: ${pageKey}`, currentUser);
      }
      toast.success('Configurações das páginas atualizadas com sucesso!');
      fetchPages();
    } catch (error) {
      toast.error(`Erro ao salvar configurações das páginas: ${error.message}`);
    } finally {
      setPagesSaving(false);
    }
  };

  return { pagesConfig, pagesSaving, pagesSection, setPagesSection, pagesForm, PAGES_CONFIG_KEYS, fetchPages, handlePagesSubmit };
}
