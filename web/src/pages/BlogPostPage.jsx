import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import api from '@/lib/apiServerClient';
import SEO from '@/components/SEO.jsx';
import { usePagesConfig } from '@/hooks/usePagesConfig';
import { useTraducoes } from '@/hooks/useTraducoes';

const BlogPostPage = () => {
  const pageConfig = usePagesConfig('blog_post');
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { apply } = useTraducoes('artigos', article?.id);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        // Busca artigo pelo slug
        const records = await api
          .fetch(`/artigos?slug=${encodeURIComponent(slug)}&expand=categoria`)
          .then(r => r.json());

        const list = Array.isArray(records) ? records : [];

        if (list.length > 0) {
          const currentArticle = list[0];
          setArticle(currentArticle);

          // Busca artigos relacionados pela mesma categoria
          if (currentArticle.categoria) {
            const relatedRes = await api
              .fetch(
                `/artigos?categoria=${currentArticle.categoria}&sort=-data_publicacao&limit=3`
              )
              .then(r => r.json());

            const related = Array.isArray(relatedRes)
              ? relatedRes.filter(a => a.id !== currentArticle.id).slice(0, 3)
              : [];

            setRelatedArticles(related);
          }
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchArticle();
  }, [slug]);

  const getImageUrl = (article) => {
    if (!article?.imagem_destaque) return null;
    if (article.imagem_destaque.startsWith('http')) return article.imagem_destaque;
    const base = import.meta.env.VITE_API_URL || '';
    return `${base}/uploads/${article.imagem_destaque}`;
  };

  const parseTags = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
  };

  // ─── LOADING ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-grow flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground font-bold uppercase tracking-widest">{pageConfig.loading_text}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── NÃO ENCONTRADO (inclui rascunhos — não acessíveis pelo público) ────────
  if (!article || article.status === 'draft') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-grow flex items-center justify-center bg-muted">
          <div className="text-center bg-card p-12 rounded-2xl border border-border shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-secondary">{pageConfig.not_found_title}</h1>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-accent transition-colors uppercase tracking-wide"
            >
              <ArrowLeft className="w-4 h-4" />
              {pageConfig.back_to_blog}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── ARTIGO ────────────────────────────────────────────────
  const displayArticle = apply(article);
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO
        type="article"
        title={`${displayArticle.titulo} | Blog Instituto Milhomem`}
        description={displayArticle.resumo || displayArticle.titulo}
        ogImage={getImageUrl(article) || undefined}
        url={`https://institutomilhomem.com/blog/${article.slug}`}
        author={article.autor || 'Dr. Pablo Milhomem'}
        publishedTime={article.data_publicacao ? new Date(article.data_publicacao).toISOString() : undefined}
        modifiedTime={article.updated ? new Date(article.updated).toISOString() : undefined}
        section={article.categoria_nome || article.categoria || undefined}
        articleTags={parseTags(article.tags)}
        keywords={parseTags(article.tags).join(', ') || undefined}
      />

      <WhatsAppButton />

      <main className="flex-grow bg-background">
        <article className="section-padding">
          <div className="container-custom max-w-4xl">

            {/* VOLTAR */}
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-bold uppercase tracking-wider text-sm transition-colors duration-300 mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              {pageConfig.back_to_blog}
            </Link>

            {/* IMAGEM DESTAQUE */}
            {getImageUrl(article) && (
              <div className="aspect-video bg-muted rounded-2xl overflow-hidden mb-10 border border-border shadow-lg">
                <img
                  src={getImageUrl(article)}
                  alt={displayArticle.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* CABEÇALHO DO ARTIGO */}
            <div className="mb-10">
              {article.expand?.categoria?.nome && (
                <span className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                  {article.expand.categoria.nome}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-secondary leading-tight">
                {displayArticle.titulo}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium border-y border-border py-4">
                {article.data_publicacao && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>
                      {format(new Date(article.data_publicacao), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                    </span>
                  </div>
                )}
                {article.autor && (
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>{article.autor}</span>
                  </div>
                )}
              </div>

              {/* TAGS */}
              {parseTags(article.tags).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {parseTags(article.tags).map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CONTEÚDO */}
            <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-secondary prose-p:text-foreground/80 prose-a:text-primary hover:prose-a:text-accent prose-strong:text-secondary">
              <div
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(displayArticle.conteudo || '') }}
              />
            </div>

            {/* ARTIGOS RELACIONADOS */}
            {relatedArticles.length > 0 && (
              <div className="mt-20 pt-16 border-t-2 border-border">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-primary"></div>
                  <h2 className="text-2xl font-bold text-secondary uppercase tracking-wide">
                    {pageConfig.related_title}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      to={`/blog/${related.slug}`}
                      className="bg-card rounded-xl border border-border hover:border-primary shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col"
                    >
                      {getImageUrl(related) && (
                        <div className="aspect-video bg-muted overflow-hidden relative">
                          <img
                            src={getImageUrl(related)}
                            alt={related.titulo}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-bold mb-4 text-secondary group-hover:text-primary transition-colors duration-300 line-clamp-2">
                          {related.titulo}
                        </h3>
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider group-hover:gap-3 transition-all duration-300 mt-auto">
                          {pageConfig.related_cta}
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </article>
      </main>

    </div>
  );
};

export default BlogPostPage;
