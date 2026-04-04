// src/pages/ContatoPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button }   from '@/components/ui/button.jsx';
import { Input }    from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select.jsx';
import { Label }    from '@/components/ui/label.jsx';
import SEO          from '@/components/SEO.jsx';
import WhatsAppButton from '@/components/WhatsAppButton.jsx';
import api          from '@/lib/apiServerClient';
import { useContatoConfig, buildWhatsappUrl, formatTelHref } from '@/hooks/useContatoConfig';
import { usePagesConfig } from '@/hooks/usePagesConfig';
import { LOGO_URL } from '@/config/site';

const ContatoPage = () => {
  const pageConfig  = usePagesConfig('contato');
  const config      = useContatoConfig();
  const whatsappUrl = buildWhatsappUrl(config.whatsapp, config.mensagem_header);
  const mapLink     = config.maps_url || `https://maps.google.com/?q=${config.latitude || '-16.6869'},${config.longitude || '-49.2648'}`;

  const [services,     setServices]     = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    api.fetch('/servicos')
      .then(r => r.json())
      .then(d => setServices(Array.isArray(d) ? d.sort((a, b) => (a.ordem || 0) - (b.ordem || 0)) : []))
      .catch(() => {});
  }, []);

  const onSubmit = useCallback(async (data) => {
    setIsSubmitting(true);
    try {
      const res = await api.fetch('/agendamentos', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome:         data.nome,
          email:        data.email,
          telefone:     data.telefone,
          mensagem:     data.mensagem,
          tipo_servico: data.tipo_servico,
          lido:         false,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      reset();
    } catch {
      toast.error('Erro ao enviar mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }, [reset]);

  return (
    <>
      <SEO page="contato" />
      <WhatsAppButton />

      <main className="flex-grow">
        <section className="section-padding bg-muted relative overflow-hidden">

          {/* Marca d'água */}
          <div className="absolute top-0 left-0 opacity-[0.04] pointer-events-none">
            <img
              src={config.logo_url || LOGO_URL}
              alt=""
              className="w-[500px] h-[500px] -translate-x-1/4 -translate-y-1/4"
            />
          </div>

          <div className="container-custom relative z-10">

            {/* Título */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-[11px]">
                  {pageConfig.header_badge}
                </span>
                <div className="w-8 h-px bg-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-foreground leading-tight">
                {pageConfig.header_title} <span className="text-primary">{pageConfig.header_highlight}</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {pageConfig.header_subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

              {/* ── FORMULÁRIO ── */}
              <div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 bg-card p-8 md:p-10 rounded-2xl shadow-lg border border-border/60"
                >
                  <h2 className="text-xl font-bold mb-4 text-secondary uppercase tracking-wide">
                    {pageConfig.form_title}
                  </h2>

                  <div>
                    <Label htmlFor="nome" className="font-bold text-xs uppercase tracking-wider">
                      Nome completo *
                    </Label>
                    <Input
                      id="nome"
                      {...register('nome', { required: 'Nome é obrigatório' })}
                      className={`mt-2 bg-input border-border focus-visible:ring-primary ${
                        errors.nome ? 'border-destructive' : ''
                      }`}
                      placeholder="Seu nome"
                    />
                    {errors.nome && (
                      <p className="text-xs text-destructive mt-1.5 font-medium">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="font-bold text-xs uppercase tracking-wider">
                      E-mail *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'E-mail é obrigatório',
                        pattern: {
                          value:   /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'E-mail inválido',
                        },
                      })}
                      className={`mt-2 bg-input border-border focus-visible:ring-primary ${
                        errors.email ? 'border-destructive' : ''
                      }`}
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1.5 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="telefone" className="font-bold text-xs uppercase tracking-wider">
                      Telefone / WhatsApp *
                    </Label>
                    <Input
                      id="telefone"
                      {...register('telefone', { required: 'Telefone é obrigatório' })}
                      className={`mt-2 bg-input border-border focus-visible:ring-primary ${
                        errors.telefone ? 'border-destructive' : ''
                      }`}
                      placeholder="(62) 99999-9999"
                    />
                    {errors.telefone && (
                      <p className="text-xs text-destructive mt-1.5 font-medium">
                        {errors.telefone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="font-bold text-xs uppercase tracking-wider">
                      Serviço de interesse
                    </Label>
                    <Select onValueChange={(v) => setValue('tipo_servico', v)}>
                      <SelectTrigger className="mt-2 bg-input border-border focus:ring-primary">
                        <SelectValue placeholder="Selecione um serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(s => (
                          <SelectItem key={s.id} value={s.nome}>
                            {s.nome}
                          </SelectItem>
                        ))}
                        <SelectItem value="outro">Outro / Não sei ainda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label
                      htmlFor="mensagem"
                      className="font-bold text-xs uppercase tracking-wider"
                    >
                      Mensagem
                      <span className="ml-1 text-[11px] text-muted-foreground font-normal normal-case tracking-normal">
                        (opcional)
                      </span>
                    </Label>
                    <Textarea
                      id="mensagem"
                      {...register('mensagem')}
                      className="mt-2 bg-input border-border focus-visible:ring-primary resize-none"
                      rows={4}
                      placeholder="Conte-nos sobre seu caso ou dúvidas"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-5 text-sm font-bold uppercase tracking-[0.22em]
                                 bg-primary text-primary-foreground hover:bg-accent transition-colors
                                 rounded-xl"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-5 text-sm font-bold uppercase tracking-[0.22em]
                                 bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors
                                 rounded-xl flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Via WhatsApp
                    </a>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                    Ao enviar, você concorda com nossa{' '}
                    <Link to="/privacidade" className="text-primary hover:underline">
                      Política de Privacidade
                    </Link>.
                  </p>
                </form>
              </div>

              {/* ── INFO + MAPA ── */}
              <div className="space-y-8">

                {/* Card de informações */}
                <div className="bg-secondary text-white p-8 md:p-10 rounded-2xl shadow-lg border border-primary/40 relative overflow-hidden">
                  <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                    <img
                      src={config.logo_url || LOGO_URL}
                      alt=""
                      className="w-48 h-48 translate-x-1/4 translate-y-1/4"
                    />
                  </div>

                  <h2 className="text-sm font-bold mb-6 text-primary uppercase tracking-[0.25em]">
                    {pageConfig.info_title}
                  </h2>

                  <div className="space-y-6 relative z-10">
                    {[
                      { icon: MapPin, label: 'Endereço',  content: config.endereco,           href: mapLink,                      external: true  },
                      { icon: Phone,  label: 'Telefone',  content: config.telefone,            href: formatTelHref(config.telefone)                },
                      { icon: Mail,   label: 'E-mail',    content: config.email,               href: `mailto:${config.email}`                     },
                      { icon: Clock,  label: 'Horário',   content: `${config.dias_funcionamento}\n${config.horario}`, href: null },
                    ].map(({ icon: Icon, label, content, href, external }) => (
                      <div key={label} className="flex items-start gap-4 group">
                        <div
                          className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center
                                     flex-shrink-0 border border-primary/40 transition-colors
                                     group-hover:bg-primary/25"
                        >
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-1 uppercase tracking-wide">
                            {label}
                          </p>
                          {href ? (
                            <a
                              href={href}
                              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                              className="text-white/80 hover:text-white transition-colors whitespace-pre-wrap underline-offset-4 hover:underline"
                            >
                              {content}
                            </a>
                          ) : (
                            <p className="text-white/80 whitespace-pre-wrap">
                              {content}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
                    <h3 className="text-sm font-bold mb-4 uppercase tracking-[0.18em] text-secondary">Siga-nos</h3>
                    <div className="flex flex-wrap gap-3">
                      {config.instagram && (
                        <a
                          href={config.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3 bg-white/90 text-sm font-semibold text-foreground rounded-2xl border border-border transition hover:bg-primary hover:text-primary-foreground"
                        >
                          <Instagram className="w-4 h-4" /> Instagram
                        </a>
                      )}
                      {config.facebook && (
                        <a
                          href={config.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3 bg-white/90 text-sm font-semibold text-foreground rounded-2xl border border-border transition hover:bg-primary hover:text-primary-foreground"
                        >
                          <Facebook className="w-4 h-4" /> Facebook
                        </a>
                      )}
                    </div>
                  </div>

                {/* Mapa */}
                <div className="aspect-video bg-muted rounded-2xl overflow-hidden border border-border/60 shadow-lg">
                  <iframe
                    src={`https://maps.google.com/maps?q=${config.latitude || '-16.6869'},${config.longitude || '-49.2648'}&z=${config.zoom || '15'}&output=embed`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Instituto Milhomem"
                  />
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ContatoPage;
