import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, CheckCircle2, Loader2, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useContatoConfig } from '@/hooks/useContatoConfig.js';
import { LOGO_URL } from '@/config/site.js';
import AdminGlobalSearch from '@/features/admin/components/AdminGlobalSearch.jsx';

const STATUS_STYLES = {
  idle: {
    icon: CheckCircle2,
    wrapper: 'border-white/10 bg-white/5 text-white/65',
    iconClass: 'text-emerald-400',
  },
  dirty: {
    icon: AlertCircle,
    wrapper: 'border-amber-400/25 bg-amber-400/10 text-amber-100',
    iconClass: 'text-amber-300',
  },
  saving: {
    icon: Loader2,
    wrapper: 'border-sky-400/25 bg-sky-400/10 text-sky-100',
    iconClass: 'text-sky-300',
  },
  saved: {
    icon: CheckCircle2,
    wrapper: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-100',
    iconClass: 'text-emerald-300',
  },
  error: {
    icon: AlertCircle,
    wrapper: 'border-destructive/25 bg-destructive/10 text-red-100',
    iconClass: 'text-red-300',
  },
};

export default function AdminShellHeader({ currentUserEmail, onLogout, canAccess, onSelectTab, status }) {
  const { t } = useTranslation();
  const config = useContatoConfig();
  const logoUrl = config?.logo_url || LOGO_URL;
  const tone = STATUS_STYLES[status?.tone] ? status.tone : 'idle';
  const statusStyle = STATUS_STYLES[tone];
  const StatusIcon = statusStyle.icon;

  return (
    <header className="bg-secondary sticky top-0 z-20 shadow-lg">
      {/* Faixa dourada topo */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
      <div className="container-custom py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoUrl} alt="Instituto Milhomem" className="h-10 w-auto object-contain" />
          <div className="hidden sm:block">
            <p className="text-[10px] text-primary/60 uppercase tracking-[0.2em] leading-none mb-0.5">{t('admin.header.panel')}</p>
            <h1 className="text-base font-bold leading-tight text-white/90 tracking-wide">
              {t('admin.header.admin_title')}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`hidden xl:flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] ${statusStyle.wrapper}`}>
            <StatusIcon className={`w-3.5 h-3.5 shrink-0 ${statusStyle.iconClass} ${tone === 'saving' ? 'animate-spin' : ''}`} />
            <span className="font-semibold whitespace-nowrap">{status?.label || t('admin.status.panel_ready')}</span>
          </div>
          <AdminGlobalSearch canAccess={canAccess} onSelectTab={onSelectTab} />
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-white/50">
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate max-w-[180px]">{currentUserEmail}</span>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 gap-2 border border-white/10 hover:border-white/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('admin.header.logout')}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
