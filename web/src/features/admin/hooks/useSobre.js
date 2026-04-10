// src/features/admin/hooks/useSobre.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { logAction } from '@/features/admin/utils/adminApi.js';
import { normalizeSobreConfig } from '@/features/admin/utils/sobreConfig.js';
import { SOBRE_DEFAULTS } from '@/config/site';

export function useSobre(currentUser) {
  const [sobreConfig,  setSobreConfig]  = useState(null);
  const [sobreSaving,  setSobreSaving]  = useState(false);
  const [sobreSection, setSobreSection] = useState('hero');

  const sobreForm = useForm({ mode: 'onBlur', defaultValues: {} });

  const fetchSobre = useCallback(async () => {
    try {
      const res   = await api.fetch('/sobre-config').then(r => r.json());
      const value = Array.isArray(res) ? res[0] : res;
      if (value?.id) {
        const normalized = normalizeSobreConfig(value);
        setSobreConfig(normalized);
        sobreForm.reset(normalized);
      }
    } catch (err) { console.error('Error fetching sobre config:', err); toast.error('Erro ao carregar configurações da página Sobre'); }
  }, [sobreForm]);

  const handleSobreSubmit = async (data) => {
    setSobreSaving(true);
    try {
      const teamRaw = data.team || [];
      const team = teamRaw.map((member) => {
        const { _previewUrl, ...cleanMember } = member;
        return cleanMember;
      });

      const sanitizedData = sanitizeObject(data);
      sanitizedData.values             = data.values             || [];
      sanitizedData.team               = team;
      sanitizedData.doctor_credentials = data.doctor_credentials || [];
      sanitizedData.sections = {
        ...SOBRE_DEFAULTS.sections,
        ...(data.sections || {}),
      };

      const method = sobreConfig?.id ? 'PUT' : 'POST';
      const url    = sobreConfig?.id ? `/sobre-config/${sobreConfig.id}` : '/sobre-config';
      const res    = await api.fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
      if (!res.ok) throw new Error(await res.text());
      const saved          = await res.json();
      const normalizedSaved = normalizeSobreConfig(saved);
      await logAction(sobreConfig?.id ? 'UPDATE' : 'CREATE', 'sobre_config', saved.id, 'Updated sobre config', currentUser);
      toast.success('Configurações da página Sobre atualizadas!');
      setSobreConfig(normalizedSaved);
      sobreForm.reset(normalizedSaved);
      fetchSobre();
    } catch (err) {
      toast.error(`Erro ao salvar: ${err.message}`);
    } finally {
      setSobreSaving(false);
    }
  };

  return { sobreConfig, sobreSaving, sobreSection, setSobreSection, sobreForm, fetchSobre, handleSobreSubmit };
}
