// src/features/admin/hooks/useBlog.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import api from '@/lib/apiServerClient';
import { genericSubmit } from '@/features/admin/utils/adminApi.js';

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

  const openArticleEditor  = (article = null) => { setCurrentArticle(article); setIsArticleEditorOpen(true); };
  const closeArticleEditor = () => { setIsArticleEditorOpen(false); setCurrentArticle(null); };
  const handleArticleSuccess = (onRefetch) => { closeArticleEditor(); if (onRefetch) onRefetch(); };

  return {
    articles, blogCategories, isLoading, categoryForm,
    isArticleEditorOpen, currentArticle,
    fetchBlog, handleCategorySubmit,
    openArticleEditor, closeArticleEditor, handleArticleSuccess,
  };
}
