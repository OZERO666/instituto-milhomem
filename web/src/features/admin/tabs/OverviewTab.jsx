import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge.jsx';
import AdminOverviewStats from '@/features/admin/components/AdminOverviewStats.jsx';

const OverviewTab = ({ bookings, services, galleryItems, articles, auditLogs }) => (
  <div className="space-y-6">
    <AdminOverviewStats
      unreadBookings={bookings.filter((b) => !b.lido).length}
      servicesCount={services.length}
      galleryCount={galleryItems.length}
      articlesCount={articles.length}
    />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-bold text-lg mb-4 text-secondary border-b pb-2">Atividade Recente</h3>
        <div className="space-y-3">
          {auditLogs.slice(0, 5).map(log => (
            <div key={log.id} className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{log.details}</p>
                <p className="text-xs text-muted-foreground">
                  {log.timestamp ? format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm') : ''}
                </p>
              </div>
            </div>
          ))}
          {auditLogs.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma atividade registrada.</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h3 className="font-bold text-lg mb-4 text-secondary border-b pb-2">Últimos Leads</h3>
        <div className="space-y-3">
          {bookings.slice(0, 5).map(b => (
            <div key={b.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-bold text-foreground">{b.nome}</p>
                <p className="text-xs text-muted-foreground">{b.tipo_servico}</p>
              </div>
              <Badge variant={b.lido ? 'outline' : 'default'}>{b.lido ? 'Lido' : 'Novo'}</Badge>
            </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhum lead ainda.</p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default OverviewTab;
