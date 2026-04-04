// src/features/admin/hooks/useBookings.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';

export function useBookings() {
  const [bookings,   setBookings]   = useState([]);
  const [isLoading,  setIsLoading]  = useState(false);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.fetch('/agendamentos').then(r => r.json());
      if (Array.isArray(res)) setBookings(res);
    } catch (err) { console.error('Error fetching bookings:', err); toast.error('Erro ao carregar agendamentos'); }
    finally { setIsLoading(false); }
  }, []);

  const handleMarkAsRead = async (id, onSuccess) => {
    try {
      await api.fetch(`/agendamentos/${id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ lido: true }),
      });
      toast.success('Marcado como lido');
      if (onSuccess) onSuccess();
    } catch { toast.error('Erro ao atualizar'); }
  };

  return { bookings, isLoading, fetchBookings, handleMarkAsRead };
}
