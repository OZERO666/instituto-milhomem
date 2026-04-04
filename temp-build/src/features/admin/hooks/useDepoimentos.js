// src/features/admin/hooks/useDepoimentos.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import api from '@/lib/apiServerClient';
import { genericSubmit } from '@/features/admin/utils/adminApi.js';

export function useDepoimentos(currentUser) {
  const [testimonials, setTestimonials] = useState([]);
  const [editingItem,  setEditingItem]  = useState(null);
  const [isLoading,    setIsLoading]    = useState(false);

  const testimonialForm = useForm({ mode: 'onBlur', defaultValues: { nome: '', cargo: '', mensagem: '', foto: '' } });

  const fetchDepoimentos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.fetch('/depoimentos').then(r => r.json());
      if (Array.isArray(res)) setTestimonials(res);
    } catch (err) { console.error('Error fetching depoimentos:', err); toast.error('Erro ao carregar depoimentos'); }
    finally { setIsLoading(false); }
  }, []);

  const handleDepoimentosSubmit = (data, onSuccess) =>
    genericSubmit({
      collection: 'depoimentos',
      data,
      form: testimonialForm,
      fileFields: ['foto'],
      editingItem,
      setEditingItem,
      currentUser,
      onSuccess,
    });

  return { testimonials, isLoading, testimonialForm, editingItem, setEditingItem, fetchDepoimentos, handleDepoimentosSubmit };
}
