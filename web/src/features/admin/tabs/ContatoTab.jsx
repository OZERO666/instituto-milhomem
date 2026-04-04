import React, { useState } from 'react';
import { Loader2, MapPin, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';
import TranslationFields from '@/features/admin/components/TranslationFields.jsx';
import api from '@/lib/apiServerClient.js';

const ZOOM_OPTIONS = [
  { value: '13', label: '13 — Cidade' },
  { value: '14', label: '14 — Região' },
  { value: '15', label: '15 — Bairro' },
  { value: '16', label: '16 — Rua' },
  { value: '17', label: '17 — Edifício' },
  { value: '18', label: '18 — Detalhe' },
];

const ContatoTab = ({ contactForm, contactConfig, isLoading, onContactSubmit }) => {
  const { register, handleSubmit, watch, setValue, formState: { isSubmitting } } = contactForm;
  const [extracted, setExtracted] = useState(false);
  const [extractError, setExtractError] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const mapsUrl = watch('maps_url') || '';
  const lat     = watch('latitude');
  const lng     = watch('longitude');
  const zoom      = watch('zoom') || '17';
  const nomeLocal  = watch('nome_local') || '';

  const iframeQuery = lat && lng
    ? `${lat},${lng}`
    : nomeLocal
      ? encodeURIComponent(nomeLocal)
      : null;
  const iframeSrc = iframeQuery
    ? `https://maps.google.com/maps?q=${iframeQuery}&z=${zoom}&output=embed`
    : null;

  async function handleExtract() {
    if (!mapsUrl) return;
    setIsExtracting(true);
    setExtractError(false);
    try {
      const res = await api.fetch(`/utils/resolve-maps?url=${encodeURIComponent(mapsUrl)}`);
      const data = await res.json();
      if (data.lat) {
        setValue('latitude',  String(data.lat),  { shouldDirty: true });
        setValue('longitude', String(data.lng),  { shouldDirty: true });
        if (data.zoom) setValue('zoom', String(data.zoom), { shouldDirty: true });
        setExtracted(true);
        setTimeout(() => setExtracted(false), 3000);
      } else {
        setExtractError(true);
        setTimeout(() => setExtractError(false), 4000);
      }
    } catch {
      setExtractError(true);
      setTimeout(() => setExtractError(false), 4000);
    } finally {
      setIsExtracting(false);
    }
  }

  if (isLoading) return <TabLoader rows={5} card />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Configurações de Contato</h2>
      <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-5">

        <div>
          <Label className="font-bold">Telefone (exibição)</Label>
          <Input {...register('telefone')} placeholder="(62) 98107-0937" className="mt-2 focus-visible:ring-primary" />
          <p className="text-xs text-muted-foreground mt-1">Número formatado exibido no rodapé e na página de contato.</p>
        </div>

        <div>
          <Label className="font-bold">WhatsApp (número para link)</Label>
          <Input {...register('whatsapp')} placeholder="5562981070937" className="mt-2 focus-visible:ring-primary" />
          <p className="text-xs text-muted-foreground mt-1">Apenas dígitos com DDI — ex: 5562981070937</p>
        </div>

        <div>
          <Label className="font-bold">E-mail</Label>
          <Input {...register('email')} className="mt-2 focus-visible:ring-primary" />
        </div>

        <div>
          <Label className="font-bold">Instagram</Label>
          <Input {...register('instagram')} placeholder="https://www.instagram.com/seu-perfil" className="mt-2 focus-visible:ring-primary" />
        </div>

        <div>
          <Label className="font-bold">Facebook</Label>
          <Input {...register('facebook')} placeholder="https://www.facebook.com/seu-perfil" className="mt-2 focus-visible:ring-primary" />
        </div>

        {/* ── LOCALIZAÇÃO NO MAPA ── */}
        <div className="border border-border rounded-xl p-5 space-y-4 bg-muted/30">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="font-bold text-secondary text-base">Localização no Mapa</span>
          </div>

          {/* Nome do local no Google Maps */}
          <div>
            <Label className="font-bold text-sm">Nome do Local no Google Maps</Label>
            <Input
              {...register('nome_local')}
              placeholder="Ex: Dr Pablo Milhomem"
              className="mt-2 focus-visible:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Nome exato como cadastrado no Google Meu Negócio. O mapa buscará pelo nome automaticamente.
            </p>
          </div>

          {/* Link do Google Maps */}
          <div>
            <Label className="font-bold text-sm">Link do Google Maps</Label>
            <div className="flex gap-2 mt-2">
              <Input
                {...register('maps_url')}
                placeholder="Cole aqui o link de compartilhamento do Google Maps"
                className="focus-visible:ring-primary flex-1"
              />
              <Button
                type="button"
                onClick={handleExtract}
                disabled={isExtracting || !mapsUrl}
                variant="outline"
                className="shrink-0 border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50"
              >
                {isExtracting
                  ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Extraindo...</>
                  : extracted
                    ? <><CheckCircle2 className="w-4 h-4 mr-1" /> Extraído!</>
                    : 'Extrair'}
              </Button>
            </div>
            {extractError && (
              <p className="text-xs text-destructive mt-1">⚠️ Não foi possível extrair coordenadas deste link. Tente copiar o link completo do Google Maps (botão Compartilhar).</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              No Google Maps: clique em <strong>Compartilhar → Copiar link</strong> e cole aqui. Clique em <strong>Extrair</strong> para capturar as coordenadas automaticamente.
            </p>
          </div>

          {/* Zoom */}
          <div>
            <Label className="font-bold text-sm">Nível de Zoom</Label>
            <select
              {...register('zoom')}
              className="mt-2 w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ZOOM_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Coordenadas (somente leitura visual) */}
          {lat && lng && (
            <div className="flex gap-3 text-xs text-muted-foreground bg-background border border-border rounded-lg px-4 py-3">
              <span>Lat: <strong className="text-secondary">{lat}</strong></span>
              <span>·</span>
              <span>Lng: <strong className="text-secondary">{lng}</strong></span>
              <span>·</span>
              <span>Zoom: <strong className="text-secondary">{zoom}</strong></span>
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1 text-primary hover:underline"
              >
                Ver no Maps <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Hidden inputs para os campos lat/lng que a API precisa */}
          <input type="hidden" {...register('latitude')} />
          <input type="hidden" {...register('longitude')} />

          {/* Preview do mapa */}
          <div>
            <Label className="font-bold text-sm mb-2 block">Preview do Mapa</Label>
            {iframeSrc ? (
              <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                <iframe
                  src={iframeSrc}
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Preview do mapa"
                />
              </div>
            ) : (
              <div className="h-40 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-2">
                <MapPin className="w-8 h-8 opacity-30" />
                <p className="text-sm">Cole o link e clique em <strong>Extrair</strong> para visualizar o mapa</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label className="font-bold">Endereço</Label>
          <Textarea {...register('endereco')} rows={2} className="mt-2 resize-none focus-visible:ring-primary" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-bold">Dias de Funcionamento</Label>
            <Input {...register('dias_funcionamento')} placeholder="Segunda a Sexta" className="mt-2 focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold">Horário</Label>
            <Input {...register('horario')} placeholder="8h às 17h" className="mt-2 focus-visible:ring-primary" />
          </div>
        </div>

        <div>
          <Label className="font-bold">Mensagem Header WhatsApp</Label>
          <Textarea {...register('mensagem_header')} rows={3} className="mt-2 resize-none focus-visible:ring-primary" />
        </div>

        <div>
          <Label className="font-bold">Mensagem Padrão WhatsApp</Label>
          <Textarea {...register('mensagem_whatsapp')} rows={3} className="mt-2 resize-none focus-visible:ring-primary" />
        </div>

        <Button type="submit" disabled={isSubmitting} className="mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-white">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Configurações
        </Button>
      </form>

      <TranslationFields
        tabela="contato_config"
        registroId={contactConfig?.id}
        fields={[
          { name: 'dias_funcionamento', label: 'Dias de Funcionamento', type: 'input' },
          { name: 'horario',            label: 'Horário',               type: 'input' },
        ]}
        originalData={contactConfig}
      />
    </div>
  );
};

export default ContatoTab;
