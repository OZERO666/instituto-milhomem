import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const LOGO_URL = 'https://horizons-cdn.hostinger.com/386178fc-68a2-4ae9-99a1-df6a1385b4b9/1e20c7dbf245fee0e2ca926ad4054327.png';

export default function AdminShellHeader({ currentUserEmail, onLogout }) {
  return (
    <header className="bg-secondary text-white border-b-4 border-primary sticky top-0 z-20 shadow-md">
      <div className="container-custom py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-xl font-bold leading-tight uppercase tracking-wide text-primary">
              Painel de Controle
            </h1>
            <p className="text-xs text-white/70 flex items-center gap-2">
              <Shield className="w-3 h-3 text-green-400" /> Sessão Segura · {currentUserEmail}
            </p>
          </div>
        </div>
        <Button
          onClick={onLogout}
          variant="outline"
          size="sm"
          className="border-primary/50 text-primary hover:bg-primary hover:text-secondary"
        >
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>
    </header>
  );
}
