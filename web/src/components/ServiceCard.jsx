// src/components/ServiceCard.jsx
import React, { useMemo, lazy, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';
import { CheckCircle } from '@phosphor-icons/react/dist/csr/CheckCircle';
import { Sparkle } from '@phosphor-icons/react/dist/csr/Sparkle';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '@/lib/apiServerClient';
import { ICON_MAP } from '@/features/admin/tabs/ServicosTab.jsx';

// Lazy-load PhosphorIcon para manter o glob de módulos num chunk separado
const PhosphorIcon = lazy(() => import('@/components/PhosphorIcon.jsx'));

// ─── Fallback quando não há ícone cadastrado ──────────────────────────────────
const FallbackIcon = ({ size = 28 }) => (
  <Sparkle
    size={size}
    weight="regular"
    className="text-primary group-hover:text-primary-foreground transition-colors duration-300"
  />
);

// ─── Ícone do serviço (suporta chaves AestheticIcons e Phosphor) ────────────
function ServiceIcon({ icon, size = 28, className = '' }) {
  const AestheticIcon = icon ? ICON_MAP[icon] : null;
  if (AestheticIcon) return <AestheticIcon className={`${className}`} style={{ width: size, height: size }} />;
  if (icon) return (
    <Suspense fallback={<Sparkle size={size} weight="regular" className="text-primary opacity-40" />}>
      <PhosphorIcon name={icon} size={size} weight="regular" className={className} />
    </Suspense>
  );
  return <FallbackIcon size={size} />;
}

const ServiceCard = ({ id, nome, descricao, beneficios, imagem, icon, slug, index, ctaLabel }) => {
  const { t } = useTranslation();
  const imageUrl = useMemo(() => {
    return api.resolveMediaUrl('servicos', imagem);
  }, [imagem]);
  const resolvedCtaLabel = ctaLabel ?? t('service_detail.related.learn_more');

  const benefitsList = useMemo(() => {
    if (!beneficios) return [];
    const sep = beneficios.includes('\n') ? '\n' : ',';
    return beneficios.split(sep).map(b => b.trim()).filter(Boolean);
  }, [beneficios]);

  return (
    <motion.div
      className="bg-card rounded-2xl border border-border shadow-md
                 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1
                 transition-all duration-300 flex flex-col h-full group relative overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    >
      {/* ── Decorativo ────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full
                   group-hover:scale-[2.2] group-hover:bg-primary/8
                   transition-transform duration-700 ease-out pointer-events-none"
      />

      {/* ── Imagem (quando há) ─────────────────────────────────────────── */}
      {imageUrl && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-2xl">
          <img
            src={imageUrl}
            alt={nome}
            width="600"
            height="192"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {icon && (
            <div className="absolute top-3 left-3 w-11 h-11
                            bg-secondary/80 backdrop-blur-sm rounded-xl
                            flex items-center justify-center
                            border border-primary/30 shadow-md">
              <ServiceIcon icon={icon} size={20} className="text-primary" />
            </div>
          )}
        </div>
      )}

      {/* ── Corpo ─────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 lg:p-7 flex flex-col flex-grow relative z-10">

        {/* Cabeçalho: ícone + nome (sem imagem) */}
        {!imageUrl && (
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-14 h-14 bg-primary/10 rounded-2xl
                         flex items-center justify-center flex-shrink-0
                         border border-primary/20
                         group-hover:bg-primary group-hover:border-primary
                         transition-all duration-300"
            >
              {icon
                ? <ServiceIcon icon={icon} size={28} className="text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                : <FallbackIcon size={28} />
              }
            </div>
            <h3 className="text-lg font-bold text-foreground leading-snug">{nome}</h3>
          </div>
        )}

        {/* Nome abaixo da imagem */}
        {imageUrl && (
          <h3 className="text-lg font-bold text-foreground mb-3 leading-snug">{nome}</h3>
        )}

        {/* Descrição */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-grow mb-5">
          {descricao}
        </p>

        {/* Benefícios */}
        {benefitsList.length > 0 && (
          <ul className="space-y-2 mb-6">
            {benefitsList.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-foreground/80">
                <CheckCircle
                  size={15}
                  weight="fill"
                  color="hsl(var(--primary))"
                  className="flex-shrink-0 mt-px"
                />
                <span className="line-clamp-1">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <Link
          to={slug ? `/servicos/${slug}` : '/servicos'}
          className="inline-flex items-center justify-center gap-2
                     bg-primary text-primary-foreground
                     font-bold text-sm py-3 px-6 rounded-xl
                     hover:bg-accent hover:shadow-gold
                     active:scale-[0.97]
                     transition-all duration-300 mt-auto w-full"
        >
          {resolvedCtaLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;