import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-amber-50 to-slate-200 px-4">
      <div className="max-w-lg w-full rounded-2xl border border-amber-200 bg-white/90 p-8 shadow-xl text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Acesso não autorizado</h1>
        <p className="text-slate-600">
          Sua conta está autenticada, mas não possui permissão para acessar esta área.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/admin">Ir para painel</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao site
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
