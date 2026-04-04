import React from 'react';
import { Loader2 } from 'lucide-react';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const FieldError = ({ error }) =>
  error ? <p className="text-xs text-destructive mt-1">{error.message || 'Campo obrigatório'}</p> : null;

const SeoTab = ({ seoList, seoEditing, seoForm, isLoading, handleEditSeo, handleCancelSeo, onSeoSubmit }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = seoForm;
  const titleLen = watch('meta_title')?.length || 0;
  const descLen  = watch('meta_description')?.length || 0;
  const ogImage  = watch('og_image');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Configurações de SEO</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edite o título, descrição e palavras-chave de cada página do site.
        </p>
      </div>
      {isLoading ? (
        <TabLoader rows={4} />
      ) : !seoEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {seoList.map((s) => (
            <div
              key={s.id}
              className="bg-card border border-border/60 rounded-xl p-5 hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {s.page_name}
                </span>
                <button
                  onClick={() => handleEditSeo(s)}
                  className="text-xs font-bold text-primary hover:text-primary/70 uppercase tracking-wider transition-colors"
                >
                  Editar
                </button>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{s.meta_title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.meta_description}</p>
            </div>
          ))}
          {seoList.length === 0 && (
            <p className="text-muted-foreground text-center py-8 col-span-2">
              Nenhuma página SEO configurada.
            </p>
          )}
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSeoSubmit)}
          className="bg-card border border-border/60 rounded-2xl p-8 space-y-5 max-w-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-foreground uppercase tracking-wide">
              Editando: <span className="text-primary">{seoEditing.page_name}</span>
            </h3>
            <button
              type="button"
              onClick={handleCancelSeo}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Título da Página *{' '}
              <span className="ml-2 font-normal text-muted-foreground normal-case tracking-normal">(max 60 caracteres)</span>
            </label>
            <input
              type="text"
              {...register('meta_title', {
                required: 'Informe o título',
                maxLength: { value: 60, message: 'Máximo 60 caracteres' },
              })}
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-between items-center mt-1">
              <FieldError error={errors.meta_title} />
              <p className="text-[10px] text-muted-foreground ml-auto">{titleLen}/60</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              Descrição *{' '}
              <span className="ml-2 font-normal text-muted-foreground normal-case tracking-normal">(max 160 caracteres)</span>
            </label>
            <textarea
              rows={3}
              {...register('meta_description', {
                required: 'Informe a descrição',
                maxLength: { value: 160, message: 'Máximo 160 caracteres' },
              })}
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <FieldError error={errors.meta_description} />
              <p className="text-[10px] text-muted-foreground ml-auto">{descLen}/160</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">Palavras-chave</label>
            <input
              type="text"
              {...register('keywords')}
              placeholder="palavra1, palavra2, palavra3"
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">Imagem OG (Open Graph)</label>
            <input
              type="url"
              {...register('og_image')}
              placeholder="https://..."
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {ogImage && (
              <img src={ogImage} alt="Preview OG" className="mt-2 h-20 rounded-lg object-cover border border-border" />
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-accent transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? 'Salvando...' : 'Salvar Configurações de SEO'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SeoTab;
