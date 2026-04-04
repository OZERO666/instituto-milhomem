// src/components/TestimonialCard.jsx
import React, { useMemo } from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/lib/apiServerClient';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  const testimonialText = testimonial?.mensagem ?? testimonial?.texto ?? '';

  // ─── Foto ─────────────────────────────────────────────────────────────────
  const photoUrl = useMemo(() => {
    if (!testimonial.foto) return null;
    if (testimonial.foto.startsWith('http')) return testimonial.foto;
    return api.getFileUrl('depoimentos', testimonial.id, testimonial.foto);
  }, [testimonial.foto, testimonial.id]);

  const initialName = testimonial.nome?.charAt(0)?.toUpperCase() || 'P';

  // ─── Data ─────────────────────────────────────────────────────────────────
  const formattedDate = useMemo(() => {
    if (!testimonial.data) return null;
    try {
      return format(new Date(testimonial.data), "MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return null;
    }
  }, [testimonial.data]);

  // ─── Nota (usa campo do banco ou padrão 5) ────────────────────────────────
  const rating = testimonial.nota ?? 5;
  void rating; // mantido para compatibilidade futura

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="flex-[0_0_85%] sm:flex-[0_0_60%] lg:flex-[0_0_38%] min-w-0"
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-card h-full flex flex-col
                   p-8 rounded-2xl shadow-md
                   border border-border
                   hover:shadow-xl hover:border-primary/40
                   transition-all duration-500 overflow-hidden"
      >
        {/* Quote decorativo */}
        <Quote
          className="w-10 h-10 text-primary/10 absolute top-5 right-5
                     group-hover:text-primary/20 group-hover:scale-110
                     transition-all duration-300"
        />

        {/* Conteúdo */}
        <div className="relative z-10 flex-grow space-y-5">

          {/* Texto */}
          <p className="text-base leading-relaxed italic text-foreground/80 font-light line-clamp-5">
            "{testimonialText}"
          </p>

        </div>

        {/* Footer */}
        <div className="relative z-10 pt-6 mt-6 border-t border-border">
          <div className="flex items-center gap-4">

            {/* Foto / Inicial */}
            {photoUrl ? (
              <motion.img
                src={photoUrl}
                alt={testimonial.nome}
                loading="lazy"
                className="w-14 h-14 rounded-xl object-cover
                           ring-2 ring-border group-hover:ring-primary/40
                           transition-all duration-300 flex-shrink-0"
                whileHover={{ scale: 1.06 }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-xl flex-shrink-0
                           bg-primary/10 border border-primary/20
                           flex items-center justify-center
                           font-bold text-xl text-primary"
              >
                {initialName}
              </div>
            )}

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-base text-foreground leading-tight truncate">
                {testimonial.nome}
              </p>
              {testimonial.cargo && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {testimonial.cargo}
                </p>
              )}
              {testimonial.servico && (
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5 truncate">
                  {testimonial.servico}
                </p>
              )}
              {formattedDate && (
                <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
              )}
            </div>

          </div>
        </div>

        {/* Hover gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />

      </motion.div>
    </motion.div>
  );
};

export default TestimonialCard;
