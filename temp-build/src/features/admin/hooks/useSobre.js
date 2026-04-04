// src/features/admin/hooks/useSobre.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { uploadFile, logAction } from '@/features/admin/utils/adminApi.js';
import { normalizeSobreConfig } from '@/features/admin/utils/sobreConfig.js';

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
      const imageFields = [
        { field: 'hero_image',       inputId: 'sobre_hero_image_file' },
        { field: 'doctor_image',     inputId: 'sobre_doctor_image_file' },
        { field: 'about_image',      inputId: 'sobre_about_image_file' },
        { field: 'technology_image', inputId: 'sobre_technology_image_file' },
      ];
      for (const { field, inputId } of imageFields) {
        const input = document.getElementById(inputId);
        const file  = input?.files?.[0];
        if (file) {
          data[field] = await uploadFile(file, 'misc');
          if (input) input.value = '';
        } else if (sobreConfig?.[field]) {
          data[field] = sobreConfig[field];
        }
      }

      const sanitizedData = sanitizeObject(data);
      sanitizedData.values             = data.values             || [];
      sanitizedData.team               = data.team               || [];
      sanitizedData.doctor_credentials = data.doctor_credentials || [];

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
