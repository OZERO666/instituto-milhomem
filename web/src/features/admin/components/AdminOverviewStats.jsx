import React from 'react';
import { Mail, List, Image, FileText } from 'lucide-react';

const OVERVIEW_CARDS = [
  { key: 'unreadBookings', icon: Mail, label: 'Novos Leads' },
  { key: 'servicesCount', icon: List, label: 'Serviços' },
  { key: 'galleryCount', icon: Image, label: 'Fotos Galeria' },
  { key: 'articlesCount', icon: FileText, label: 'Artigos Blog' },
];

export default function AdminOverviewStats({ unreadBookings = 0, servicesCount = 0, galleryCount = 0, articlesCount = 0 }) {
  const valuesByKey = {
    unreadBookings,
    servicesCount,
    galleryCount,
    articlesCount,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {OVERVIEW_CARDS.map((card) => {
        const Icon = card.icon;
        const value = valuesByKey[card.key] ?? 0;

        return (
          <div key={card.key} className="bg-white p-6 rounded-xl shadow-sm border border-border flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase">{card.label}</p>
              <p className="text-3xl font-extrabold text-secondary">{value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
