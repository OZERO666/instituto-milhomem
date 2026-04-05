// src/features/admin/hooks/useHero.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { logAction } from '@/features/admin/utils/adminApi.js';

export function useHero(currentUser) {
  const [heroConfig,    setHeroConfig]    = useState(null);
  const [heroPresets,   setHeroPresets]   = useState([]);
  const [editingPreset, setEditingPreset] = useState(null);
  const [heroSaving,    setHeroSaving]    = useState(false);

  const heroForm   = useForm({ mode: 'onBlur', defaultValues: { badge: '', titulo: '', subtitulo: '', cta_texto: '', cta_link: '', imagem_fundo: '' } });
  const presetForm = useForm({ mode: 'onBlur', defaultValues: { nome: '', titulo: '', subtitulo: '', cta_texto: '', cta_link: '' } });

  const fetchHero = useCallback(async () => {
    try {
      const configRes = await api.fetch('/hero-config').then(r => r.json());
      const value = Array.isArray(configRes) ? configRes[0] : configRes;
      if (value?.id) { setHeroConfig(value); heroForm.reset(value); }
      const presetsRes = await api.fetch('/hero-presets').then(r => r.json());
      if (Array.isArray(presetsRes)) setHeroPresets(presetsRes);
    } catch (err) { console.error('Error fetching hero:', err); toast.error('Erro ao carregar configurações do hero'); }
  }, [heroForm]);

  const handleHeroConfigSubmit = async (data) => {
    setHeroSaving(true);
    try {
      const sanitizedData = sanitizeObject(data);
      const method = heroConfig?.id ? 'PUT' : 'POST';
      const url    = heroConfig?.id ? `/hero-config/${heroConfig.id}` : '/hero-config';
      const res    = await api.fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      await logAction(heroConfig?.id ? 'UPDATE' : 'CREATE', 'hero_config', saved.id, 'Updated hero config', currentUser);
      toast.success('Hero atualizado com sucesso!');
      setHeroConfig(saved); heroForm.reset(saved); fetchHero();
    } catch (err) { toast.error(`Erro ao salvar hero: ${err.message}`); }
    finally { setHeroSaving(false); }
  };

  const handlePresetSubmit = async (data) => {
    try {
      const sanitizedData = sanitizeObject(data);
      if (editingPreset) {
        const res = await api.fetch(`/hero-presets/${editingPreset.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
        if (!res.ok) throw new Error(await res.text());
        await logAction('UPDATE', 'hero_presets', editingPreset.id, `Updated preset: ${sanitizedData.nome}`, currentUser);
        toast.success('Preset atualizado!');
        setEditingPreset(null);
      } else {
        const res = await api.fetch('/hero-presets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
        if (!res.ok) throw new Error(await res.text());
        const record = await res.json();
        await logAction('CREATE', 'hero_presets', record.id, `Created preset: ${sanitizedData.nome}`, currentUser);
        toast.success('Preset criado!');
      }
      presetForm.reset();
      fetchHero();
    } catch (error) { toast.error(`Erro ao salvar preset: ${error.message}`); }
  };

  const handleActivatePreset = (preset) => {
    heroForm.reset({ titulo: preset.titulo, subtitulo: preset.subtitulo, cta_texto: preset.cta_texto, cta_link: preset.cta_link, badge: preset.badge });
    toast.success(`Preset "${preset.nome}" carregado! Clique em Salvar para aplicar.`);
  };

  return {
    heroConfig, heroPresets, editingPreset, setEditingPreset, heroSaving,
    heroForm, presetForm, fetchHero,
    handleHeroConfigSubmit, handlePresetSubmit, handleActivatePreset,
  };
}
