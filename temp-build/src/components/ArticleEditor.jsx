import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  X, Upload, Save, Eye, EyeOff, RefreshCw,
  Image as ImageIcon, FileText, Tag, User, Calendar
} from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/apiServerClient';

// ─── Quill modules ────────────────────────────────────────────────────────────
const quillModules = {
  toolbar: [
    [{ header: [2, 3, 4, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    ['link', 'image'],
    [{ align: [] }],
    ['clean'],
  ],
};

const quillFormats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'code-block',
  'list', 'bullet', 'indent',
  'link', 'image', 'align',
];

// ─── Slug Generator ───────────────────────────────────────────────────────────
const generateSlug = (title) =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

// ─── Image Preview ────────────────────────────────────────────────────────────
const ImagePreview = ({ article, fileRef }) => {
  const [preview, setPreview] = useState(
    article?.imagem_destaque || null
  );

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-3">
      <div
        className="relative group cursor-pointer border-2 border-dashed border-border hover:border-primary/50 rounded-xl bg-muted/30 transition-all duration-200 overflow-hidden"
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
              <Upload className="w-5 h-5" /> Trocar imagem
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-sm text-foreground">Clique para selecionar</p>
              <p className="text-xs">PNG, JPG ou WEBP — recomendado 1200×630px</p>
            </div>
          </div>
        )}
      </div>
      <Input
        id="imagem_destaque"
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ArticleEditor = ({ article, onClose, onSuccess }) => {
  const [content, setContent]           = useState(article?.conteudo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories]     = useState([]);
  const [preview, setPreview]           = useState(false);
  const [wordCount, setWordCount]       = useState(0);
  const fileRef                         = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      titulo:          article?.titulo || '',
      slug:            article?.slug || '',
      resumo:          article?.resumo || '',
      categoria_id:    article?.categoria_id || '',
      autor:           article?.autor || 'Dr. Pablo Milhomem',
      data_publicacao: article?.data_publicacao
        ? new Date(article.data_publicacao).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  });

  const tituloValue = watch('titulo');
  const slugValue   = watch('slug');
  const resumoValue = watch('resumo');

  // ─── Fetch categories ───────────────────────────────────────────────────────
  useEffect(() => {
    api.fetch('/blog-categorias')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setCategories(d); })
      .catch(console.error);
  }, []);

  // ─── Word count ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [content]);

  // ─── Auto-slug ──────────────────────────────────────────────────────────────
  const handleTitleChange = (e) => {
    if (!article) setValue('slug', generateSlug(e.target.value));
  };

  const refreshSlug = () => setValue('slug', generateSlug(tituloValue));

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {
    if (!content || content === '<p><br></p>') {
      toast.error('O conteúdo do artigo é obrigatório');
      return;
    }

    const file = fileRef.current?.files[0] || null;
    setIsSubmitting(true);

    try {
      // 1. Upload da imagem (se houver)
      let imagemUrl = article?.imagem_destaque || null;

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const uploadRes = await api.fetch('/upload/artigos', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.text();
          throw new Error(`Erro ao fazer upload da imagem: ${err}`);
        }

        const { url } = await uploadRes.json();
        imagemUrl = url;
      }

      // 2. Envia dados do artigo em JSON
      const url    = article ? `/artigos/${article.id}` : '/artigos';
      const method = article ? 'PUT' : 'POST';

      const res = await api.fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo:          data.titulo,
          slug:            data.slug,
          resumo:          data.resumo || '',
          conteudo:        content,
          categoria_id:    data.categoria_id || null,
          autor:           data.autor,
          data_publicacao: new Date(data.data_publicacao).toISOString(),
          imagem_destaque: imagemUrl,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Erro desconhecido');
      }

      toast.success(article ? 'Artigo atualizado! ✅' : 'Artigo publicado! 🎉');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Erro ao salvar artigo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Fechar com ESC ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-8 pb-8 overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col border border-border overflow-hidden"
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-gradient-to-r from-secondary to-secondary/90">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                  {article ? 'Editar Artigo' : 'Novo Artigo'}
                </h2>
                <p className="text-white/60 text-xs">
                  {wordCount} palavras · {article ? `ID: ${article.id?.slice(0, 8)}` : 'Rascunho'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreview(prev => !prev)}
                className="text-white/70 hover:text-white hover:bg-white/10 gap-2"
              >
                {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {preview ? 'Editar' : 'Preview'}
              </Button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
            {/* FORM */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8">
              <form id="article-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* TÍTULO + SLUG */}
                <div className="space-y-5">
                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" /> Título do Artigo
                    </Label>
                    <Input
                      id="titulo"
                      placeholder="Ex: Como funciona o transplante capilar FUE?"
                      className="h-12 text-lg font-semibold focus-visible:ring-primary"
                      {...register('titulo', { required: 'Título obrigatório' })}
                      onChange={(e) => { register('titulo').onChange(e); handleTitleChange(e); }}
                    />
                    {errors.titulo && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.titulo.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-primary" /> Slug (URL)
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="como-funciona-transplante-capilar-fue"
                        className="font-mono text-sm focus-visible:ring-primary"
                        {...register('slug', { required: 'Slug obrigatório' })}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={refreshSlug}
                        title="Regenerar slug"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    {slugValue && (
                      <p className="text-xs text-muted-foreground mt-1">
                        URL:{' '}
                        <span className="text-primary font-mono">
                          /blog/{slugValue}
                        </span>
                      </p>
                    )}
                    {errors.slug && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* META */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-primary" /> Categoria
                    </Label>
                    <Select
                      onValueChange={v => setValue('categoria_id', v)}
                      defaultValue={article?.categoria_id}
                    >
                      <SelectTrigger className="focus:ring-primary">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" /> Autor
                    </Label>
                    <Input {...register('autor')} className="focus-visible:ring-primary" />
                  </div>
                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" /> Publicação
                    </Label>
                    <Input
                      type="date"
                      {...register('data_publicacao')}
                      className="focus-visible:ring-primary"
                    />
                  </div>
                </div>

                {/* RESUMO */}
                <div>
                  <Label className="font-bold mb-2 flex items-center justify-between">
                    <span>Resumo / Meta Description</span>
                    <span
                      className={`text-xs font-normal ${
                        (resumoValue?.length || 0) > 160
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {resumoValue?.length || 0}/160
                    </span>
                  </Label>
                  <Textarea
                    {...register('resumo')}
                    rows={3}
                    placeholder="Breve descrição do artigo para SEO e cards do blog..."
                    className="resize-none focus-visible:ring-primary"
                    maxLength={160}
                  />
                </div>

                {/* CONTEÚDO */}
                <div>
                  <Label className="font-bold mb-2 block">Conteúdo</Label>
                  {preview ? (
                    <div
                      className="prose prose-sm max-w-none p-6 rounded-xl border border-border bg-muted/20 min-h-[300px] overflow-auto"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-border">
                      <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={quillModules}
                        formats={quillFormats}
                        className="min-h-[300px]"
                        style={{ fontFamily: 'inherit' }}
                      />
                    </div>
                  )}
                  {!content || content === '<p><br></p>' ? (
                    <p className="text-xs text-muted-foreground mt-1">Campo obrigatório</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      {wordCount} palavras · tempo estimado: ~
                      {Math.ceil(wordCount / 200)} min de leitura
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* SIDEBAR */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0 border-t lg:border-t-0 lg;border-l border-border bg-muted/20 p-6 space-y-6 overflow-y-auto">
              {/* STATUS */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Estado</span>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      Publicado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Alterações</span>
                    <Badge variant={isDirty ? 'default' : 'outline'}>
                      {isDirty ? 'Não salvo' : 'Salvo'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Palavras</span>
                    <span className="font-bold">{wordCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Leitura</span>
                    <span className="font-bold">
                      ~{Math.ceil(wordCount / 200)} min
                    </span>
                  </div>
                </div>
              </div>

              {/* IMAGEM */}
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                  Imagem de Destaque
                </h3>
                <ImagePreview article={article} fileRef={fileRef} />
              </div>

              {/* SEO PREVIEW */}
              {(watch('titulo') || watch('resumo')) && (
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    Preview Google
                  </h3>
                  <div className="bg-white rounded-xl border border-border p-4 space-y-1">
                    <p className="text-sm text-blue-600 font-medium line-clamp-1 leading-tight">
                      {watch('titulo') || 'Título do artigo'}
                    </p>
                    <p className="text-xs text-green-700 font-mono">
                      institutomilhomem.com/blog/{slugValue || 'slug-do-artigo'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {watch('resumo') || 'Descrição do artigo aparece aqui...'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-border bg-white">
            <p className="text-xs text-muted-foreground hidden sm:block">
              Pressione{' '}
              <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">
                ESC
              </kbd>{' '}
              para fechar sem salvar
            </p>
            <div className="flex gap-3 ml-auto">
              <Button type="button" variant="outline" onClick={onClose} className="font-bold">
                Cancelar
              </Button>
              <Button
                type="submit"
                form="article-form"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold px-8 gap-2 uppercase tracking-wide"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />{' '}
                    {article ? 'Atualizar Artigo' : 'Publicar Artigo'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleEditor;