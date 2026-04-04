import React from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import AdminSectionSwitch from '@/features/admin/components/AdminSectionSwitch.jsx';
import { PAGES_SECTION_OPTIONS } from '@/features/admin/constants/navigation.js';

const PAGES_CONFIG_KEYS = ['home', 'servicos', 'blog', 'contato', 'resultados', 'footer', 'service_detail', 'blog_post', 'labels'];

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
              <Input {...pagesForm.register('home.about.badge')} placeholder="Badge" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.about.title')} placeholder="Título linha 1" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.about.highlight')} placeholder="Título destaque" className="focus-visible:ring-primary" />
              <Textarea {...pagesForm.register('home.about.paragraph_1')} rows={2} className="resize-none focus-visible:ring-primary" placeholder="Parágrafo 1" />
              <Textarea {...pagesForm.register('home.about.paragraph_2')} rows={2} className="resize-none focus-visible:ring-primary" placeholder="Parágrafo 2" />
              <Input {...pagesForm.register('home.about.cta_text')} placeholder="Texto do botão" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.about.card_text')} placeholder="Texto do card (use \n para quebra de linha)" className="focus-visible:ring-primary" />
              <Input {...pagesForm.register('home.about.card_button_text')} placeholder="Texto do botão do card" className="focus-visible:ring-primary" />

              {(pagesForm.watch('home.about.images') || []).map((image, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    value={image || ''}
                    onChange={(e) => {
                      const current = [...(pagesForm.getValues('home.about.images') || [])];
                      current[idx] = e.target.value;
                      pagesForm.setValue('home.about.images', current);
                    }}
                    placeholder={`Imagem ${idx + 1}`}
                    className="focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => {
                      const current = [...(pagesForm.getValues('home.about.images') || [])];
                      current.splice(idx, 1);
                      pagesForm.setValue('home.about.images', current);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
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
          <h3 className="text-lg font-bold text-secondary border-b pb-3">Resumo</h3>
          <div className="space-y-3 text-sm">
            {PAGES_CONFIG_KEYS.map((key) => (
              <div key={key} className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground">{key}</p>
                <p className="font-semibold text-foreground break-all">
                  {pagesConfig[key]?.id ? 'Configurado' : 'Usando padrão'}
                </p>
              </div>
            ))}
          </div>

          <Button
            type="submit"
            disabled={pagesSaving}
            className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold uppercase tracking-wide"
          >
            {pagesSaving ? 'Salvando...' : <><CheckCircle className="w-4 h-4 mr-2" /> Salvar Configurações</>}
          </Button>
        </div>
      </div>
    </form>
  </div>
);

export default PagesTab;
