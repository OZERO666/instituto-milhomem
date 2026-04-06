// src/features/admin/hooks/useSeo.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';

export function useSeo() {
  const [seoList,    setSeoList]    = useState([]);
  const [seoEditing, setSeoEditing] = useState(null); // selected item { id, page_name }
  const [isLoading,  setIsLoading]  = useState(false);
  const [isRegeneratingSitemap, setIsRegeneratingSitemap] = useState(false);
  const [sitemapStatus, setSitemapStatus] = useState(null);

  const seoForm = useForm({ mode: 'onBlur',
    defaultValues: { meta_title: '', meta_description: '', keywords: '', og_image: '' },
  });

  const fetchSeo = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.fetch('/seo-settings').then(r => r.json());
      setSeoList(Array.isArray(res) ? res : []);
    } catch (err) { console.error('Error fetching SEO:', err); toast.error('Erro ao carregar dados de SEO'); }
    finally { setIsLoading(false); }
  }, []);

  const handleEditSeo = useCallback((item) => {
    setSeoEditing(item);
    seoForm.reset({
      meta_title:       item.meta_title       || '',
      meta_description: item.meta_description || '',
      keywords:         item.keywords         || '',
      og_image:         item.og_image         || '',
    });
  }, [seoForm]);

  const handleCancelSeo = useCallback(() => {
    setSeoEditing(null);
    seoForm.reset();
  }, [seoForm]);

  const onSeoSubmit = useCallback(async (data) => {
    try {
      await api.fetch(`/seo-settings/${seoEditing.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });
      toast.success('SEO atualizado com sucesso!');
      setSeoEditing(null);
      seoForm.reset();
      fetchSeo();
    } catch (err) {
      toast.error(`Erro ao salvar SEO: ${err.message}`);
    }
  }, [seoEditing, seoForm, fetchSeo]);

  const regenerateSitemap = useCallback(async () => {
    setIsRegeneratingSitemap(true);
    try {
      const response = await api.fetch('/seo-settings/sitemap/regenerate', {
        method: 'POST',
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error || 'Falha ao regenerar sitemap');
      }

      setSitemapStatus(payload);
      toast.success('Sitemap regenerado com sucesso!');
    } catch (err) {
      toast.error(`Erro ao regenerar sitemap: ${err.message}`);
    } finally {
      setIsRegeneratingSitemap(false);
    }
  }, []);

  return {
    seoList,
    seoEditing,
    seoForm,
    isLoading,
    fetchSeo,
    handleEditSeo,
    handleCancelSeo,
    onSeoSubmit,
    regenerateSitemap,
    isRegeneratingSitemap,
    sitemapStatus,
  };
}
