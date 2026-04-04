import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, FileText, Loader2, Search, CheckCircle2, PenLine, Hash, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import ArticleEditor from '@/components/ArticleEditor.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';
import Pagination from '@/features/admin/components/Pagination.jsx';
import { usePagination } from '@/features/admin/hooks/usePagination.js';
import TranslationFields from '@/features/admin/components/TranslationFields.jsx';

const ARTICLE_TRANSLATION_FIELDS = [
  { name: 'titulo',   label: 'Título',   type: 'input' },
  { name: 'resumo',   label: 'Resumo',   type: 'textarea', rows: 3 },
  { name: 'conteudo', label: 'Conteúdo', type: 'textarea', rows: 6 },
];

const CATEGORY_TRANSLATION_FIELDS = [
  { name: 'nome', label: 'Nome', type: 'input' },
];

const BlogTab = ({
  articles, blogCategories, isLoading, categoryForm,
  onGenericSubmit, onDelete,
  openArticleEditor, isArticleEditorOpen, closeArticleEditor,
  currentArticle, onArticleSuccess,
}) => {
  const { register, handleSubmit, formState: { isSubmitting } } = categoryForm;
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [translatingArticle, setTranslatingArticle] = useState(null);
  const [translatingCategory, setTranslatingCategory] = useState(null);
  const filteredArticles = useMemo(() => {
    let result = articles;
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    const q = query.trim().toLowerCase();
    if (!q) return result;
    return result.filter(a =>
      a.titulo?.toLowerCase().includes(q) ||
      a.slug?.toLowerCase().includes(q) ||
      a.resumo?.toLowerCase().includes(q) ||
      a.categoria_nome?.toLowerCase().includes(q)
    );
  }, [articles, query, statusFilter]);
  const { paged: pagedArticles, page, setPage, totalPages, from, to, total } = usePagination(filteredArticles, 10);

  return (
  <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold mb-4 text-secondary border-b border-border pb-3">Categorias</h2>
          <form onSubmit={handleSubmit(data => onGenericSubmit('blog-categorias', data))} className="space-y-3 mb-4">
            <Input placeholder="Nome da categoria" {...register('nome', { required: true })} />
            <Button type="submit" disabled={isSubmitting} className="w-full bg-secondary text-white hover:bg-secondary/90">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Adicionar
            </Button>
          </form>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {blogCategories.map(cat => (
              <React.Fragment key={cat.id}>
              <div className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                <span className="font-medium">{cat.nome}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary" title="Traduções"
                    onClick={() => setTranslatingCategory(translatingCategory?.id === cat.id ? null : cat)}>
                    <Globe className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive"
                    onClick={() => onDelete('blog-categorias', cat.id, cat.nome)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {translatingCategory?.id === cat.id && (
                <div className="bg-white rounded-lg border border-primary/30 px-4 py-3 -mt-1">
                  <TranslationFields
                    tabela="blog_categorias"
                    registroId={cat.id}
                    originalData={cat}
                    fields={CATEGORY_TRANSLATION_FIELDS}
                  />
                </div>
              )}
              </React.Fragment>
            ))}
            {blogCategories.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Nenhuma categoria criada ainda.</p>}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold mb-4 text-secondary border-b border-border pb-3">Novo Artigo</h2>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-white" onClick={() => openArticleEditor()}>
            <FileText className="w-4 h-4 mr-2" /> Abrir Editor
          </Button>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-secondary">Artigos Cadastrados</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar artigos..."
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 w-52"
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all',       label: 'Todos',      count: articles.length },
            { key: 'published', label: 'Publicados',  count: articles.filter(a => a.status !== 'draft').length },
            { key: 'draft',     label: 'Rascunhos',   count: articles.filter(a => a.status === 'draft').length },
          ].map(({ key, label, count }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                statusFilter === key ? 'bg-primary text-white shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/60'
              }`}>
              {label} <span className="opacity-70">({count})</span>
            </button>
          ))}
        </div>
        {isLoading ? (
          <TabLoader rows={3} />
        ) : pagedArticles.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">{query ? 'Nenhum artigo encontrado.' : 'Nenhum artigo cadastrado.'}</p>
        ) : pagedArticles.map(item => (
          <React.Fragment key={item.id}>
          <div className="bg-white rounded-xl p-6 border border-border shadow-sm flex gap-5 hover:border-primary/50 transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-secondary truncate">{item.titulo}</h3>
                    {item.status === 'draft' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-700 flex-shrink-0">
                        <PenLine className="w-3 h-3" /> Rascunho
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 flex-shrink-0">
                        <CheckCircle2 className="w-3 h-3" /> Publicado
                      </span>
                    )}
                  </div>
                  {item.slug && <p className="text-xs text-muted-foreground">/blog/{item.slug}</p>}
                  {item.categoria_nome && <p className="text-xs text-muted-foreground">Categoria: {item.categoria_nome}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="icon" variant="outline" onClick={() => openArticleEditor(item)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="ghost" title="Traduções" className="text-primary hover:bg-primary/10" onClick={() => setTranslatingArticle(translatingArticle?.id === item.id ? null : item)}><Globe className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => onDelete('artigos', item.id, item.titulo)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.resumo}</p>
              {(() => {
                let tags = [];
                try { tags = item.tags ? (Array.isArray(item.tags) ? item.tags : JSON.parse(item.tags)) : []; } catch {}
                return tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary/80">
                        <Hash className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                ) : null;
              })()}
              <p className="text-xs text-muted-foreground mt-2">{item.created ? format(new Date(item.created), 'dd/MM/yyyy HH:mm') : ''}</p>
            </div>
          </div>
          {translatingArticle?.id === item.id && (
            <div className="bg-white rounded-xl border border-primary/30 shadow-sm px-6 py-4 -mt-2">
              <TranslationFields
                tabela="artigos"
                registroId={item.id}
                originalData={item}
                fields={ARTICLE_TRANSLATION_FIELDS}
              />
            </div>
          )}
          </React.Fragment>
        ))}
        <Pagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
      </div>
    </div>
    {isArticleEditorOpen && (
      <ArticleEditor
        isOpen={isArticleEditorOpen}
        onClose={closeArticleEditor}
        article={currentArticle}
        categories={blogCategories}
        onSuccess={onArticleSuccess}
      />
    )}
  </>
  );
};

export default BlogTab;
