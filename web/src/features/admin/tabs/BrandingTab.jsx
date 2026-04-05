import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import MediaSelectorField from '@/features/admin/components/MediaSelectorField.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const BrandingTab = ({ contactForm, contactConfig, onContactSubmit, isLoading }) => {
  const { formState: { isSubmitting }, setValue, watch } = contactForm;

  if (isLoading) return <TabLoader rows={4} card />;
  return (
  <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-2xl">
    <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Branding</h2>
    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-5">

      {/* Logo */}
      <div>
        <input type="hidden" {...contactForm.register('logo_url')} />
        <MediaSelectorField
          label="Logo do Site"
          value={watch('logo_url') || contactConfig?.logo_url || ''}
          onChange={(nextValue) => setValue('logo_url', nextValue, { shouldDirty: true })}
          folder="branding"
          libraryFolders={['all', 'branding', 'misc']}
          previewClassName="h-24"
          helperText="Prefira SVG ou PNG. O arquivo pode ser reaproveitado da biblioteca ou enviado agora para o Cloudinary."
        />
      </div>

      {/* Favicon */}
      <div>
        <input type="hidden" {...contactForm.register('favicon_url')} />
        <MediaSelectorField
          label="Favicon"
          value={watch('favicon_url') || contactConfig?.favicon_url || ''}
          onChange={(nextValue) => setValue('favicon_url', nextValue, { shouldDirty: true })}
          folder="branding"
          libraryFolders={['all', 'branding', 'misc']}
          previewClassName="h-20"
          helperText="Suporta SVG, PNG ou ICO. Recomendado: SVG ou PNG 512x512."
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-white">
        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Salvar Branding
      </Button>
    </form>
  </div>
  );
};

export default BrandingTab;
