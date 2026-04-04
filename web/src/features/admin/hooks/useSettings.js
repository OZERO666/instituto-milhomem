// src/features/admin/hooks/useSettings.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const DEFAULTS = {
  primary_color:    '#C8A16E',
  secondary_color:  '#181B1E',
  accent_color:     '#FFDEA4',
  background_color: '#FFFFFF',
  foreground_color: '#1A1A1A',
  muted_color:      '#F5F5F5',
  card_color:       '#FFFFFF',
  border_color:     '#E0E0E0',
  site_name:        'Instituto Milhomem',
  logo_size_header: '56',
  logo_size_footer: '48',
  robots_noindex:   'false',
  blog_disabled:    'false',
};

export function useSettings() {
  const { refetch } = useSiteSettings();
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  const settingsForm = useForm({
    mode: 'onBlur',
    defaultValues: DEFAULTS,
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res  = await api.fetch('/settings');
      const data = await res.json();
      if (data && typeof data === 'object') {
        settingsForm.reset({
          primary_color:    data.primary_color    || DEFAULTS.primary_color,
          secondary_color:  data.secondary_color  || DEFAULTS.secondary_color,
          accent_color:     data.accent_color     || DEFAULTS.accent_color,
          background_color: data.background_color || DEFAULTS.background_color,
          foreground_color: data.foreground_color || DEFAULTS.foreground_color,
          muted_color:      data.muted_color      || DEFAULTS.muted_color,
          card_color:       data.card_color       || DEFAULTS.card_color,
          border_color:     data.border_color     || DEFAULTS.border_color,
          site_name:        data.site_name        || DEFAULTS.site_name,
          logo_size_header: data.logo_size_header || DEFAULTS.logo_size_header,
          logo_size_footer: data.logo_size_footer || DEFAULTS.logo_size_footer,
          robots_noindex:   data.robots_noindex   ?? DEFAULTS.robots_noindex,
          blog_disabled:    data.blog_disabled    ?? DEFAULTS.blog_disabled,
        });
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Erro ao carregar configurações do tema');
    }
  }, [settingsForm]);

  const handleSettingsSubmit = useCallback(async (data) => {
    setSaveStatus('saving');
    try {
      const res = await api.fetch('/settings', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ settings: data }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${res.status}`);
      }
      const updated = await res.json();
      settingsForm.reset({
        primary_color:    updated.primary_color    || data.primary_color,
        secondary_color:  updated.secondary_color  || data.secondary_color,
        accent_color:     updated.accent_color     || data.accent_color,
        background_color: updated.background_color || data.background_color,
        foreground_color: updated.foreground_color || data.foreground_color,
        muted_color:      updated.muted_color      || data.muted_color,
        card_color:       updated.card_color       || data.card_color,
        border_color:     updated.border_color     || data.border_color,
        site_name:        updated.site_name        || data.site_name,
        logo_size_header: updated.logo_size_header || data.logo_size_header,
        logo_size_footer: updated.logo_size_footer || data.logo_size_footer,
        robots_noindex:   updated.robots_noindex   ?? data.robots_noindex,
        blog_disabled:    updated.blog_disabled    ?? data.blog_disabled,
      });
      refetch(); // atualiza useTheme → aplica cores imediatamente
      setSaveStatus('saved');
      toast.success('Configurações salvas! As cores foram aplicadas. Recarregue o site para que os visitantes vejam as mudanças.');
      setTimeout(() => setSaveStatus(null), 5000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setSaveStatus('error');
      toast.error(`Erro ao salvar: ${err.message}`);
      setTimeout(() => setSaveStatus(null), 5000);
    }
  }, [settingsForm, refetch]);

  return { settingsForm, saveStatus, fetchSettings, handleSettingsSubmit };
}
