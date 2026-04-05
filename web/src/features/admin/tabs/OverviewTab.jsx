import React from 'react';
import { Badge } from '@/components/ui/badge.jsx';
import AdminOverviewStats from '@/features/admin/components/AdminOverviewStats.jsx';
import AdminOverviewAlerts from '@/features/admin/components/AdminOverviewAlerts.jsx';
import AdminAuditTimeline from '@/features/admin/components/AdminAuditTimeline.jsx';
import AdminTranslationCoverage from '@/features/admin/components/AdminTranslationCoverage.jsx';
import AdminConversionInsights from '@/features/admin/components/AdminConversionInsights.jsx';

const OverviewTab = ({ bookings, services, galleryItems, articles, auditLogs, testimonials, faqItems }) => (
  <div className="space-y-6">
    <AdminOverviewStats
      unreadBookings={bookings.filter((b) => !b.lido).length}
      servicesCount={services.length}
      galleryCount={galleryItems.length}
      articlesCount={articles.length}
    />
    <AdminOverviewAlerts
      bookings={bookings}
      services={services}
      galleryItems={galleryItems}
      articles={articles}
      auditLogs={auditLogs}
    />
    <AdminTranslationCoverage
      services={services}
      articles={articles}
      galleryItems={galleryItems}
      testimonials={testimonials}
      faqItems={faqItems}
    />
    <AdminConversionInsights bookings={bookings} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminAuditTimeline auditLogs={auditLogs} />
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
