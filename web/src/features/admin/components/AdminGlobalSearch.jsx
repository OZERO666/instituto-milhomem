import React, { useEffect, useMemo, useState } from 'react';
import { Search, Loader2, ArrowRight, FileText, Image, List, Mail, MessageSquare, HelpCircle, UserCircle } from 'lucide-react';
import api from '@/lib/apiServerClient';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';

const RESOURCE_CONFIG = {
  bookings: {
    tab: 'bookings',
    label: 'Leads',
    icon: Mail,
    endpoint: '/agendamentos',
    permission: ['leads', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.nome || 'Lead sem nome',
      subtitle: item.tipo_servico || item.email || 'Lead',
      meta: [item.email, item.telefone, item.mensagem],
      status: item.lido ? 'Lido' : 'Novo',
    }),
  },
  services: {
    tab: 'services',
    label: 'Servicos',
    icon: List,
    endpoint: '/servicos',
    permission: ['blog', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.nome || 'Servico sem nome',
      subtitle: item.slug ? `/servicos/${item.slug}` : 'Servico',
      meta: [item.descricao, item.slug],
      status: item.imagem ? 'Com imagem' : 'Sem imagem',
    }),
  },
  articles: {
    tab: 'blog',
    label: 'Blog',
    icon: FileText,
    endpoint: '/artigos',
    permission: ['blog', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.titulo || 'Artigo sem titulo',
      subtitle: item.slug ? `/blog/${item.slug}` : (item.categoria_nome || 'Artigo'),
      meta: [item.resumo, item.slug, item.categoria_nome],
      status: item.status === 'draft' ? 'Rascunho' : 'Publicado',
    }),
  },
  gallery: {
    tab: 'gallery',
    label: 'Galeria',
    icon: Image,
    endpoint: '/galeria',
    permission: ['gallery', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.titulo || 'Item da galeria',
      subtitle: item.tema_nome || 'Galeria',
      meta: [item.tema_nome, item.meses_pos_operatorio ? `${item.meses_pos_operatorio} meses` : ''],
      status: item.foto_antes && item.foto_depois ? 'Completo' : 'Incompleto',
    }),
  },
  testimonials: {
    tab: 'testimonials',
    label: 'Depoimentos',
    icon: MessageSquare,
    endpoint: '/depoimentos',
    permission: ['testimonials', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.nome || 'Depoimento',
      subtitle: item.cargo || 'Depoimento',
      meta: [item.texto, item.nome],
      status: item.foto ? 'Com foto' : 'Sem foto',
    }),
  },
  faq: {
    tab: 'faq',
    label: 'FAQ',
    icon: HelpCircle,
    endpoint: '/faq/all',
    permission: ['dashboard', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.pergunta || 'Pergunta',
      subtitle: 'FAQ',
      meta: [item.resposta],
      status: item.ativo === 0 ? 'Inativo' : 'Ativo',
    }),
  },
  users: {
    tab: 'users',
    label: 'Usuarios',
    icon: UserCircle,
    endpoint: '/users',
    permission: ['users', 'read'],
    mapItem: (item) => ({
      id: item.id,
      title: item.name || 'Usuario',
      subtitle: item.email || 'Usuario',
      meta: [item.role_name, item.email],
      status: item.role_name || 'Sem role',
    }),
  },
};

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function AdminGlobalSearch({ canAccess, onSelectTab }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultsByGroup, setResultsByGroup] = useState({});

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadResources = async () => {
      setIsLoading(true);

      try {
        const entries = Object.entries(RESOURCE_CONFIG).filter(([, config]) => canAccess(config.permission[0], config.permission[1]));
        const loadedGroups = await Promise.all(entries.map(async ([key, config]) => {
          try {
            const data = await api.fetch(config.endpoint).then((response) => response.json());
            const items = Array.isArray(data) ? data.map(config.mapItem) : [];
            return [key, items];
          } catch {
            return [key, []];
          }
        }));

        if (!cancelled) {
          setResultsByGroup(Object.fromEntries(loadedGroups));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadResources();

    return () => {
      cancelled = true;
    };
  }, [canAccess, open]);

  const groupedResults = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());

    return Object.entries(resultsByGroup)
      .map(([key, items]) => {
        const config = RESOURCE_CONFIG[key];
        const filteredItems = !normalizedQuery
          ? items.slice(0, 6)
          : items.filter((item) => {
              const haystack = normalizeText([item.title, item.subtitle, ...(item.meta || [])].join(' '));
              return haystack.includes(normalizedQuery);
            }).slice(0, 8);

        return {
          key,
          config,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [query, resultsByGroup]);

  const totalResults = groupedResults.reduce((sum, group) => sum + group.items.length, 0);

  const handleSelect = (tab) => {
    setOpen(false);
    setQuery('');
    onSelectTab(tab);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-white/70 hover:text-white hover:bg-white/10 gap-2 border border-white/10 hover:border-white/20"
      >
        <Search className="w-4 h-4" />
        <span className="hidden md:inline">Buscar</span>
        <span className="hidden lg:inline text-[10px] text-white/40 border border-white/10 rounded px-1.5 py-0.5">Ctrl K</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>Busca Global Do Admin</DialogTitle>
            <DialogDescription>
              Encontre rapidamente leads, servicos, blog, galeria, FAQ e usuarios a partir de um unico campo.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busque por nome, slug, email, categoria, status..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{isLoading ? 'Carregando dados do admin...' : `${totalResults} resultado(s) encontrado(s)`}</span>
              <span>Selecionar um item abre a aba correspondente.</span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-4">
              {isLoading ? (
                <div className="py-12 flex items-center justify-center text-sm text-muted-foreground gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Carregando recursos...
                </div>
              ) : groupedResults.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  Nenhum resultado encontrado para a busca atual.
                </div>
              ) : groupedResults.map((group) => {
                const Icon = group.config.icon;

                return (
                  <div key={group.key} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      <span>{group.config.label}</span>
                    </div>

                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <button
                          key={`${group.key}-${item.id}`}
                          type="button"
                          onClick={() => handleSelect(group.config.tab)}
                          className="w-full text-left rounded-xl border border-border px-4 py-3 bg-white hover:border-primary/40 hover:bg-primary/5 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-secondary truncate">{item.title}</p>
                              <p className="text-xs text-muted-foreground truncate mt-0.5">{item.subtitle}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline">{item.status}</Badge>
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}