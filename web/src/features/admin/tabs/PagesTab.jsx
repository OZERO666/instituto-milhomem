import React from 'react';
import { Plus, X, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import AdminSectionSwitch from '@/features/admin/components/AdminSectionSwitch.jsx';
import { PAGES_SECTION_OPTIONS } from '@/features/admin/constants/navigation.js';
import MediaSelectorField from '@/features/admin/components/MediaSelectorField.jsx';
import TranslationFields from '@/features/admin/components/TranslationFields.jsx';

const PAGES_TRANSLATION_FIELDS = {
  home: [
    { name: 'services_badge',     label: 'Serviços – Badge',       type: 'input' },
    { name: 'services_title',     label: 'Serviços – Título',      type: 'input' },
    { name: 'services_subtitle',  label: 'Serviços – Subtítulo',   type: 'textarea', rows: 2 },
    { name: 'services_cta',       label: 'Serviços – CTA',         type: 'input' },
    { name: 'journey_badge',      label: 'Jornada – Badge',        type: 'input' },
    { name: 'journey_title',      label: 'Jornada – Título',       type: 'input' },
    { name: 'about_badge',        label: 'Sobre – Badge',          type: 'input' },
    { name: 'about_title',        label: 'Sobre – Título',         type: 'input' },
    { name: 'about_highlight',    label: 'Sobre – Destaque',       type: 'input' },
    { name: 'about_paragraph_1',  label: 'Sobre – Parágrafo 1',    type: 'textarea', rows: 2 },
    { name: 'about_paragraph_2',  label: 'Sobre – Parágrafo 2',    type: 'textarea', rows: 2 },
    { name: 'results_badge',      label: 'Resultados – Badge',     type: 'input' },
    { name: 'results_title',      label: 'Resultados – Título',    type: 'input' },
    { name: 'final_cta_badge',    label: 'CTA Final – Badge',      type: 'input' },
    { name: 'final_cta_title',    label: 'CTA Final – Título',     type: 'input' },
    { name: 'final_cta_subtitle', label: 'CTA Final – Subtítulo',  type: 'textarea', rows: 2 },
  ],
  servicos: [
    { name: 'header_badge',     label: 'Badge',     type: 'input' },
    { name: 'header_title',     label: 'Título',    type: 'input' },
    { name: 'header_subtitle',  label: 'Subtítulo', type: 'textarea', rows: 3 },
  ],
  blog: [
    { name: 'header_badge',          label: 'Badge',              type: 'input' },
    { name: 'header_title',          label: 'Título',             type: 'input' },
    { name: 'header_subtitle',       label: 'Subtítulo',          type: 'textarea', rows: 2 },
    { name: 'all_categories_label',  label: 'Texto "Todos"',      type: 'input' },
    { name: 'search_placeholder',    label: 'Placeholder Busca',  type: 'input' },
    { name: 'empty_title',           label: 'Título Vazio',        type: 'input' },
    { name: 'empty_subtitle',        label: 'Subtítulo Vazio',     type: 'input' },
  ],
  contato: [
    { name: 'header_badge',      label: 'Badge',                type: 'input' },
    { name: 'header_title',      label: 'Título',               type: 'input' },
    { name: 'header_highlight',  label: 'Destaque do Título',   type: 'input' },
    { name: 'header_subtitle',   label: 'Subtítulo',            type: 'textarea', rows: 2 },
    { name: 'form_title',        label: 'Título Formulário',    type: 'input' },
    { name: 'info_title',        label: 'Título Informações',  type: 'input' },
  ],
  resultados: [
    { name: 'header_badge',         label: 'Badge',              type: 'input' },
    { name: 'header_title',         label: 'Título',             type: 'input' },
    { name: 'header_subtitle',      label: 'Subtítulo',          type: 'textarea', rows: 2 },
    { name: 'testimonials_badge',   label: 'Badge Depoimentos',  type: 'input' },
    { name: 'testimonials_title',   label: 'Título Depoimentos', type: 'input' },
  ],
  footer: [
    { name: 'description',   label: 'Descrição',       type: 'textarea', rows: 3 },
    { name: 'rights_text',   label: 'Texto Direitos',  type: 'input' },
    { name: 'credits_text',  label: 'Texto Créditos',  type: 'input' },
  ],
  service_detail: [
    { name: 'breadcrumb_home',      label: 'Breadcrumb Início',    type: 'input' },
    { name: 'breadcrumb_services',  label: 'Breadcrumb Serviços', type: 'input' },
    { name: 'hero_badge',           label: 'Badge Hero',           type: 'input' },
    { name: 'hero_cta_text',        label: 'CTA Hero',             type: 'input' },
    { name: 'benefits_title',       label: 'Título Benefícios',    type: 'input' },
    { name: 'sidebar_title',        label: 'Título Sidebar',       type: 'input' },
    { name: 'sidebar_button',       label: 'Botão Sidebar',        type: 'input' },
    { name: 'back_to_services',     label: 'Texto Voltar',         type: 'input' },
    { name: 'related_badge',        label: 'Badge Relacionados',   type: 'input' },
    { name: 'related_title',        label: 'Título Relacionados',  type: 'input' },
  ],
  blog_post: [
    { name: 'back_to_blog',   label: 'Texto Voltar',          type: 'input' },
    { name: 'related_title',  label: 'Título Relacionados',   type: 'input' },
    { name: 'related_cta',    label: 'CTA Relacionados',       type: 'input' },
  ],
  labels: [
    { name: 'service_card_cta',      label: 'CTA Card Serviço',   type: 'input' },
    { name: 'blog_card_cta',         label: 'CTA Card Blog',       type: 'input' },
    { name: 'before_after_empty',    label: 'Galeria Vazia',       type: 'input' },
    { name: 'testimonials_empty',    label: 'Depoimentos Vazio',   type: 'input' },
  ],
};

const PAGES_CONFIG_KEYS = ['home', 'servicos', 'blog', 'contato', 'resultados', 'footer', 'service_detail', 'blog_post', 'labels'];

// ─── Section field helper ─────────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">{label}</Label>
    {children}
  </div>
);

