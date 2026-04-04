// src/components/TestimonialsCarousel.jsx
import React, { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TestimonialCard from './TestimonialCard.jsx';

const TestimonialsCarousel = ({ testimonials = [], emptyMessage = 'Nenhum depoimento cadastrado ainda.' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', dragFree: true, containScroll: 'trimSnaps' },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [testimonials, emblaApi]);

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12 bg-muted rounded-2xl">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4">

      {/* Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) =>
            testimonial?.id ? (
              <div
                key={testimonial.id}
                className="pr-4 sm:pr-5 flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_36%] min-w-0"
              >
                <TestimonialCard testimonial={testimonial} index={index} />
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Botão anterior */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2
                   w-9 h-9 sm:w-10 sm:h-10 bg-background border border-border rounded-full
                   flex items-center justify-center shadow-lg
                   hover:bg-muted hover:text-primary transition-colors z-10"
        aria-label="Depoimento anterior"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Botão próximo */}
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2
                   w-9 h-9 sm:w-10 sm:h-10 bg-background border border-border rounded-full
                   flex items-center justify-center shadow-lg
                   hover:bg-muted hover:text-primary transition-colors z-10"
        aria-label="Próximo depoimento"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

    </div>
  );
};

export default TestimonialsCarousel;
