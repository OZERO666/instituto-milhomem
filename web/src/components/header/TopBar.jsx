// src/components/header/TopBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, UserCircle } from 'lucide-react';
import { formatTelHref } from '@/hooks/useContatoConfig';

const TopBar = ({ config, isAuthenticated }) => (
  <div className="bg-secondary/80 border-b border-white/5 text-white py-2 hidden md:block">
    <div className="container-custom flex items-center justify-between text-xs">

      <a href={formatTelHref(config.telefone)}
         className="flex items-center gap-2 text-white/60 hover:text-primary transition-colors">
        <Phone className="w-3 h-3 text-primary" />
        {config.telefone}
      </a>

      <span className="text-white/40 text-[11px] tracking-wide">
        {config.dias_funcionamento} · {config.horario}
      </span>

      {isAuthenticated && (
        <Link to="/admin"
              className="flex items-center gap-1 text-white/40 hover:text-primary transition-colors">
          <UserCircle className="w-3 h-3" />
          <span>Painel</span>
        </Link>
      )}

    </div>
  </div>
);

export default TopBar;
