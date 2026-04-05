// src/features/admin/hooks/useGaleria.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';
import { genericSubmit, logAction } from '@/features/admin/utils/adminApi.js';

export function useGaleria(currentUser) {
  const [galleryItems,  setGalleryItems]  = useState([]);
  const [galleryThemes, setGalleryThemes] = useState([]);
  const [editingItem,   setEditingItem]   = useState(null);
  const [editingTheme,  setEditingTheme]  = useState(null);
  const [isLoading,     setIsLoading]     = useState(false);

  const galleryForm = useForm({ mode: 'onBlur', defaultValues: { titulo: '', tema_id: '', meses_pos_operatorio: '', foto_antes: '', foto_depois: '' } });
  const themeForm   = useForm({ mode: 'onBlur', defaultValues: { nome: '' } });

  const fetchGaleria = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await api.fetch('/galeria').then(r => r.json());
      if (Array.isArray(items)) setGalleryItems(items);
      const themes = await api.fetch('/galeria-temas').then(r => r.json());
      if (Array.isArray(themes)) setGalleryThemes(themes);
    } catch (err) { console.error('Error fetching galeria:', err); toast.error('Erro ao carregar galeria'); }
    finally { setIsLoading(false); }
  }, []);

  const handleGaleriaSubmit = (data, onSuccess) =>
    genericSubmit({
      collection: 'galeria',
      data,
      form: galleryForm,
      editingItem,
      setEditingItem,
      currentUser,
      onSuccess,
    });

  const handleThemeSubmit = async (data, onSuccess) => {
    try {
      const sanitizedData = sanitizeObject(data);
      if (editingTheme) {
        const res = await api.fetch(`/galeria-temas/${editingTheme.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
        if (!res.ok) throw new Error(await res.text());
        await logAction('UPDATE', 'galeria-temas', editingTheme.id, `Updated tema: ${sanitizedData.nome}`, currentUser);
        toast.success('Tema atualizado!');
        setEditingTheme(null);
      } else {
        const res = await api.fetch('/galeria-temas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
        if (!res.ok) throw new Error(await res.text());
        const record = await res.json();
        await logAction('CREATE', 'galeria-temas', record.id, `Created tema: ${sanitizedData.nome}`, currentUser);
        toast.success('Tema criado!');
      }
      themeForm.reset();
      if (onSuccess) onSuccess();
    } catch (error) { toast.error(`Erro ao salvar tema: ${error.message}`); }
  };

  return {
    galleryItems, galleryThemes, isLoading,
    galleryForm, themeForm,
    editingItem, setEditingItem,
    editingTheme, setEditingTheme,
    fetchGaleria, handleGaleriaSubmit, handleThemeSubmit,
  };
}
