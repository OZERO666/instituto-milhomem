// src/features/admin/components/TabLoader.jsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton.jsx';

const TabLoader = ({ rows = 4, card = false }) => {
  if (card) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
        <Skeleton className="h-7 w-40" />
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-5 border border-border shadow-sm flex gap-4 items-start"
        >
          <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabLoader;
