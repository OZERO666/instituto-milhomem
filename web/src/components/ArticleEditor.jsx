import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  X, Upload, Save, Eye, EyeOff, RefreshCw,
  Image as ImageIcon, FileText, Tag, User, Calendar,
  BookOpen, Hash, CheckCircle2, PenLine, Maximize2, Minimize2,
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
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }],
    [{ size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    ['blockquote', 'code-block'],
    [{ script: 'sub' }, { script: 'super' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'blockquote', 'code-block',
  'script',
  'list', 'bullet', 'indent',
  'align',
  'link', 'image', 'video',
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
  const [preview, setPreview] = useState(article?.imagem_destaque || null);

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
            <img src={preview} alt="Preview" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-sm">
              <Upload className="w-5 h-5" /> Trocar imagem
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8 text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-xs text-foreground">Clique para selecionar</p>
              <p className="text-[10px]">PNG, JPG, WEBP · 1200×630px</p>
            </div>
          </div>
        )}
      </div>
      <Input id="imagem_destaque" ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  );
};

// ─── Tags Input ───────────────────────────────────────────────────────────────
const TagsInput = ({ value = [], onChange }) => {
  const [input, setInput] = useState('');

  const addTag = (raw) => {
    const tag = raw.trim().toLowerCase().replace(/[^a-záéíóúàèìòùâêîôûãõç\w\s-]/gi, '').trim();
    if (!tag || value.includes(tag) || value.length >= 10) return;
    onChange([...value, tag]);
  };

  const handleKey = (e) => {
    if (['Enter', ',', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addTag(input);
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeTag = (tag) => onChange(value.filter(t => t !== tag));

  return (
    <div className="flex flex-wrap gap-1.5 p-2 border border-border rounded-lg bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-primary/40">
      {value.map(tag => (
        <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
          <Hash className="w-3 h-3" />
          {tag}
          <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive ml-0.5">×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) { addTag(input); setInput(''); } }}
        placeholder={value.length === 0 ? 'Digite e pressione Enter ou vírgula…' : ''}
        className="flex-1 min-w-[120px] text-xs outline-none bg-transparent placeholder:text-muted-foreground"
      />
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ArticleEditor = ({ article, onClose, onSuccess }) => {
  const parseTags = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
  };

  const [content,      setContent]      = useState(article?.conteudo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories,   setCategories]   = useState([]);
  const [preview,      setPreview]      = useState(false);
  const [fullscreen,   setFullscreen]   = useState(false);
  const [wordCount,    setWordCount]     = useState(0);
  const [tags,         setTags]         = useState(parseTags(article?.tags));
  const [status,       setStatus]       = useState(article?.status || 'published');
  const fileRef = useRef(null);

  const {
    register, handleSubmit, setValue, watch, formState: { errors, isDirty },
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

  useEffect(() => {
    api.fetch('/blog-categorias').then(r => r.json()).then(d => { if (Array.isArray(d)) setCategories(d); }).catch(console.error);
  }, []);

  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [content]);

  const handleTitleChange = (e) => { if (!article) setValue('slug', generateSlug(e.target.value)); };
  const refreshSlug = () => setValue('slug', generateSlug(tituloValue));

  // Ctrl+S para salvar
  const handleKeydown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      document.getElementById('article-form')?.requestSubmit();
    }
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  const onSubmit = async (data) => {
    if (!content || content === '<p><br></p>') { toast.error('O conteúdo do artigo é obrigatório'); return; }
    const file = fileRef.current?.files[0] || null;
    setIsSubmitting(true);
    try {
      let imagemUrl = article?.imagem_destaque || null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await api.fetch('/upload/artigos', { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error(`Erro ao fazer upload: ${await uploadRes.text()}`);
        imagemUrl = (await uploadRes.json()).url;
      }

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
          status,
          tags,
        }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error || 'Erro desconhecido'); }
      toast.success(article ? 'Artigo atualizado! ✅' : status === 'draft' ? 'Rascunho salvo! 📝' : 'Artigo publicado! 🎉');
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Erro ao salvar artigo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isScheduled = (() => {
    const d = watch('data_publicacao');
    if (!d) return false;
    return new Date(d) > new Date();
  })();

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto ${fullscreen ? 'p-0' : 'p-4 pt-8 pb-8'}`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 32, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className={`bg-white shadow-2xl flex flex-col border border-border overflow-hidden transition-all ${fullscreen ? 'w-full h-screen rounded-none' : 'rounded-2xl w-full max-w-6xl'}`}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-secondary to-secondary/90 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                  {article ? 'Editar Artigo' : 'Novo Artigo'}
                </h2>
                <p className="text-white/60 text-xs">
                  {wordCount} palavras · ~{Math.ceil(wordCount / 200)} min leitura
                  {article ? ` · ID: ${article.id?.slice(0, 8)}` : ' · Novo'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm"
                onClick={() => setPreview(p => !p)}
                className="text-white/70 hover:text-white hover:bg-white/10 gap-2">
                {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {preview ? 'Editar' : 'Preview'}
              </Button>
              <Button type="button" variant="ghost" size="sm"
                onClick={() => setFullscreen(f => !f)}
                className="text-white/70 hover:text-white hover:bg-white/10">
                {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
            {/* FORM */}
            <div className="flex-grow overflow-y-auto p-6 md:p-8">
              <form id="article-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* STATUS TOGGLE */}
                <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30">
                  <span className="text-sm font-bold text-foreground">Status:</span>
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${status === 'published' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isScheduled ? 'Agendado' : 'Publicado'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${status === 'draft' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    <PenLine className="w-3.5 h-3.5" /> Rascunho
                  </button>
                  {isScheduled && status === 'published' && (
                    <span className="text-xs text-muted-foreground">· publicação futura agendada</span>
                  )}
                </div>

                {/* TÍTULO + SLUG */}
                <div className="space-y-4">
                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-primary" /> Título do Artigo
                    </Label>
                    <Input
                      placeholder="Ex: Como funciona o transplante capilar FUE?"
                      className="h-11 text-base font-semibold focus-visible:ring-primary"
                      {...register('titulo', { required: 'Título obrigatório' })}
                      onChange={(e) => { register('titulo').onChange(e); handleTitleChange(e); }}
                    />
                    {errors.titulo && <p className="text-xs text-destructive mt-1">{errors.titulo.message}</p>}
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
                      <Button type="button" variant="outline" size="icon" onClick={refreshSlug} title="Regenerar slug">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    {slugValue && (
                      <p className="text-xs text-muted-foreground mt-1">
                        URL: <span className="text-primary font-mono">/blog/{slugValue}</span>
                      </p>
                    )}
                    {errors.slug && <p className="text-xs text-destructive mt-1">{errors.slug.message}</p>}
                  </div>
                </div>

                {/* META: categoria, autor, data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="font-bold flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-primary" /> Categoria
                    </Label>
                    <Select onValueChange={v => setValue('categoria_id', v)} defaultValue={article?.categoria_id}>
                      <SelectTrigger className="focus:ring-primary">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
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
                    <Input type="date" {...register('data_publicacao')} className="focus-visible:ring-primary" />
                  </div>
                </div>

                {/* TAGS */}
                <div>
                  <Label className="font-bold flex items-center gap-2 mb-2">
                    <Hash className="w-4 h-4 text-primary" /> Tags
                    <span className="text-xs font-normal text-muted-foreground normal-case tracking-normal">(Enter ou vírgula para adicionar · máx. 10)</span>
                  </Label>
                  <TagsInput value={tags} onChange={setTags} />
                </div>

                {/* RESUMO */}
                <div>
                  <Label className="font-bold mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Resumo / Meta Description</span>
                    <span className={`text-xs font-normal ${(resumoValue?.length || 0) > 160 ? 'text-destructive' : 'text-muted-foreground'}`}>
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
                      className="prose prose-sm max-w-none p-6 rounded-xl border border-border bg-muted/20 min-h-[350px] overflow-auto"
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
                        className="min-h-[350px]"
                        style={{ fontFamily: 'inherit' }}
                      />
                    </div>
                  )}
                  {(!content || content === '<p><br></p>') ? (
                    <p className="text-xs text-muted-foreground mt-1">Campo obrigatório</p>
                  ) : (
                    <p className="text-xs text-muted-foreground mt-1">
                      {wordCount} palavras · ~{Math.ceil(wordCount / 200)} min de leitura
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* SIDEBAR */}
            <div className="lg:w-72 xl:w-80 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-muted/20 p-5 space-y-5 overflow-y-auto">
              {/* STATUS INFO */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-2 text-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Resumo</p>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estado</span>
                  <Badge className={status === 'published'
                    ? isScheduled ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'}>
                    {status === 'draft' ? 'Rascunho' : isScheduled ? 'Agendado' : 'Publicado'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Alterações</span>
                  <Badge variant={isDirty ? 'default' : 'outline'}>{isDirty ? 'Não salvo' : 'Salvo'}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Palavras</span>
                  <span className="font-bold">{wordCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Leitura</span>
                  <span className="font-bold">~{Math.ceil(wordCount / 200)} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="font-bold">{tags.length}</span>
                </div>
              </div>

              {/* IMAGEM */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Imagem de Destaque</p>
                <ImagePreview article={article} fileRef={fileRef} />
              </div>

              {/* SEO PREVIEW */}
              {(watch('titulo') || watch('resumo')) && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Preview Google</p>
                  <div className="bg-white rounded-xl border border-border p-4 space-y-1">
                    <p className="text-sm text-blue-600 font-medium line-clamp-1 leading-tight">
                      {watch('titulo') || 'Título do artigo'}
                    </p>
                    <p className="text-xs text-green-700 font-mono">
                      institutomilhomem.com/blog/{slugValue || 'slug'}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {watch('resumo') || 'Descrição do artigo aparece aqui...'}
                    </p>
                  </div>
                </div>
              )}

              {/* DICAS */}
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Atalhos</p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Salvar</span>
                    <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">Ctrl+S</kbd>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Preview</span>
                    <span className="text-[10px] font-mono">botão acima</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fechar</span>
                    <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-[10px] font-mono">ESC</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-white flex-shrink-0">
            <p className="text-xs text-muted-foreground hidden sm:flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs font-mono">Ctrl+S</kbd>
              para salvar
            </p>
            <div className="flex gap-3 ml-auto">
              <Button type="button" variant="outline" onClick={onClose} className="font-bold">Cancelar</Button>
              <Button
                type="submit"
                form="article-form"
                disabled={isSubmitting}
                className={`font-bold px-8 gap-2 uppercase tracking-wide ${status === 'draft' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-primary text-primary-foreground hover:bg-secondary hover:text-white'}`}
              >
                {isSubmitting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Salvando...</>
                ) : status === 'draft' ? (
                  <><PenLine className="w-4 h-4" /> Salvar Rascunho</>
                ) : (
                  <><Save className="w-4 h-4" /> {article ? 'Atualizar' : 'Publicar'}</>
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
