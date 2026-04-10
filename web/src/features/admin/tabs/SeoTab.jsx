import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MediaSelectorField from '@/features/admin/components/MediaSelectorField.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const FieldError = ({ error, fallbackMessage }) =>
  error ? <p className="text-xs text-destructive mt-1">{error.message || fallbackMessage}</p> : null;

const SeoTab = ({
  seoList,
  seoEditing,
  seoForm,
  isLoading,
  handleEditSeo,
  handleCancelSeo,
  onSeoSubmit,
  onRegenerateSitemap,
  isRegeneratingSitemap,
  sitemapStatus,
}) => {
  const { t, i18n } = useTranslation();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = seoForm;
  const titleLen = watch('meta_title')?.length || 0;
  const descLen  = watch('meta_description')?.length || 0;
  const ogImage  = watch('og_image');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">{t('admin.seo.title')}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t('admin.seo.description')}
        </p>
      </div>

      <div className="bg-card border border-border/60 rounded-xl p-5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">{t('admin.seo.sitemap_title')}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {t('admin.seo.sitemap_description')}
            </p>
          </div>
          <button
            type="button"
            onClick={onRegenerateSitemap}
            disabled={isRegeneratingSitemap}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-accent transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isRegeneratingSitemap && <Loader2 className="w-4 h-4 animate-spin" />}
            {isRegeneratingSitemap ? t('admin.seo.regenerating') : t('admin.seo.regenerate')}
          </button>
        </div>
        {sitemapStatus?.generated_at && (
          <p className="text-xs text-muted-foreground">
            {t('admin.seo.last_generated')}: {new Date(sitemapStatus.generated_at).toLocaleString(i18n.resolvedLanguage || 'pt-BR')} · {t('admin.seo.urls')}: {sitemapStatus?.counts?.total || 0}
          </p>
        )}
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
                  {t('admin.common.edit')}
                </button>
              </div>
              <p className="text-sm font-semibold text-foreground truncate">{s.meta_title}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.meta_description}</p>
            </div>
          ))}
          {seoList.length === 0 && (
            <p className="text-muted-foreground text-center py-8 col-span-2">
              {t('admin.seo.empty')}
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
              {t('admin.seo.editing')}: <span className="text-primary">{seoEditing.page_name}</span>
            </h3>
            <button
              type="button"
              onClick={handleCancelSeo}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {t('admin.common.back')}
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t('admin.seo.page_title')} *{' '}
              <span className="ml-2 font-normal text-muted-foreground normal-case tracking-normal">{t('admin.seo.page_title_hint')}</span>
            </label>
            <input
              type="text"
              {...register('meta_title', {
                required: t('admin.seo.page_title_required'),
                maxLength: { value: 60, message: t('admin.seo.page_title_max') },
              })}
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-between items-center mt-1">
              <FieldError error={errors.meta_title} fallbackMessage={t('admin.common.required_field')} />
              <p className="text-[10px] text-muted-foreground ml-auto">{titleLen}/60</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t('admin.seo.description_label')} *{' '}
              <span className="ml-2 font-normal text-muted-foreground normal-case tracking-normal">{t('admin.seo.description_hint')}</span>
            </label>
            <textarea
              rows={3}
              {...register('meta_description', {
                required: t('admin.seo.description_required'),
                maxLength: { value: 160, message: t('admin.seo.description_max') },
              })}
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex justify-between items-center mt-1">
              <FieldError error={errors.meta_description} fallbackMessage={t('admin.common.required_field')} />
              <p className="text-[10px] text-muted-foreground ml-auto">{descLen}/160</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-foreground">{t('admin.seo.keywords')}</label>
            <input
              type="text"
              {...register('keywords')}
              placeholder={t('admin.seo.keywords_placeholder')}
              className="mt-2 w-full bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <input type="hidden" {...register('og_image')} />
            <MediaSelectorField
              label={t('admin.seo.og_image')}
              value={ogImage || ''}
              onChange={(nextValue) => seoForm.setValue('og_image', nextValue, { shouldDirty: true })}
              folder="branding"
              libraryFolders={['all', 'branding', 'artigos', 'misc']}
              previewClassName="h-24"
              helperText={t('admin.seo.og_image_helper')}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest rounded-xl hover:bg-accent transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? t('admin.seo.saving') : t('admin.seo.save')}
          </button>
        </form>
      )}
    </div>
  );
};

export default SeoTab;
