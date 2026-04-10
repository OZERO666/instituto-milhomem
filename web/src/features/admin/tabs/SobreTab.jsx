import React, { useState } from 'react';
import {
  Plus, X, CheckCircle,
  Award, Shield, Heart, Sparkles, Star, Zap, Target, Users, Clock,
  Leaf, Gem, TrendingUp, BadgeCheck, Stethoscope, Eye, Brain, Smile,
  Globe, Handshake, Lightbulb, Lock, Medal, Microscope, Ribbon, Sun,
  ThumbsUp, Trophy, Verified, Wallet, Wind
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Switch } from '@/components/ui/switch.jsx';
import AdminSectionSwitch from '@/features/admin/components/AdminSectionSwitch.jsx';
import { SOBRE_SECTION_OPTIONS } from '@/features/admin/constants/navigation.js';
import { parseJsonArray } from '@/features/admin/utils/sobreConfig.js';
import MediaSelectorField from '@/features/admin/components/MediaSelectorField.jsx';
import TranslationFields from '@/features/admin/components/TranslationFields.jsx';

const SOBRE_TRANSLATION_FIELDS = {
  hero: [
    { name: 'hero_badge',    label: 'Badge',         type: 'input' },
    { name: 'hero_title',    label: 'Título',         type: 'input' },
    { name: 'hero_subtitle', label: 'Subtítulo',      type: 'textarea', rows: 3 },
  ],
  doctor: [
    { name: 'doctor_name',             label: 'Nome',            type: 'input' },
    { name: 'doctor_title',            label: 'Cargo / Título',   type: 'input' },
    { name: 'doctor_bio',              label: 'Biografia',        type: 'textarea', rows: 4 },
    { name: 'doctor_experience_label', label: 'Rótulo Destaque',  type: 'input' },
  ],
  wfi: [
    { name: 'wfi_badge', label: 'Badge',  type: 'input' },
    { name: 'wfi_title', label: 'Título', type: 'input' },
    { name: 'wfi_text',  label: 'Texto',  type: 'textarea', rows: 4 },
  ],
  about: [
    { name: 'about_title',       label: 'Título',             type: 'input' },
    { name: 'about_text',        label: 'Texto Principal',    type: 'textarea', rows: 3 },
    { name: 'about_detail_text', label: 'Texto Secundário',   type: 'textarea', rows: 3 },
  ],
  values: [
    { name: 'values_title',    label: 'Título',    type: 'input' },
    { name: 'values_subtitle', label: 'Subtítulo', type: 'textarea', rows: 2 },
  ],
  team: [
    { name: 'team_title',    label: 'Título Equipe',    type: 'input' },
    { name: 'team_subtitle', label: 'Subtítulo Equipe', type: 'textarea', rows: 2 },
  ],
  technology: [
    { name: 'technology_title', label: 'Título',  type: 'input' },
    { name: 'technology_text',  label: 'Texto',   type: 'textarea', rows: 4 },
  ],
};

// ─── Icon Picker ──────────────────────────────────────────────────────────────
const ICON_MAP = {
  Award, Shield, Heart, Sparkles, Star, Zap, Target, Users, Clock,
  Leaf, Gem, TrendingUp, BadgeCheck, Stethoscope, Eye, Brain, Smile,
  Globe, Handshake, Lightbulb, Lock, Medal, Microscope, Ribbon, Sun,
  ThumbsUp, Trophy, Verified, Wallet, Wind,
};
const ICON_LIST = Object.keys(ICON_MAP);

