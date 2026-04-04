import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTraducoesMulti } from '@/hooks/useTraducoesMulti';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import ServiceCard from '@/components/ServiceCard.jsx';
import api from '@/lib/apiServerClient';
import SEO from '@/components/SEO.jsx';
import { usePagesConfig } from '@/hooks/usePagesConfig';

const ServicosPage = () => {
  const { t } = useTranslation();
  const { applyList } = useTraducoesMulti('servicos');
  const pageConfig = usePagesConfig('servicos');
  const labelsConfig = usePagesConfig('labels');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const records = await api.fetch('/servicos?sort=ordem').then(r => r.json());
        setServices(Array.isArray(records) ? records : []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SEO
        keywords="transplante capilar, FUE, mesoterapia capilar, PRP, Goiânia, restauração capilar, clínica capilar"
      />

      <WhatsAppButton />

      <main className="flex-grow">
        <section className="section-padding bg-muted">
          <div className="container-custom">

            {/* HEADER */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-primary"></div>
                <span className="text-primary font-bold uppercase tracking-widest text-sm">{pageConfig.header_badge}</span>
                <div className="w-8 h-px bg-primary"></div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-foreground">
                {pageConfig.header_title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {pageConfig.header_subtitle}
              </p>
            </div>

            {/* GRID SERVIÇOS */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl p-8 border border-border shadow-sm animate-pulse h-64"></div>
                ))}
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                {applyList(services).map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    {...service}
                    index={index}
                    ctaLabel={labelsConfig.service_card_cta}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl border border-border mb-20">
                <p className="text-muted-foreground font-medium text-lg">{t('common.no_services', 'Nenhum serviço encontrado.')}</p>
              </div>
            )}

          </div>
        </section>
      </main>

    </div>
  );
};

export default ServicosPage;
