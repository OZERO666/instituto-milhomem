import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AdminSectionSwitch({
  options = [],
  activeKey,
  onChange,
  className = 'flex flex-wrap gap-2',
  buttonClassName = 'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors',
}) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = activeKey === option.key;
        const label = option.labelKey ? t(option.labelKey) : option.label;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            className={`${buttonClassName} ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-white border border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              {Icon ? <Icon className="w-4 h-4" /> : null}
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
