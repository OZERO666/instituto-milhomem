import React from 'react';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const BookingsTab = ({ bookings, isLoading, onMarkAsRead, onDelete }) => (
  <div className="bg-white rounded-xl shadow-sm border border-border p-6">
    <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Leads / Agendamentos</h2>
    {isLoading ? (
      <TabLoader rows={4} />
    ) : bookings.length === 0 ? (
      <p className="text-muted-foreground text-center py-12">Nenhum lead cadastrado.</p>
    ) : (
      <div className="space-y-4">
        {bookings.map(b => (
          <div
            key={b.id}
            className={`p-5 rounded-xl border ${
              b.lido ? 'border-border bg-white' : 'border-primary/50 bg-primary/5'
            } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <p className="font-bold text-lg text-secondary">{b.nome}</p>
                <Badge variant={b.lido ? 'outline' : 'default'}>{b.lido ? 'Lido' : 'Novo'}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{b.email} · {b.telefone}</p>
              <p className="text-sm font-medium text-primary">{b.tipo_servico}</p>
              {b.mensagem && (
                <p className="text-sm text-muted-foreground italic">"{b.mensagem}"</p>
              )}
              <p className="text-xs text-muted-foreground">
                {b.created_at ? format(new Date(b.created_at), 'dd/MM/yyyy HH:mm') : ''}
              </p>
            </div>
            <div className="flex gap-2">
              {!b.lido && (
                <Button size="sm" onClick={() => onMarkAsRead(b.id)}
                  className="bg-primary text-primary-foreground hover:bg-secondary hover:text-white">
                  Marcar como lido
                </Button>
              )}
              <Button size="sm" variant="destructive" onClick={() => onDelete('agendamentos', b.id, b.nome)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default BookingsTab;
