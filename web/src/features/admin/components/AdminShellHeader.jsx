import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useContatoConfig } from '@/hooks/useContatoConfig.js';
import { LOGO_URL } from '@/config/site.js';

export default function AdminShellHeader({ currentUserEmail, onLogout }) {
  const config = useContatoConfig();
  const logoUrl = config?.logo_url || LOGO_URL;

  return (
    <header className="bg-secondary sticky top-0 z-20 shadow-lg">
      {/* Faixa dourada topo */}
      <div className="h-0.5 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
      <div className="container-custom py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logoUrl} alt="Instituto Milhomem" className="h-10 w-auto object-contain" />
          <div className="hidden sm:block">
            <p className="text-[10px] text-primary/60 uppercase tracking-[0.2em] leading-none mb-0.5">Painel</p>
            <h1 className="text-base font-bold leading-tight text-white/90 tracking-wide">
              Área Administrativa
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
