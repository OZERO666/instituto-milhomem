import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Activity, Clock3, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge.jsx';
import { Input } from '@/components/ui/input.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import Pagination from '@/features/admin/components/Pagination.jsx';
import { usePagination } from '@/features/admin/hooks/usePagination.js';

const ACTION_VARIANTS = {
  CREATE: 'default',
  UPDATE: 'secondary',
  DELETE: 'destructive',
  LOGIN: 'outline',
  LOGOUT: 'outline',
};

const ACTION_LABELS = {
  CREATE: 'Criado',
  UPDATE: 'Atualizado',
  DELETE: 'Excluido',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function AdminAuditTimeline({ auditLogs = [] }) {
  const [query, setQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [collectionFilter, setCollectionFilter] = useState('all');

  const collectionOptions = useMemo(() => {
    return Array.from(new Set(auditLogs.map((log) => log.collection_name).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());

    return auditLogs.filter((log) => {
      if (actionFilter !== 'all' && log.action_type !== actionFilter) return false;
      if (collectionFilter !== 'all' && log.collection_name !== collectionFilter) return false;
      if (!normalizedQuery) return true;

      const haystack = normalizeText([
        log.details,
        log.collection_name,
        log.action_type,
        log.record_id,
      ].join(' '));

      return haystack.includes(normalizedQuery);
    });
  }, [actionFilter, auditLogs, collectionFilter, query]);

  const { paged, page, setPage, totalPages, from, to, total } = usePagination(filteredLogs, 6);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-4 mb-4">
        <div>
          <h3 className="font-bold text-lg text-secondary">Timeline De Atividade</h3>
          <p className="text-sm text-muted-foreground">Filtre a atividade do painel por acao, recurso ou texto livre.</p>
        </div>
        <Badge variant="outline">{total} registro(s)</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_180px_180px] gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por detalhe, acao ou recurso..." className="pl-9" />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar acao" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as acoes</SelectItem>
            {Object.keys(ACTION_LABELS).map((action) => (
              <SelectItem key={action} value={action}>{ACTION_LABELS[action]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={collectionFilter} onValueChange={setCollectionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar recurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os recursos</SelectItem>
            {collectionOptions.map((collection) => (
              <SelectItem key={collection} value={collection}>{collection}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {paged.map((log) => (
          <div key={log.id} className="rounded-xl border border-border px-4 py-3 hover:border-primary/30 transition-colors">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-secondary">{log.details || 'Atividade registrada'}</p>
                  <Badge variant={ACTION_VARIANTS[log.action_type] || 'outline'}>
                    {ACTION_LABELS[log.action_type] || log.action_type}
                  </Badge>
                  {log.collection_name && <Badge variant="outline">{log.collection_name}</Badge>}
                </div>

                <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5" />
                    {log.timestamp ? format(new Date(log.timestamp), 'dd/MM/yyyy HH:mm') : 'Sem data'}
                  </span>
                  {log.record_id && <span>ID: {log.record_id}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredLogs.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            <div className="inline-flex items-center gap-2 mb-2 font-medium">
              <Filter className="w-4 h-4" /> Nenhum registro encontrado
            </div>
            <p>Ajuste os filtros ou a busca para localizar atividades do painel.</p>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
    </div>
  );
}