const PagesTab = ({ pagesForm, pagesSection, setPagesSection, pagesConfig, pagesSaving, onPagesSubmit }) => (
  <div className="space-y-6">
    <AdminSectionSwitch
      options={PAGES_SECTION_OPTIONS}
      activeKey={pagesSection}
      onChange={setPagesSection}
    />

    <form onSubmit={pagesForm.handleSubmit(onPagesSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-5">

        {pagesSection === 'home' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-6">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Home</h3>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seção Serviços</p>
              <Input {...pagesForm.register('home.services.badge')} placeholder="Badge" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.services.title')} placeholder="Título" className="focus-visible:ring-primary" />
              <Textarea {...pagesForm.register('home.services.subtitle')} rows={2} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
              <Input {...pagesForm.register('home.services.cta_text')} placeholder="Texto do botão" className="focus-visible:ring-primary" />
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seção Jornada</p>
              <Input {...pagesForm.register('home.journey.badge')} placeholder="Badge" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.journey.title')} placeholder="Título" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.journey.cta_text')} placeholder="Texto do botão" className="focus-visible:ring-primary" />

              {(pagesForm.watch('home.journey.steps') || []).map((step, idx) => (
                <div key={idx} className="p-3 bg-muted/40 rounded-lg border border-border/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Passo {idx + 1}</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        const current = [...(pagesForm.getValues('home.journey.steps') || [])];
                        current.splice(idx, 1);
                        pagesForm.setValue('home.journey.steps', current);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    type="number"
                    value={step.step ?? idx + 1}
                    onChange={(e) => {
                      const current = [...(pagesForm.getValues('home.journey.steps') || [])];
                      current[idx] = { ...current[idx], step: Number(e.target.value) || idx + 1 };
                      pagesForm.setValue('home.journey.steps', current);
                    }}
                    className="focus-visible:ring-primary"
                    placeholder="Número"
                  />
                  <Input
                    value={step.title || ''}
                    onChange={(e) => {
                      const current = [...(pagesForm.getValues('home.journey.steps') || [])];
                      current[idx] = { ...current[idx], title: e.target.value };
                      pagesForm.setValue('home.journey.steps', current);
                    }}
                    className="focus-visible:ring-primary"
                    placeholder="Título"
                  />
                  <Textarea
                    value={step.desc || ''}
                    onChange={(e) => {
                      const current = [...(pagesForm.getValues('home.journey.steps') || [])];
                      current[idx] = { ...current[idx], desc: e.target.value };
                      pagesForm.setValue('home.journey.steps', current);
                    }}
                    rows={2}
                    className="resize-none focus-visible:ring-primary"
                    placeholder="Descrição"
                  />
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const current = [...(pagesForm.getValues('home.journey.steps') || [])];
                  current.push({ step: current.length + 1, title: '', desc: '' });
                  pagesForm.setValue('home.journey.steps', current);
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Adicionar Passo
              </Button>
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seção Sobre</p>
              <Field label="Badge">
                <Input {...pagesForm.register('home.about.badge')} placeholder="Ex: Nossa História" className="focus-visible:ring-primary" />
              </Field>
              <Field label="Título linha 1">
                <Input {...pagesForm.register('home.about.title')} placeholder="Ex: Instituto Milhomem" className="focus-visible:ring-primary" />
              </Field>
              <Field label="Título destaque">
                <Input {...pagesForm.register('home.about.highlight')} placeholder="Ex: Excelência em Transplante" className="focus-visible:ring-primary" />
              </Field>
              <Field label="Parágrafo 1">
                <Textarea {...pagesForm.register('home.about.paragraph_1')} rows={2} className="resize-none focus-visible:ring-primary" />
              </Field>
              <Field label="Parágrafo 2">
                <Textarea {...pagesForm.register('home.about.paragraph_2')} rows={2} className="resize-none focus-visible:ring-primary" />
              </Field>
              <Field label="Texto do botão">
                <Input {...pagesForm.register('home.about.cta_text')} placeholder="Ex: Conheça nossa história" className="focus-visible:ring-primary" />
              </Field>
              <Field label="Texto do card lateral">
                <Input {...pagesForm.register('home.about.card_text')} placeholder="Use \n para quebra de linha" className="focus-visible:ring-primary" />
              </Field>
              <Field label="Botão do card lateral">
                <Input {...pagesForm.register('home.about.card_button_text')} placeholder="Ex: Agendar Consulta" className="focus-visible:ring-primary" />
              </Field>

              {/* IMAGENS DA SEÇÃO SOBRE */}
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Imagens da Seção {' '}
                  <span className="font-normal normal-case text-muted-foreground/70">(clique ou arraste do dispositivo)</span>
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(pagesForm.watch('home.about.images') || []).map((image, idx) => {
                    const imgUrl = typeof image === 'string' ? image : (image?.url || '');
                    return (
                      <div key={idx} className="relative">
                        <div className="absolute top-2 right-2 z-10">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-6 w-6 rounded-full shadow"
                            onClick={() => {
                              const current = [...(pagesForm.getValues('home.about.images') || [])];
                              current.splice(idx, 1);
                              pagesForm.setValue('home.about.images', current);
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="border border-border rounded-xl p-2 bg-muted/20 space-y-2">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground px-1">Imagem {idx + 1}</p>
                          <MediaSelectorField
                            value={imgUrl}
                            onChange={(val) => {
                              const current = [...(pagesForm.getValues('home.about.images') || [])];
                              current[idx] = val;
                              pagesForm.setValue('home.about.images', current, { shouldDirty: true });
                            }}
                            folder="misc"
                            libraryFolders={['all', 'branding', 'misc']}
                            previewClassName="h-32"
                            helperText={`Imagem ${idx + 1} da seção Sobre da Home.`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    const current = [...(pagesForm.getValues('home.about.images') || [])];
                    current.push('');
                    pagesForm.setValue('home.about.images', current);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" /> Adicionar Imagem
                </Button>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seção Resultados</p>
              <Input {...pagesForm.register('home.results.badge')} placeholder="Badge" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.results.title')} placeholder="Título" className="focus-visible:ring-primary" />
              <Textarea {...pagesForm.register('home.results.subtitle')} rows={2} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
              <Input {...pagesForm.register('home.results.cta_text')} placeholder="Texto do botão" className="focus-visible:ring-primary" />
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seções Depoimentos e Blog</p>
              <Input {...pagesForm.register('home.testimonials.badge')} placeholder="Badge depoimentos" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.testimonials.title')} placeholder="Título depoimentos" className="focus-visible:ring-primary" />
              <Textarea {...pagesForm.register('home.testimonials.subtitle')} rows={2} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo depoimentos" />
              <Input {...pagesForm.register('home.blog.badge')} placeholder="Badge blog" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.blog.title')} placeholder="Título blog" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.blog.cta_text')} placeholder="Texto botão blog" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.blog.empty_title')} placeholder="Título vazio blog" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.blog.empty_subtitle')} placeholder="Subtítulo vazio blog" className="focus-visible:ring-primary" />
            </div>

            <div className="p-4 border border-border rounded-lg space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">CTA Final</p>
              <Input {...pagesForm.register('home.final_cta.badge')} placeholder="Badge" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.final_cta.title')} placeholder="Título" className="focus-visible:ring-primary" />
              <Textarea {...pagesForm.register('home.final_cta.subtitle')} rows={3} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
              <Input {...pagesForm.register('home.final_cta.primary_cta_text')} placeholder="Texto botão principal" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.final_cta.secondary_cta_text')} placeholder="Texto botão secundário" className="focus-visible:ring-primary" />
            </div>
          </div>
        )}

        {pagesSection === 'servicos' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Página Serviços</h3>
            <Input {...pagesForm.register('servicos.header_badge')} placeholder="Badge" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('servicos.header_title')} placeholder="Título" className="focus-visible:ring-primary" />
            <Textarea {...pagesForm.register('servicos.header_subtitle')} rows={3} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
          </div>
        )}

        {pagesSection === 'blog' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Página Blog</h3>
            <Input {...pagesForm.register('blog.header_badge')} placeholder="Badge" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog.header_title')} placeholder="Título" className="focus-visible:ring-primary" />
            <Textarea {...pagesForm.register('blog.header_subtitle')} rows={3} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
            <Input {...pagesForm.register('blog.all_categories_label')} placeholder="Texto botão Todos" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog.search_placeholder')} placeholder="Placeholder de busca" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog.empty_title')} placeholder="Título vazio" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog.empty_subtitle')} placeholder="Subtítulo vazio" className="focus-visible:ring-primary" />
          </div>
        )}

        {pagesSection === 'contato' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Página Contato</h3>
            <Input {...pagesForm.register('contato.header_badge')} placeholder="Badge" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('contato.header_title')} placeholder="Título" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('contato.header_highlight')} placeholder="Destaque do título" className="focus-visible:ring-primary" />
            <Textarea {...pagesForm.register('contato.header_subtitle')} rows={3} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
            <Input {...pagesForm.register('contato.form_title')} placeholder="Título do formulário" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('contato.info_title')} placeholder="Título das informações" className="focus-visible:ring-primary" />
          </div>
        )}

        {pagesSection === 'resultados' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Página Resultados</h3>
            <Input {...pagesForm.register('resultados.header_badge')} placeholder="Badge" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('resultados.header_title')} placeholder="Título" className="focus-visible:ring-primary" />
            <Textarea {...pagesForm.register('resultados.header_subtitle')} rows={3} className="resize-none focus-visible:ring-primary" placeholder="Subtítulo" />
            <Input {...pagesForm.register('resultados.testimonials_badge')} placeholder="Badge depoimentos" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('resultados.testimonials_title')} placeholder="Título depoimentos" className="focus-visible:ring-primary" />
          </div>
        )}

        {pagesSection === 'footer' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Footer</h3>
            <Textarea {...pagesForm.register('footer.description')} rows={3} className="resize-none focus-visible:ring-primary" placeholder="Descrição" />
            <Input {...pagesForm.register('footer.rights_text')} placeholder="Texto de direitos" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('footer.credits_text')} placeholder="Texto de créditos" className="focus-visible:ring-primary" />
          </div>
        )}

        {pagesSection === 'service_detail' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Página Detalhe de Serviço</h3>
            <Input {...pagesForm.register('service_detail.breadcrumb_home')} placeholder="Breadcrumb início" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.breadcrumb_services')} placeholder="Breadcrumb serviços" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.loading_text')} placeholder="Texto de carregamento" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.not_found_title')} placeholder="Título não encontrado" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.not_found_subtitle')} placeholder="Subtítulo não encontrado" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.not_found_button')} placeholder="Botão não encontrado" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.hero_badge')} placeholder="Badge hero" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.hero_cta_text')} placeholder="Texto do botão hero" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.benefits_title')} placeholder="Título benefícios" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.sidebar_title')} placeholder="Título da sidebar" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.sidebar_text_prefix')} placeholder="Prefixo do texto da sidebar" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.sidebar_button')} placeholder="Botão da sidebar" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.back_to_services')} placeholder="Texto voltar" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.related_badge')} placeholder="Badge relacionados" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('service_detail.related_title')} placeholder="Título relacionados" className="focus-visible:ring-primary" />
          </div>
        )}

        {pagesSection === 'blog_post' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Página Post do Blog</h3>
            <Input {...pagesForm.register('blog_post.loading_text')} placeholder="Texto de carregamento" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog_post.not_found_title')} placeholder="Título não encontrado" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog_post.back_to_blog')} placeholder="Texto voltar" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog_post.related_title')} placeholder="Título relacionados" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('blog_post.related_cta')} placeholder="CTA relacionados" className="focus-visible:ring-primary" />
          </div>
        )}

        {pagesSection === 'labels' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Labels Globais</h3>
            <Input {...pagesForm.register('labels.service_card_cta')} placeholder="CTA do card de serviço" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('labels.blog_card_cta')} placeholder="CTA do card de blog" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('labels.before_after_empty')} placeholder="Texto vazio da galeria" className="focus-visible:ring-primary" />
            <Input {...pagesForm.register('labels.testimonials_empty')} placeholder="Texto vazio de depoimentos" className="focus-visible:ring-primary" />
          </div>
        )}
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-24 space-y-5">
          <h3 className="text-lg font-bold text-secondary border-b pb-3">Resumo da Seção</h3>

          <div className="space-y-3 text-sm">
            {pagesSection === 'home' && (
              <>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Título Jornada</p>
                  <p className="font-semibold text-foreground line-clamp-1">{pagesForm.watch('home.journey.title') || '—'}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Passos</p>
                  <p className="text-foreground">{(pagesForm.watch('home.journey.steps') || []).length} passos cadastrados</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Imagens Sobre</p>
                  <p className="text-foreground">{(pagesForm.watch('home.about.images') || []).length} imagens</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {(pagesForm.watch('home.about.images') || []).map((img, i) => {
                      const src = typeof img === 'string' ? img : img?.url;
                      return src ? <img key={i} src={src} alt="" className="w-10 h-10 rounded object-cover border border-border" /> : null;
                    })}
                  </div>
                </div>
              </>
            )}
            {pagesSection === 'servicos' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Título</p>
                <p className="font-semibold text-foreground line-clamp-2">{pagesForm.watch('servicos.header_title') || '—'}</p>
              </div>
            )}
            {pagesSection === 'blog' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Título</p>
                <p className="font-semibold text-foreground line-clamp-2">{pagesForm.watch('blog.header_title') || '—'}</p>
              </div>
            )}
            {pagesSection === 'contato' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Título</p>
                <p className="font-semibold text-foreground line-clamp-2">{pagesForm.watch('contato.header_title') || '—'}</p>
              </div>
            )}
            {pagesSection === 'resultados' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Título</p>
                <p className="font-semibold text-foreground line-clamp-2">{pagesForm.watch('resultados.header_title') || '—'}</p>
              </div>
            )}
            {pagesSection === 'footer' && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Descrição</p>
                <p className="text-foreground text-xs line-clamp-3">{pagesForm.watch('footer.description') || '—'}</p>
              </div>
            )}

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-xs font-bold text-primary uppercase mb-1">Secções configuradas</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {PAGES_CONFIG_KEYS.map((key) => (
                  <span key={key} className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${pagesConfig[key]?.id ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={pagesSaving}
            className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold uppercase tracking-wide"
          >
            {pagesSaving ? 'Salvando...' : <><CheckCircle className="w-4 h-4 mr-2" /> Salvar Configurações</>}
          </Button>

          {pagesConfig[pagesSection]?.id && (
            <div className="pt-2 border-t border-border">
              <TranslationFields
                tabela="pages_config"
                registroId={pagesConfig[pagesSection]?.id}
                originalData={pagesConfig[pagesSection]}
                fields={PAGES_TRANSLATION_FIELDS[pagesSection] || []}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  </div>
);

export default PagesTab;
