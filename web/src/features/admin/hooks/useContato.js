// src/features/admin/hooks/useContato.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { uploadFile, logAction } from '@/features/admin/utils/adminApi.js';

export function useContato(currentUser) {
  const [contactConfig, setContactConfig] = useState(null);
  const [isLoading,     setIsLoading]     = useState(false);

  const contactForm = useForm({ mode: 'onBlur', defaultValues: { telefone: '', whatsapp: '', email: '', instagram: '', facebook: '', maps_url: '', nome_local: '', latitude: '', longitude: '', zoom: '17', endereco: '', dias_funcionamento: '', horario: '', mensagem_header: '', mensagem_whatsapp: '' } });

  const fetchContato = useCallback(async () => {
    setIsLoading(true);
    try {
      const res   = await api.fetch('/contato-config').then(r => r.json());
      const value = Array.isArray(res) ? res[0] : res;
      if (value?.id) { setContactConfig(value); contactForm.reset(value); }
    } catch (err) { console.error('Error fetching contato config:', err); toast.error('Erro ao carregar configurações de contato'); }
    finally { setIsLoading(false); }
  }, [contactForm]);

  const handleContactSubmit = async (data, onSuccess) => {
    try {
      const sanitizedData = sanitizeObject(data);
      const fileFields = [
        { field: 'logo_url',         inputId: 'logo_url_file' },
        { field: 'favicon_url',      inputId: 'favicon_url_file' },
        { field: 'sobre_hero_image', inputId: 'branding_sobre_hero_image_file' },
      ];
      for (const { field, inputId } of fileFields) {
        const input = document.getElementById(inputId);
        const file  = input?.files?.[0];
        if (file) {
          sanitizedData[field] = await uploadFile(file, 'misc');
          if (input) input.value = '';
        } else if (sanitizedData[field]) {
          // já tem URL nova (enviada pelo botão de upload direto) — mantém
        } else if (contactConfig?.[field]) {
          sanitizedData[field] = contactConfig[field];
        } else {
          delete sanitizedData[field];
        }
      }
      const method = contactConfig?.id ? 'PUT' : 'POST';
      const url    = contactConfig?.id ? `/contato-config/${contactConfig.id}` : '/contato-config';
      const res    = await api.fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      await logAction(contactConfig?.id ? 'UPDATE' : 'CREATE', 'contato_config', saved.id, 'Updated contact config', currentUser);
      toast.success('Configurações de contato atualizadas!');
      setContactConfig(saved); contactForm.reset(saved);
      if (onSuccess) onSuccess();
    } catch { toast.error('Erro ao atualizar configurações'); }
  };

  return { contactConfig, isLoading, contactForm, fetchContato, handleContactSubmit };
}