const IconPicker = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const SelectedIcon = ICON_MAP[selected] || Award;
  return (
    <div className="relative">
      <Label className="text-xs font-bold uppercase tracking-wider block mb-1">Ícone do Card</Label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background hover:border-primary/50 transition-colors text-sm font-medium"
      >
        <SelectedIcon className="w-4 h-4 text-primary" />
        <span className="text-foreground">{selected || 'Award'}</span>
        <span className="ml-auto text-muted-foreground text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 p-3 bg-card border border-border rounded-xl shadow-xl grid grid-cols-6 gap-1.5 w-72">
          {ICON_LIST.map(name => {
            const Ic = ICON_MAP[name];
            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); }}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-lg hover:bg-primary/10 transition-colors ${selected === name ? 'bg-primary/20 ring-1 ring-primary' : ''}`}
              >
                <Ic className="w-5 h-5 text-primary" />
                <span className="text-[9px] text-muted-foreground leading-tight truncate w-full text-center">{name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const SectionToggle = ({ checked, onChange }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2">
    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Seção ativa</span>
    <Switch checked={checked} onCheckedChange={onChange} />
  </div>
);

const SobreTab = ({ sobreForm, sobreSection, setSobreSection, sobreConfig, sobreSaving, onSobreSubmit }) => (
  <div className="space-y-6">
    <AdminSectionSwitch
      options={SOBRE_SECTION_OPTIONS}
      activeKey={sobreSection}
      onChange={setSobreSection}
      buttonClassName="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
    />

    <form onSubmit={sobreForm.handleSubmit(onSobreSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">

        {/* HERO SECTION */}
        {sobreSection === 'hero' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção Hero</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.hero.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.hero.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div>
              <Label className="font-bold">Badge (etiqueta topo)</Label>
              <Input {...sobreForm.register('hero_badge')} placeholder="Ex: Padrão Internacional" className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Título Principal *</Label>
              <Input {...sobreForm.register('hero_title')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Subtítulo</Label>
              <Textarea {...sobreForm.register('hero_subtitle')} rows={3} className="mt-2 resize-none focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Imagem Hero</Label>
              <input type="hidden" {...sobreForm.register('hero_image')} />
              <MediaSelectorField
                value={sobreForm.watch('hero_image') || ''}
                onChange={(nextValue) => sobreForm.setValue('hero_image', nextValue, { shouldDirty: true })}
                folder="misc"
                libraryFolders={['all', 'branding', 'misc']}
                previewClassName="h-36"
                helperText="Você pode colar uma URL, escolher da biblioteca ou enviar uma nova imagem ao Cloudinary."
              />
            </div>
          </div>
        )}

        {/* DOCTOR SECTION */}
        {sobreSection === 'doctor' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção do Doutor</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.doctor.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.doctor.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-bold">Nome</Label>
                <Input {...sobreForm.register('doctor_name')} className="mt-2 focus-visible:ring-primary" />
              </div>
              <div>
                <Label className="font-bold">Cargo / Título</Label>
                <Input {...sobreForm.register('doctor_title')} className="mt-2 focus-visible:ring-primary" />
              </div>
            </div>
            <div>
              <Label className="font-bold">Biografia</Label>
              <Textarea {...sobreForm.register('doctor_bio')} rows={6} className="mt-2 resize-none focus-visible:ring-primary" placeholder="Use quebra de linha para separar parágrafos" />
            </div>
            <div>
              <Label className="font-bold">Foto do Doutor</Label>
              <input type="hidden" {...sobreForm.register('doctor_image')} />
              <MediaSelectorField
                value={sobreForm.watch('doctor_image') || ''}
                onChange={(nextValue) => sobreForm.setValue('doctor_image', nextValue, { shouldDirty: true })}
                folder="misc"
                libraryFolders={['all', 'branding', 'misc']}
                previewClassName="h-48"
                helperText="Use uma foto já enviada ou faça upload direto para o Cloudinary."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-bold">Número de Destaque</Label>
                <Input {...sobreForm.register('doctor_experience_number')} placeholder="Ex: 15+" className="mt-2 focus-visible:ring-primary" />
              </div>
              <div>
                <Label className="font-bold">Rótulo do Destaque</Label>
                <Input {...sobreForm.register('doctor_experience_label')} placeholder="Ex: Anos de Experiência" className="mt-2 focus-visible:ring-primary" />
              </div>
            </div>
            <div>
              <Label className="font-bold mb-2 block">Credenciais / Certificações</Label>
              {parseJsonArray(sobreForm.watch('doctor_credentials')).map((cred, idx) => (
                <div key={idx} className="mb-3 p-3 border border-border rounded-lg bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={cred}
                      onChange={e => {
                        const curr = [...(sobreForm.getValues('doctor_credentials') || [])];
                        curr[idx] = e.target.value;
                        sobreForm.setValue('doctor_credentials', curr);
                      }}
                      className="flex-1 focus-visible:ring-primary"
                      placeholder={`Credencial ${idx + 1}`}
                    />
                    <Button type="button" variant="destructive" size="icon"
                      onClick={() => {
                        const curr = [...(sobreForm.getValues('doctor_credentials') || [])];
                        curr.splice(idx, 1);
                        sobreForm.setValue('doctor_credentials', curr);
                      }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {sobreConfig?.id && (
                    <TranslationFields
                      tabela="sobre_config"
                      registroId={sobreConfig.id}
                      originalData={{ [`doctor_credential_${idx}`]: cred }}
                      fields={[
                        { name: `doctor_credential_${idx}`, label: `Tradução Credencial ${idx + 1}`, type: 'input' },
                      ]}
                    />
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => sobreForm.setValue('doctor_credentials', [...(sobreForm.getValues('doctor_credentials') || []), ''])}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar Credencial
              </Button>
            </div>
          </div>
        )}

        {/* WFI SECTION */}
        {sobreSection === 'wfi' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção WFI (World FUE Institute)</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.wfi.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.wfi.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div>
              <Label className="font-bold">Badge</Label>
              <Input {...sobreForm.register('wfi_badge')} placeholder="Ex: Reconhecimento Global" className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Título</Label>
              <Input {...sobreForm.register('wfi_title')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Texto</Label>
              <Textarea {...sobreForm.register('wfi_text')} rows={5} className="mt-2 resize-none focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Link Externo</Label>
              <Input {...sobreForm.register('wfi_link')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
            </div>
          </div>
        )}

        {/* ABOUT SECTION */}
        {sobreSection === 'about' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção Sobre a Clínica</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.about.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.about.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div>
              <Label className="font-bold">Título</Label>
              <Input {...sobreForm.register('about_title')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Texto Principal</Label>
              <Textarea {...sobreForm.register('about_text')} rows={4} className="mt-2 resize-none focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Texto Secundário (coluna direita)</Label>
              <Textarea {...sobreForm.register('about_detail_text')} rows={4} className="mt-2 resize-none focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Imagem</Label>
              <input type="hidden" {...sobreForm.register('about_image')} />
              <MediaSelectorField
                value={sobreForm.watch('about_image') || ''}
                onChange={(nextValue) => sobreForm.setValue('about_image', nextValue, { shouldDirty: true })}
                folder="misc"
                libraryFolders={['all', 'branding', 'misc']}
                previewClassName="h-36"
                helperText="Escolha uma imagem da biblioteca para manter consistência visual entre páginas."
              />
            </div>
          </div>
        )}

        {/* VALUES SECTION */}
        {sobreSection === 'values' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção Valores / Filosofia</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.values.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.values.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div>
              <Label className="font-bold">Título da Seção</Label>
              <Input {...sobreForm.register('values_title')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Subtítulo</Label>
              <Textarea {...sobreForm.register('values_subtitle')} rows={2} className="mt-2 resize-none focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold mb-2 block">Valores</Label>
              {parseJsonArray(sobreForm.watch('values')).map((val, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg mb-3 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Valor {idx + 1}</span>
                    <Button type="button" variant="destructive" size="icon" className="h-7 w-7"
                      onClick={() => {
                        const curr = [...(sobreForm.getValues('values') || [])];
                        curr.splice(idx, 1);
                        sobreForm.setValue('values', curr);
                      }}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <IconPicker
                    selected={val.icon || 'Award'}
                    onChange={name => {
                      const curr = [...(sobreForm.getValues('values') || [])];
                      curr[idx] = { ...curr[idx], icon: name };
                      sobreForm.setValue('values', curr);
                    }}
                  />
                  <Input
                    value={val.title || ''}
                    onChange={e => {
                      const curr = [...(sobreForm.getValues('values') || [])];
                      curr[idx] = { ...curr[idx], title: e.target.value };
                      sobreForm.setValue('values', curr);
                    }}
                    placeholder="Título do valor"
                    className="mb-2 mt-3 focus-visible:ring-primary"
                  />
                  <Textarea
                    value={val.description || ''}
                    onChange={e => {
                      const curr = [...(sobreForm.getValues('values') || [])];
                      curr[idx] = { ...curr[idx], description: e.target.value };
                      sobreForm.setValue('values', curr);
                    }}
                    placeholder="Descrição"
                    rows={2}
                    className="resize-none focus-visible:ring-primary"
                  />
                  {sobreConfig?.id && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <TranslationFields
                        tabela="sobre_config"
                        registroId={sobreConfig.id}
                        originalData={{ title: val.title, description: val.description }}
                        fields={[
                          { name: `value_${idx}_title`,       label: 'Título',     type: 'input' },
                          { name: `value_${idx}_description`, label: 'Descrição',  type: 'textarea', rows: 2 },
                        ]}
                      />
                    </div>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => sobreForm.setValue('values', [...(sobreForm.getValues('values') || []), { icon: 'Award', title: '', description: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar Valor
              </Button>
            </div>
          </div>
        )}

        {/* TEAM SECTION */}
        {sobreSection === 'team' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção Equipe</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.team.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.team.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div>
              <Label className="font-bold">Título da Seção</Label>
              <Input {...sobreForm.register('team_title')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Subtítulo</Label>
              <Textarea {...sobreForm.register('team_subtitle')} rows={3} className="mt-2 resize-none focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold mb-2 block">Membros da Equipe</Label>
              {parseJsonArray(sobreForm.watch('team')).map((member, idx) => (
                <div key={idx} className="p-4 border border-border rounded-lg mb-3 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase text-muted-foreground">Membro {idx + 1}</span>
                    <Button type="button" variant="destructive" size="icon" className="h-7 w-7"
                      onClick={() => {
                        const curr = [...(sobreForm.getValues('team') || [])];
                        curr.splice(idx, 1);
                        sobreForm.setValue('team', curr);
                      }}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <Input
                      value={member.name || ''}
                      onChange={e => {
                        const curr = [...(sobreForm.getValues('team') || [])];
                        curr[idx] = { ...curr[idx], name: e.target.value };
                        sobreForm.setValue('team', curr);
                      }}
                      placeholder="Nome"
                      className="focus-visible:ring-primary"
                    />
                    <Input
                      value={member.role || ''}
                      onChange={e => {
                        const curr = [...(sobreForm.getValues('team') || [])];
                        curr[idx] = { ...curr[idx], role: e.target.value };
                        sobreForm.setValue('team', curr);
                      }}
                      placeholder="Cargo"
                      className="focus-visible:ring-primary"
                    />
                  </div>
                  <div className="mb-2">
                    <MediaSelectorField
                      label="Foto"
                      value={member.image || ''}
                      onChange={(nextValue) => {
                        const curr = [...(sobreForm.getValues('team') || [])];
                        curr[idx] = { ...curr[idx], image: nextValue };
                        sobreForm.setValue('team', curr, { shouldDirty: true });
                      }}
                      folder="misc"
                      libraryFolders={['all', 'branding', 'misc']}
                      previewClassName="h-28"
                      helperText="Reaproveite imagens do Cloudinary para a equipe ou envie uma nova agora."
                    />
                  </div>
                  <Textarea
                    value={member.desc || ''}
                    onChange={e => {
                      const curr = [...(sobreForm.getValues('team') || [])];
                      curr[idx] = { ...curr[idx], desc: e.target.value };
                      sobreForm.setValue('team', curr);
                    }}
                    placeholder="Descrição"
                    rows={2}
                    className="resize-none focus-visible:ring-primary"
                  />
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => sobreForm.setValue('team', [...(sobreForm.getValues('team') || []), { name: '', role: '', image: '', desc: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar Membro
              </Button>

              {sobreConfig?.id && parseJsonArray(sobreForm.watch('team')).length > 0 && (
                <div className="pt-4 border-t border-border space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Traduções por Membro</p>
                  {parseJsonArray(sobreForm.watch('team')).map((member, idx) => (
                    <div key={idx} className="p-3 bg-muted/30 rounded-lg border border-border">
                      <p className="text-xs font-bold text-foreground mb-2">Membro {idx + 1}{member.name ? ` — ${member.name}` : ''}</p>
                      <TranslationFields
                        tabela="sobre_config"
                        registroId={sobreConfig.id}
                        originalData={{ name: member.name, role: member.role, desc: member.desc }}
                        fields={[
                          { name: `team_${idx}_name`, label: 'Nome',      type: 'input' },
                          { name: `team_${idx}_role`, label: 'Cargo',     type: 'input' },
                          { name: `team_${idx}_desc`, label: 'Descrição', type: 'textarea', rows: 2 },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TECHNOLOGY SECTION */}
        {sobreSection === 'technology' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between gap-4 border-b pb-3">
              <h3 className="text-lg font-bold text-secondary">Seção Tecnologia</h3>
              <SectionToggle
                checked={sobreForm.watch('sections.technology.enabled') !== false}
                onChange={(checked) => sobreForm.setValue('sections.technology.enabled', checked, { shouldDirty: true })}
              />
            </div>
            <div>
              <Label className="font-bold">Título</Label>
              <Input {...sobreForm.register('technology_title')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Texto</Label>
              <Textarea {...sobreForm.register('technology_text')} rows={6} className="mt-2 resize-none focus-visible:ring-primary" placeholder="Use quebra de linha para separar parágrafos" />
            </div>
            <div>
              <Label className="font-bold">Imagem</Label>
              <input type="hidden" {...sobreForm.register('technology_image')} />
              <MediaSelectorField
                value={sobreForm.watch('technology_image') || ''}
                onChange={(nextValue) => sobreForm.setValue('technology_image', nextValue, { shouldDirty: true })}
                folder="misc"
                libraryFolders={['all', 'branding', 'misc']}
                previewClassName="h-36"
                helperText="Selecione uma imagem do acervo do Cloudinary ou envie uma nova para esta seção."
              />
            </div>
          </div>
        )}
      </div>

      {/* Right: Preview + Save */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-24 space-y-5">
          <h3 className="text-lg font-bold text-secondary border-b pb-3">Prévia & Ações</h3>

          {sobreConfig ? (
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Hero</p>
                <p className="font-semibold text-foreground">{sobreConfig.hero_title || '—'}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Doutor</p>
                <p className="font-semibold text-foreground">{sobreConfig.doctor_name || '—'}</p>
                <p className="text-xs text-muted-foreground">{sobreConfig.doctor_title || ''}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Sobre</p>
                <p className="font-semibold text-foreground">{sobreConfig.about_title || '—'}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Valores</p>
                <p className="text-foreground">{parseJsonArray(sobreConfig.values).length} valores cadastrados</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Equipe</p>
                <p className="text-foreground">{parseJsonArray(sobreConfig.team).length} membros cadastrados</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma configuração salva ainda.</p>
          )}

          <Button
            type="submit"
            disabled={sobreSaving}
            className="w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold uppercase tracking-wide"
          >
            {sobreSaving ? 'Salvando...' : <><CheckCircle className="w-4 h-4 mr-2" /> Salvar Tudo</>}
          </Button>

          {sobreConfig && (
            <div className="pt-2 border-t border-border">
              <TranslationFields
                tabela="sobre_config"
                registroId={sobreConfig?.id}
                originalData={sobreConfig}
                fields={SOBRE_TRANSLATION_FIELDS[sobreSection] || []}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  </div>
);

export default SobreTab;
