// src/features/admin/hooks/useEstatisticas.js
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { logAction } from '@/features/admin/utils/adminApi.js';

export function useEstatisticas(currentUser) {
  const [stats,     setStats]     = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const statsForm = useForm({ mode: 'onBlur', defaultValues: { procedimentos: '', satisfacao: '', experiencia: '' } });

  const fetchEstatisticas = useCallback(async () => {
    setIsLoading(true);
    try {
      const res   = await api.fetch('/estatisticas').then(r => r.json());
      const value = Array.isArray(res) ? res[0] : res;
      if (value?.id) { setStats(value); statsForm.reset(value); }
    } catch (err) { console.error('Error fetching estatisticas:', err); toast.error('Erro ao carregar estatísticas'); }
    finally { setIsLoading(false); }
  }, [statsForm]);

  const handleStatsSubmit = async (data, onSuccess) => {
    try {
      const method = stats?.id ? 'PUT' : 'POST';
      const url    = stats?.id ? `/estatisticas/${stats.id}` : '/estatisticas';
      const res    = await api.fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error(await res.text());
      const saved = await res.json();
      await logAction(stats?.id ? 'UPDATE' : 'CREATE', 'estatisticas', saved.id, 'Updated statistics', currentUser);
      toast.success('Estatísticas atualizadas!');
      setStats(saved); statsForm.reset(saved);
      if (onSuccess) onSuccess();
    } catch { toast.error('Erro ao atualizar estatísticas'); }
  };

  return { stats, isLoading, statsForm, fetchEstatisticas, handleStatsSubmit };
}
