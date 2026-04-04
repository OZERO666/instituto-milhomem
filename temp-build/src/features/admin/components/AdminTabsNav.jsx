import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { ADMIN_TABS } from '@/features/admin/constants/navigation.js';

export default function AdminTabsNav({ unreadBookings = 0 }) {
  return (
    <TabsList className="flex flex-wrap w-full mb-8 bg-white border border-border h-auto p-1 shadow-sm rounded-xl gap-1">
      {ADMIN_TABS.map((tab) => {
        const Icon = tab.icon;
        const badgeValue = tab.badgeKey === 'unreadBookings' ? unreadBookings : 0;

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex-1 py-3 font-bold uppercase tracking-wider text-xs
                       data-[state=active]:bg-primary data-[state=active]:text-primary-foreground
                       rounded-lg flex items-center justify-center gap-2"
          >
            <Icon className="w-4 h-4" /> {tab.label}
            {badgeValue > 0 && (
              <span className="bg-destructive text-white px-2 py-0.5 rounded-full text-[10px]">
                {badgeValue}
              </span>
            )}
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
