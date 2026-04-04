import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Plus, FileText, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import ArticleEditor from '@/components/ArticleEditor.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';
import Pagination from '@/features/admin/components/Pagination.jsx';
import { usePagination } from '@/features/admin/hooks/usePagination.js';

const BlogTab = ({
  articles, blogCategories, isLoading, categoryForm,
  onGenericSubmit, onDelete,
  openArticleEditor, isArticleEditorOpen, closeArticleEditor,
  currentArticle, onArticleSuccess,
}) => {
  const { register, handleSubmit, formState: { isSubmitting } } = categoryForm;
  const [query, setQuery] = useState('');
  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(a =>
      a.titulo?.toLowerCase().includes(q) ||
      a.slug?.toLowerCase().includes(q) ||
      a.resumo?.toLowerCase().includes(q) ||
      a.categoria_nome?.toLowerCase().includes(q)
    );
  }, [articles, query]);
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
              <div key={cat.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                <span className="font-medium">{cat.nome}</span>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive"
                  onClick={() => onDelete('blog-categorias', cat.id, cat.nome)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
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
        <div className="flex items-center justify-between gap-4">
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
        {isLoading ? (
          <TabLoader rows={3} />
        ) : pagedArticles.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">{query ? 'Nenhum artigo encontrado.' : 'Nenhum artigo cadastrado.'}</p>
        ) : pagedArticles.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-6 border border-border shadow-sm flex gap-5 hover:border-primary/50 transition-colors">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-secondary">{item.titulo}</h3>
                  {item.slug && <p className="text-xs text-muted-foreground">/blog/{item.slug}</p>}
                  {item.categoria_nome && <p className="text-xs text-muted-foreground">Categoria: {item.categoria_nome}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => openArticleEditor(item)}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => onDelete('artigos', item.id, item.titulo)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.resumo}</p>
              <p className="text-xs text-muted-foreground mt-2">{item.created ? format(new Date(item.created), 'dd/MM/yyyy HH:mm') : ''}</p>
            </div>
          </div>
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
