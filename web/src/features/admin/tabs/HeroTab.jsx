import React from 'react';
import { Edit, Trash2, Plus, Star, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import MediaSelectorField from '@/features/admin/components/MediaSelectorField.jsx';
import TranslationFields from '@/features/admin/components/TranslationFields.jsx';

const HeroTab = ({
  heroForm, heroConfig, heroSaving, onHeroConfigSubmit,
  presetForm, heroPresets, editingPreset, setEditingPreset,
  onPresetSubmit, onActivatePreset, onDelete,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

    {/* Coluna esquerda: Config ativa + Presets */}
    <div className="lg:col-span-1 space-y-6">

      {/* Configuração ativa do Hero */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-bold mb-1 text-secondary">Conteúdo do Hero</h2>
        <p className="text-xs text-muted-foreground mb-5">Texto e botão exibidos na seção principal do site.</p>
        <form onSubmit={heroForm.handleSubmit(onHeroConfigSubmit)} className="space-y-4">
          <div>
            <Label className="font-bold">Badge (etiqueta topo)</Label>
            <Input {...heroForm.register('badge')} placeholder="Ex: Especialistas em Transplante" className="mt-2 focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold">Título Principal *</Label>
            <Textarea {...heroForm.register('titulo', { required: true })} rows={3} className="mt-2 resize-none focus-visible:ring-primary" placeholder="Ex: Recupere Sua Confiança com o Transplante Capilar Ideal" />
          </div>
          <div>
            <Label className="font-bold">Subtítulo</Label>
            <Textarea {...heroForm.register('subtitulo')} rows={3} className="mt-2 resize-none focus-visible:ring-primary" placeholder="Ex: Técnicas modernas, resultados naturais e atendimento humanizado." />
          </div>
          <div>
            <Label className="font-bold">Texto do Botão CTA</Label>
            <Input {...heroForm.register('cta_texto')} placeholder="Ex: Agende sua Consulta" className="mt-2 focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold">Link do Botão CTA</Label>
            <Input {...heroForm.register('cta_link')} placeholder="Ex: #contato ou /contato" className="mt-2 focus-visible:ring-primary" />
          </div>
          <div>
            <input type="hidden" {...heroForm.register('imagem_fundo')} />
            <MediaSelectorField
              label="Imagem de Fundo"
              value={heroForm.watch('imagem_fundo')}
              onChange={(nextValue) => heroForm.setValue('imagem_fundo', nextValue, { shouldDirty: true })}
              folder="misc"
              libraryFolders={['all', 'branding', 'misc']}
              previewClassName="h-36"
              helperText="Você pode colar uma URL, escolher um arquivo existente da biblioteca ou enviar uma nova imagem ao Cloudinary."
            />
          </div>
          <Button
            type="submit"
            disabled={heroSaving}
            className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold uppercase tracking-wide"
          >
            {heroSaving ? 'Salvando...' : <><CheckCircle className="w-4 h-4 mr-2" /> Salvar Hero</>}
          </Button>
        </form>

        <TranslationFields
          tabela="hero_config"
          registroId={heroConfig?.id}
          originalData={heroConfig}
          fields={[
            { name: 'badge',     label: 'Badge',     type: 'input' },
            { name: 'titulo',    label: 'Título',    type: 'textarea', rows: 3 },
            { name: 'subtitulo', label: 'Subtítulo', type: 'textarea', rows: 3 },
            { name: 'cta_texto', label: 'Texto CTA', type: 'input' },
          ]}
        />
      </div>

      {/* Gerenciar Presets */}
      <div className="bg-white rounded-xl shadow-sm border border-border p-6">
        <h2 className="text-xl font-bold mb-1 text-secondary">Presets de Texto</h2>
        <p className="text-xs text-muted-foreground mb-4">Salve variações para usar depois com 1 clique.</p>
        <form onSubmit={presetForm.handleSubmit(onPresetSubmit)} className="space-y-3 mb-5">
          <div>
            <Label className="font-bold text-xs">Nome do Preset</Label>
            <Input {...presetForm.register('nome', { required: true })} placeholder="Ex: Versão Verão 2026" className="mt-1 focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold text-xs">Título</Label>
            <Textarea {...presetForm.register('titulo', { required: true })} rows={2} className="mt-1 resize-none focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold text-xs">Subtítulo</Label>
            <Textarea {...presetForm.register('subtitulo')} rows={2} className="mt-1 resize-none focus-visible:ring-primary" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="font-bold text-xs">Texto CTA</Label>
              <Input {...presetForm.register('cta_texto')} className="mt-1 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold text-xs">Link CTA</Label>
              <Input {...presetForm.register('cta_link')} className="mt-1 focus-visible:ring-primary" />
            </div>
          </div>
          <div>
            <Label className="font-bold text-xs">Badge</Label>
            <Input {...presetForm.register('badge')} className="mt-1 focus-visible:ring-primary" />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90 text-xs font-bold uppercase">
              <Plus className="w-3 h-3 mr-1" /> {editingPreset ? 'Salvar Preset' : 'Criar Preset'}
            </Button>
            {editingPreset && (
              <Button type="button" variant="outline" onClick={() => { setEditingPreset(null); presetForm.reset(); }}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>

    {/* Coluna direita: Lista de Presets */}
    <div className="lg:col-span-2 space-y-4">
      <h2 className="text-2xl font-bold text-secondary">Presets Salvos</h2>
      {heroPresets.length === 0 && (
        <div className="bg-white rounded-xl border border-border p-10 text-center">
          <Star className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
          <p className="text-muted-foreground text-sm">Nenhum preset salvo ainda.</p>
          <p className="text-xs text-muted-foreground mt-1">Crie presets para alternar rapidamente o conteúdo do Hero.</p>
        </div>
      )}
      {heroPresets.map(preset => (
        <div
          key={preset.id}
          className="bg-white rounded-xl p-6 border border-border shadow-sm hover:border-primary/50 transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg text-secondary">{preset.nome}</h3>
              {preset.badge && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{preset.badge}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-secondary hover:text-white text-xs font-bold uppercase"
                onClick={() => onActivatePreset(preset)}
              >
                <CheckCircle className="w-3 h-3 mr-1" /> Usar
              </Button>
              <Button size="icon" variant="outline"
                onClick={() => { setEditingPreset(preset); presetForm.reset(preset); }}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="destructive"
                onClick={() => onDelete('hero-presets', preset.id, preset.nome)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {preset.titulo && (
            <p className="text-sm font-semibold text-foreground line-clamp-2 mb-1">{preset.titulo}</p>
          )}
          {preset.subtitulo && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{preset.subtitulo}</p>
          )}
          {preset.cta_texto && (
            <span className="inline-block text-xs border border-primary/40 text-primary px-3 py-1 rounded-full">
              CTA: {preset.cta_texto}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default HeroTab;
