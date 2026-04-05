// src/features/admin/hooks/useBlog.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import api from '@/lib/apiServerClient';
import { genericSubmit, logAction } from '@/features/admin/utils/adminApi.js';

const parseTags = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const buildDuplicateSlug = (slug = '') => `${slug || 'artigo'}-copia-${Date.now().toString().slice(-6)}`;

export function useBlog(currentUser) {
  const [articles,        setArticles]        = useState([]);
  const [blogCategories,  setBlogCategories]  = useState([]);
  const [isArticleEditorOpen, setIsArticleEditorOpen] = useState(false);
  const [currentArticle,  setCurrentArticle]  = useState(null);
  const [isLoading,       setIsLoading]       = useState(false);

  const categoryForm = useForm({ mode: 'onBlur', defaultValues: { nome: '' } });

  const fetchBlog = useCallback(async () => {
    setIsLoading(true);
    try {
      const arts = await api.fetch('/artigos').then(r => r.json());
      if (Array.isArray(arts)) setArticles(arts);
      const cats = await api.fetch('/blog-categorias').then(r => r.json());
      if (Array.isArray(cats)) setBlogCategories(cats);
    } catch (err) { console.error('Error fetching blog:', err); toast.error('Erro ao carregar blog'); }
    finally { setIsLoading(false); }
  }, []);

  const handleCategorySubmit = (data, onSuccess) =>
    genericSubmit({ collection: 'blog-categorias', data, form: categoryForm, currentUser, onSuccess });

  const handleArticleStatusChange = useCallback(async (article, status, onRefetch, overrides = {}) => {
    try {
      const payload = {
        titulo: article.titulo,
        slug: article.slug,
        autor: article.autor,
        categoria: article.categoria,
        categoria_id: article.categoria_id,
        conteudo: article.conteudo,
        resumo: article.resumo,
        imagem_destaque: article.imagem_destaque,
        data_publicacao: overrides.data_publicacao || article.data_publicacao,
        status,
        tags: parseTags(article.tags),
      };

      const res = await api.fetch(`/artigos/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar status do artigo');

      await logAction('UPDATE', 'artigos', article.id, `Article status changed to ${status}: ${article.titulo}`, currentUser);
      if (status === 'published' && overrides.data_publicacao) {
        toast.success('Artigo publicado imediatamente!');
      } else {
        toast.success(status === 'published' ? 'Artigo publicado!' : 'Artigo movido para rascunho!');
      }
      if (onRefetch) onRefetch();
    } catch (error) {
      toast.error(error.message || 'Erro ao atualizar status do artigo');
    }
  }, [currentUser]);

  const handleDuplicateArticle = useCallback(async (article, onRefetch) => {
    try {
      const duplicateTitle = `${article.titulo} (Cópia)`;
      const duplicateSlug = buildDuplicateSlug(article.slug);

      const res = await api.fetch('/artigos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: duplicateTitle,
          slug: duplicateSlug,
          autor: article.autor,
          categoria: article.categoria,
          categoria_id: article.categoria_id,
          conteudo: article.conteudo,
          resumo: article.resumo,
          imagem_destaque: article.imagem_destaque,
          data_publicacao: article.data_publicacao,
          status: 'draft',
          tags: parseTags(article.tags),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Erro ao duplicar artigo');

      await logAction('CREATE', 'artigos', data.id, `Duplicated article from ${article.id}: ${duplicateTitle}`, currentUser);
      toast.success('Artigo duplicado como rascunho!');
      if (onRefetch) onRefetch();
    } catch (error) {
      toast.error(error.message || 'Erro ao duplicar artigo');
    }
  }, [currentUser]);

  const openArticleEditor  = (article = null) => { setCurrentArticle(article); setIsArticleEditorOpen(true); };
  const closeArticleEditor = () => { setIsArticleEditorOpen(false); setCurrentArticle(null); };
  const handleArticleSuccess = (onRefetch) => { closeArticleEditor(); if (onRefetch) onRefetch(); };

  return {
    articles, blogCategories, isLoading, categoryForm,
    isArticleEditorOpen, currentArticle,
    fetchBlog, handleCategorySubmit,
    handleArticleStatusChange, handleDuplicateArticle,
    openArticleEditor, closeArticleEditor, handleArticleSuccess,
  };
}
