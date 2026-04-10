import React from 'react';
import { useTranslation } from 'react-i18next';
import { TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { ADMIN_TABS } from '@/features/admin/constants/navigation.js';

export default function AdminTabsNav({ unreadBookings = 0, tabs = ADMIN_TABS }) {
  const { t } = useTranslation();
  return (
    <TabsList className="flex flex-wrap w-full mb-6 bg-white/5 border border-white/10 h-auto p-1 rounded-xl gap-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const badgeValue = tab.badgeKey === 'unreadBookings' ? unreadBookings : 0;
        const label = tab.labelKey ? t(tab.labelKey) : tab.label;

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 py-2.5 font-semibold uppercase tracking-wider text-[10px] text-white/50
                       data-[state=active]:bg-primary data-[state=active]:text-secondary data-[state=active]:shadow-md
                       hover:text-white/80 hover:bg-white/8 transition-all
                       rounded-lg flex items-center justify-center gap-1.5"
          >
            <Icon className="w-3.5 h-3.5 shrink-0" /> {label}
            {badgeValue > 0 && (
              <span className="bg-destructive text-white px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                {badgeValue}
              </span>
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
