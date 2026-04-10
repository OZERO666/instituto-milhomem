import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import MediaSelectorField from '@/features/admin/components/MediaSelectorField.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const SaveStatus = ({ status }) => {
  if (!status) return null;
  const config = {
    saving: { icon: Loader2, text: 'Salvando...', cls: 'text-muted-foreground', spin: true },
    saved: { icon: CheckCircle2, text: 'Salvo com sucesso!', cls: 'text-green-600', spin: false },
    error: { icon: AlertCircle, text: 'Erro ao salvar.', cls: 'text-destructive', spin: false },
  }[status];

  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 text-sm font-medium ${config.cls}`}>
      <Icon className={`w-4 h-4 ${config.spin ? 'animate-spin' : ''}`} />
      {config.text}
    </div>
  );
};

const BrandingTab = ({
  contactForm,
  contactConfig,
  onContactSubmit,
  isLoading,
  settingsForm,
  saveStatus,
  onSettingsSubmit,
}) => {
  const { formState: { isSubmitting }, setValue, watch } = contactForm;
  const {
    register,
    handleSubmit,
    watch: watchSettings,
    setValue: setSettingsValue,
    formState: { isDirty: isSettingsDirty },
  } = settingsForm;
  const showDecorationsMobile = watchSettings('show_decorations_mobile');

  if (isLoading) return <TabLoader rows={4} card />;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
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

      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-secondary">Responsividade</h3>
        </div>

        <form onSubmit={handleSubmit(onSettingsSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4 rounded-xl border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Container</p>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Largura máxima do conteúdo</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={960} max={1680} step={20} {...register('container_max_width', { min: 960, max: 1680 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('container_max_width') || 1280}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Padding horizontal mobile</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={8} max={48} step={2} {...register('container_padding_mobile', { min: 8, max: 48 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('container_padding_mobile') || 16}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Padding horizontal tablet</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={12} max={64} step={2} {...register('container_padding_tablet', { min: 12, max: 64 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('container_padding_tablet') || 24}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Padding horizontal desktop</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={16} max={80} step={2} {...register('container_padding_desktop', { min: 16, max: 80 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('container_padding_desktop') || 32}px</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seções e tipografia</p>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Espaçamento vertical mobile</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={24} max={120} step={4} {...register('section_padding_mobile', { min: 24, max: 120 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('section_padding_mobile') || 48}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Espaçamento vertical tablet</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={32} max={140} step={4} {...register('section_padding_tablet', { min: 32, max: 140 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('section_padding_tablet') || 64}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Espaçamento vertical desktop</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={40} max={180} step={4} {...register('section_padding_desktop', { min: 40, max: 180 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('section_padding_desktop') || 80}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Escala tipográfica mobile</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={85} max={120} step={1} {...register('mobile_type_scale', { min: 85, max: 120 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('mobile_type_scale') || 100}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Hero mínimo mobile</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={420} max={900} step={10} {...register('hero_min_height_mobile', { min: 420, max: 900 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('hero_min_height_mobile') || 560}px</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold">Hero alvo desktop</Label>
                <div className="flex items-center gap-3">
                  <input type="range" min={640} max={1200} step={10} {...register('hero_min_height_desktop', { min: 640, max: 1200 })} className="flex-1 accent-primary" />
                  <span className="w-16 text-center text-xs font-bold tabular-nums bg-muted rounded-lg px-2 py-1">{watchSettings('hero_min_height_desktop') || 980}px</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between gap-6 rounded-xl border border-border p-5">
            <div className="space-y-1 flex-1">
              <Label className="text-sm font-semibold">
                Exibir elementos decorativos no mobile
              </Label>
              <p className="text-[12px] text-muted-foreground">
                Controla brilhos, linhas e formas ornamentais em telas pequenas para reduzir ruído visual e melhorar foco no conteúdo.
              </p>
              {showDecorationsMobile === 'false' ? (
                <p className="text-[12px] font-semibold text-amber-600 mt-2">
                  Elementos decorativos ocultos no mobile.
                </p>
              ) : (
                <p className="text-[12px] font-semibold text-green-600 mt-2">
                  ✓ Elementos decorativos visíveis no mobile.
                </p>
              )}
            </div>
            <Switch
              checked={showDecorationsMobile !== 'false'}
              onCheckedChange={(checked) =>
                setSettingsValue('show_decorations_mobile', checked ? 'true' : 'false', { shouldDirty: true })
              }
            />
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              type="submit"
              disabled={!isSettingsDirty || saveStatus === 'saving'}
              className="bg-primary text-secondary hover:bg-primary/90 font-bold uppercase tracking-wide px-8"
            >
              {saveStatus === 'saving' ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</>
              ) : (
                'Salvar Responsividade'
              )}
            </Button>
            <SaveStatus status={saveStatus} />
            {saveStatus === 'saved' && (
              <p className="text-[11px] text-muted-foreground">
                Recarregue a página do site para os visitantes verem as mudanças.
              </p>
            )}
          </div>
        
            {/* ── Logo Sizes (Responsive) ───────────────────────── */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <ImageIcon className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary">
                  Tamanho da Logo (Responsivo)
                </h3>
              </div>

              {/* HEADER LOGO */}
              <div className="space-y-4 rounded-xl border border-border p-4 bg-muted/20">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Header</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Mobile (32-64px)</Label>
                    <div className="flex gap-2">
                      <input type="range" min={32} max={64} step={2} {...register('logo_size_header_mobile', {min:32,max:64})} className="flex-1 accent-primary" />
                      <span className="w-12 text-xs font-bold text-center bg-white rounded px-2 py-1">{watchSettings('logo_size_header_mobile')||40}px</span>
                    </div>
                    <div className="h-12 bg-secondary rounded border border-primary/20 flex items-center justify-center p-1">
                      <div style={{height:`${watchSettings('logo_size_header_mobile')||40}px`}} className="bg-primary/30 rounded flex items-center justify-center text-[11px] font-bold text-white">M</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Tablet (40-72px)</Label>
                    <div className="flex gap-2">
                      <input type="range" min={40} max={72} step={2} {...register('logo_size_header_tablet',{min:40,max:72})} className="flex-1 accent-primary" />
                      <span className="w-12 text-xs font-bold text-center bg-white rounded px-2 py-1">{watchSettings('logo_size_header_tablet')||48}px</span>
                    </div>
                    <div className="h-12 bg-secondary rounded border border-primary/20 flex items-center justify-center p-1">
                      <div style={{height:`${watchSettings('logo_size_header_tablet')||48}px`}} className="bg-primary/30 rounded flex items-center justify-center text-[11px] font-bold text-white">T</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desktop (48-120px)</Label>
                    <div className="flex gap-2">
                      <input type="range" min={48} max={120} step={4} {...register('logo_size_header',{min:48,max:120})} className="flex-1 accent-primary" />
                      <span className="w-12 text-xs font-bold text-center bg-white rounded px-2 py-1">{watchSettings('logo_size_header')||56}px</span>
                    </div>
                    <div className="h-12 bg-secondary rounded border border-primary/20 flex items-center justify-center p-1">
                      <div style={{height:`${watchSettings('logo_size_header')||56}px`}} className="bg-primary/30 rounded flex items-center justify-center text-[11px] font-bold text-white">D</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER LOGO */}
              <div className="space-y-4 rounded-xl border border-border p-4 bg-muted/20">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary">Footer</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Mobile (24-56px)</Label>
                    <div className="flex gap-2">
                      <input type="range" min={24} max={56} step={2} {...register('logo_size_footer_mobile',{min:24,max:56})} className="flex-1 accent-primary" />
                      <span className="w-12 text-xs font-bold text-center bg-white rounded px-2 py-1">{watchSettings('logo_size_footer_mobile')||36}px</span>
                    </div>
                    <div className="h-12 bg-secondary rounded border border-primary/20 flex items-center justify-center p-1">
                      <div style={{height:`${watchSettings('logo_size_footer_mobile')||36}px`}} className="bg-primary/30 rounded flex items-center justify-center text-[11px] font-bold text-white">M</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Tablet (32-64px)</Label>
                    <div className="flex gap-2">
                      <input type="range" min={32} max={64} step={2} {...register('logo_size_footer_tablet',{min:32,max:64})} className="flex-1 accent-primary" />
                      <span className="w-12 text-xs font-bold text-center bg-white rounded px-2 py-1">{watchSettings('logo_size_footer_tablet')||40}px</span>
                    </div>
                    <div className="h-12 bg-secondary rounded border border-primary/20 flex items-center justify-center p-1">
                      <div style={{height:`${watchSettings('logo_size_footer_tablet')||40}px`}} className="bg-primary/30 rounded flex items-center justify-center text-[11px] font-bold text-white">T</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold">Desktop (40-120px)</Label>
                    <div className="flex gap-2">
                      <input type="range" min={40} max={120} step={4} {...register('logo_size_footer',{min:40,max:120})} className="flex-1 accent-primary" />
                      <span className="w-12 text-xs font-bold text-center bg-white rounded px-2 py-1">{watchSettings('logo_size_footer')||48}px</span>
                    </div>
                    <div className="h-12 bg-secondary rounded border border-primary/20 flex items-center justify-center p-1">
                      <div style={{height:`${watchSettings('logo_size_footer')||48}px`}} className="bg-primary/30 rounded flex items-center justify-center text-[11px] font-bold text-white">D</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
</form>
      </div>
    </div>
  );
};

export default BrandingTab;
