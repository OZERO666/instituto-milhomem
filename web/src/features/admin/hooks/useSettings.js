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
  logo_size_header_mobile: '40',
  logo_size_header_tablet: '48',
  logo_size_footer_mobile: '36',
  logo_size_footer_tablet: '40',
  container_max_width: '1280',
  container_padding_mobile: '16',
  container_padding_tablet: '24',
  container_padding_desktop: '32',
  section_padding_mobile: '48',
  section_padding_tablet: '64',
  section_padding_desktop: '80',
  hero_min_height_mobile: '560',
  hero_min_height_desktop: '980',
  mobile_type_scale: '100',
  show_decorations_mobile: 'true',
  robots_noindex:   'false',
  blog_disabled:    'false',
};

const normalizeSettings = (source = {}) => ({
  primary_color: source.primary_color || DEFAULTS.primary_color,
  secondary_color: source.secondary_color || DEFAULTS.secondary_color,
  accent_color: source.accent_color || DEFAULTS.accent_color,
  background_color: source.background_color || DEFAULTS.background_color,
  foreground_color: source.foreground_color || DEFAULTS.foreground_color,
  muted_color: source.muted_color || DEFAULTS.muted_color,
  card_color: source.card_color || DEFAULTS.card_color,
  border_color: source.border_color || DEFAULTS.border_color,
  site_name: source.site_name || DEFAULTS.site_name,
  logo_size_header: source.logo_size_header || DEFAULTS.logo_size_header,
  logo_size_footer: source.logo_size_footer || DEFAULTS.logo_size_footer,
  container_max_width: source.container_max_width || DEFAULTS.container_max_width,
  container_padding_mobile: source.container_padding_mobile || DEFAULTS.container_padding_mobile,
  container_padding_tablet: source.container_padding_tablet || DEFAULTS.container_padding_tablet,
  container_padding_desktop: source.container_padding_desktop || DEFAULTS.container_padding_desktop,
  section_padding_mobile: source.section_padding_mobile || DEFAULTS.section_padding_mobile,
  section_padding_tablet: source.section_padding_tablet || DEFAULTS.section_padding_tablet,
  section_padding_desktop: source.section_padding_desktop || DEFAULTS.section_padding_desktop,
  hero_min_height_mobile: source.hero_min_height_mobile || DEFAULTS.hero_min_height_mobile,
  hero_min_height_desktop: source.hero_min_height_desktop || DEFAULTS.hero_min_height_desktop,
  mobile_type_scale: source.mobile_type_scale || DEFAULTS.mobile_type_scale,
  show_decorations_mobile: source.show_decorations_mobile ?? DEFAULTS.show_decorations_mobile,
  logo_size_header_mobile: source.logo_size_header_mobile || DEFAULTS.logo_size_header_mobile,
  logo_size_header_tablet: source.logo_size_header_tablet || DEFAULTS.logo_size_header_tablet,
  logo_size_footer_mobile: source.logo_size_footer_mobile || DEFAULTS.logo_size_footer_mobile,
  logo_size_footer_tablet: source.logo_size_footer_tablet || DEFAULTS.logo_size_footer_tablet,
  robots_noindex: source.robots_noindex ?? DEFAULTS.robots_noindex,
  blog_disabled: source.blog_disabled ?? DEFAULTS.blog_disabled,
});

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
        settingsForm.reset(normalizeSettings(data));
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
      settingsForm.reset(normalizeSettings({ ...data, ...updated }));
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
