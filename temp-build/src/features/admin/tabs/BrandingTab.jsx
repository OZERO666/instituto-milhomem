import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const BrandingTab = ({ contactForm, contactConfig, onContactSubmit, isLoading }) => {
  const { formState: { isSubmitting } } = contactForm;
  if (isLoading) return <TabLoader rows={4} card />;
  return (
  <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-2xl">
    <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Branding</h2>
    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-5">
      <div>
        <Label className="font-bold">Logo do Site</Label>
        <Input {...contactForm.register('logo_url')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
        <Input id="logo_url_file" type="file" accept="image/*" className="mt-2 bg-white" />
        {contactConfig?.logo_url && (
          <img
            src={contactConfig.logo_url}
            alt="Preview Logo"
            className="mt-3 h-16 object-contain rounded-xl border border-border"
          />
        )}
      </div>
      <div>
        <Label className="font-bold">Favicon</Label>
        <Input {...contactForm.register('favicon_url')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
        <Input id="favicon_url_file" type="file" accept="image/*" className="mt-2 bg-white" />
        {contactConfig?.favicon_url && (
          <img
            src={contactConfig.favicon_url}
            alt="Preview Favicon"
            className="mt-3 h-12 w-12 object-contain rounded-xl border border-border"
          />
        )}
      </div>
      <div>
        <Label className="font-bold">Imagem de Capa da Página Sobre</Label>
        <Input {...contactForm.register('sobre_hero_image')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
        <Input id="branding_sobre_hero_image_file" type="file" accept="image/*" className="mt-2 bg-white" />
        {contactConfig?.sobre_hero_image && (
          <img
            src={contactConfig.sobre_hero_image}
            alt="Preview Sobre Hero"
            className="mt-3 w-full h-32 object-cover rounded-xl border border-border"
          />
        )}
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
