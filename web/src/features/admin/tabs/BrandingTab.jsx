import React, { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';
import { uploadFile } from '@/features/admin/utils/adminApi.js';

const BrandingTab = ({ contactForm, contactConfig, onContactSubmit, isLoading }) => {
  const { formState: { isSubmitting }, setValue, watch } = contactForm;
  const [uploadingLogo, setUploadingLogo]       = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const logoFileRef    = useRef(null);
  const faviconFileRef = useRef(null);

  const currentLogoUrl    = watch('logo_url');
  const currentFaviconUrl = watch('favicon_url');

  const handleUpload = async (file, field, folder, setUploading) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, folder);
      setValue(field, url, { shouldDirty: true });
      toast.success('Upload realizado com sucesso!');
    } catch (err) {
      toast.error(err.message || 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <TabLoader rows={4} card />;
  return (
  <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-2xl">
    <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Branding</h2>
    <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-5">

      {/* Logo */}
      <div>
        <Label className="font-bold">Logo do Site</Label>
        <Input {...contactForm.register('logo_url')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
        <div className="flex items-center gap-2 mt-2">
          <input
            ref={logoFileRef}
            type="file"
            accept="image/*,.svg"
            className="hidden"
            onChange={e => handleUpload(e.target.files[0], 'logo_url', 'branding', setUploadingLogo)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadingLogo}
            onClick={() => logoFileRef.current?.click()}
            className="gap-2"
          >
            {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingLogo ? 'Enviando…' : 'Upload para Cloudinary'}
          </Button>
        </div>
        {(currentLogoUrl || contactConfig?.logo_url) && (
          <img
            src={currentLogoUrl || contactConfig.logo_url}
            alt="Preview Logo"
            className="mt-3 h-16 object-contain rounded-xl border border-border"
          />
        )}
      </div>

      {/* Favicon */}
      <div>
        <Label className="font-bold">Favicon</Label>
        <p className="text-xs text-muted-foreground mt-0.5 mb-1">Suporta SVG, PNG, ICO. Recomendado: SVG ou PNG 512×512.</p>
        <Input {...contactForm.register('favicon_url')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
        <div className="flex items-center gap-2 mt-2">
          <input
            ref={faviconFileRef}
            type="file"
            accept="image/*,.svg,.ico"
            className="hidden"
            onChange={e => handleUpload(e.target.files[0], 'favicon_url', 'branding', setUploadingFavicon)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploadingFavicon}
            onClick={() => faviconFileRef.current?.click()}
            className="gap-2"
          >
            {uploadingFavicon ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploadingFavicon ? 'Enviando…' : 'Upload para Cloudinary'}
          </Button>
        </div>
        {(currentFaviconUrl || contactConfig?.favicon_url) && (
          <img
            src={currentFaviconUrl || contactConfig.favicon_url}
            alt="Preview Favicon"
            className="mt-3 h-12 w-12 object-contain rounded-xl border border-border bg-muted p-1"
          />
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || uploadingLogo || uploadingFavicon} className="mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-white">
        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Salvar Branding
      </Button>
    </form>
  </div>
  );
};

export default BrandingTab;
