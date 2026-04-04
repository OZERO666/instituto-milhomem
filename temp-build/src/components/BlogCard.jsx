import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/apiServerClient';

const BlogCard = ({ article, ctaLabel = 'Ler artigo' }) => {
  const getImageUrl = () => {
    if (!article.imagem_destaque) return null;
    if (article.imagem_destaque.startsWith('http')) return article.imagem_destaque;
    return api.getFileUrl('artigos', article.id, article.imagem_destaque);
  };

  const imageUrl = getImageUrl();

  return (
    <Link
      to={`/blog/${article.slug}`}
      className="bg-white rounded-xl border border-primary shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full overflow-hidden"
    >
      {imageUrl && (
        <div className="aspect-video bg-muted overflow-hidden relative">
          <img
            src={imageUrl}
            alt={article.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
          <Calendar className="w-4 h-4" />
          {article.data_publicacao && (
            <span>
              {format(new Date(article.data_publicacao), "dd MMM, yyyy", { locale: ptBR })}
            </span>
          )}
          {article.categoria && (
            <>
              <span className="w-1 h-1 rounded-full bg-primary mx-1"></span>
              <span>{article.categoria}</span>
            </>
          )}
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {article.titulo}
        </h3>
        {article.resumo && (
          <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed flex-grow text-sm">
            {article.resumo}
          </p>
        )}
        <div className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all duration-300 mt-auto uppercase text-sm tracking-wide">
          {ctaLabel}
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
