import React, { useMemo } from 'react';
import { BarChart3, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge.jsx';

function buildTopEntries(bookings, fieldName) {
  const map = new Map();
  bookings.forEach((booking) => {
    const key = String(booking?.[fieldName] || 'nao-informado').trim().toLowerCase();
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([key, count]) => ({
      key,
      label: key.replace(/-/g, ' '),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

export default function AdminConversionInsights({ bookings = [] }) {
  const { t } = useTranslation();
  const sourceStats = useMemo(() => buildTopEntries(bookings, 'origem'), [bookings]);
  const ctaStats = useMemo(() => buildTopEntries(bookings, 'cta_origem'), [bookings]);
  const campaignStats = useMemo(() => buildTopEntries(bookings, 'utm_campaign'), [bookings]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg text-secondary border-b pb-2">{t('admin.conversion.title')}</h3>
        <Badge variant="outline" className="gap-1"><BarChart3 className="w-3.5 h-3.5" /> {bookings.length} {t('admin.conversion.leads')}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('admin.conversion.top_sources')}</p>
          <div className="space-y-2">
            {sourceStats.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm">
                <span className="capitalize text-foreground">{item.label}</span>
                <Badge variant="outline">{item.count}</Badge>
              </div>
            ))}
            {sourceStats.length === 0 && <p className="text-xs text-muted-foreground">{t('admin.conversion.empty_data')}</p>}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('admin.conversion.top_ctas')}</p>
          <div className="space-y-2">
            {ctaStats.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm">
                <span className="capitalize text-foreground">{item.label}</span>
                <Badge variant="outline">{item.count}</Badge>
              </div>
            ))}
            {ctaStats.length === 0 && <p className="text-xs text-muted-foreground">{t('admin.conversion.empty_data')}</p>}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t('admin.conversion.top_campaigns')}</p>
          <div className="space-y-2">
            {campaignStats.map((item) => (
              <div key={item.key} className="flex items-center justify-between text-sm">
                <span className="capitalize text-foreground line-clamp-1">{item.label}</span>
                <Badge variant="outline" className="gap-1"><Target className="w-3 h-3" /> {item.count}</Badge>
              </div>
            ))}
            {campaignStats.length === 0 && <p className="text-xs text-muted-foreground">{t('admin.conversion.empty_campaigns')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}