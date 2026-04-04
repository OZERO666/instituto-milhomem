import React from 'react';
import { Plus, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import AdminSectionSwitch from '@/features/admin/components/AdminSectionSwitch.jsx';
import { SOBRE_SECTION_OPTIONS } from '@/features/admin/constants/navigation.js';
import { parseJsonArray } from '@/features/admin/utils/sobreConfig.js';

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
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção Hero</h3>
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
              <Input {...sobreForm.register('hero_image')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
              <Input id="sobre_hero_image_file" type="file" accept="image/*" className="mt-2 bg-white" />
              {sobreConfig?.hero_image && (
                <img src={sobreConfig.hero_image} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-xl border border-border" />
              )}
            </div>
          </div>
        )}

        {/* DOCTOR SECTION */}
        {sobreSection === 'doctor' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção do Doutor</h3>
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
              <Input {...sobreForm.register('doctor_image')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
              <Input id="sobre_doctor_image_file" type="file" accept="image/*" className="mt-2 bg-white" />
              {sobreConfig?.doctor_image && (
                <img src={sobreConfig.doctor_image} alt="Preview" className="mt-3 h-32 object-cover rounded-xl border border-border" />
              )}
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
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <Input
                    value={cred}
                    onChange={e => {
                      const curr = [...(sobreForm.getValues('doctor_credentials') || [])];
                      curr[idx] = e.target.value;
                      sobreForm.setValue('doctor_credentials', curr);
                    }}
                    className="flex-1 focus-visible:ring-primary"
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
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção WFI (World FUE Institute)</h3>
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
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção Sobre a Clínica</h3>
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
              <Input {...sobreForm.register('about_image')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
              <Input id="sobre_about_image_file" type="file" accept="image/*" className="mt-2 bg-white" />
              {sobreConfig?.about_image && (
                <img src={sobreConfig.about_image} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-xl border border-border" />
              )}
            </div>
          </div>
        )}

        {/* VALUES SECTION */}
        {sobreSection === 'values' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção Valores / Filosofia</h3>
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
                  <Input
                    value={val.title || ''}
                    onChange={e => {
                      const curr = [...(sobreForm.getValues('values') || [])];
                      curr[idx] = { ...curr[idx], title: e.target.value };
                      sobreForm.setValue('values', curr);
                    }}
                    placeholder="Título do valor"
                    className="mb-2 focus-visible:ring-primary"
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
                </div>
              ))}
              <Button type="button" variant="outline" size="sm"
                onClick={() => sobreForm.setValue('values', [...(sobreForm.getValues('values') || []), { title: '', description: '' }])}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar Valor
              </Button>
            </div>
          </div>
        )}

        {/* TEAM SECTION */}
        {sobreSection === 'team' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção Equipe</h3>
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
                  <Input
                    value={member.image || ''}
                    onChange={e => {
                      const curr = [...(sobreForm.getValues('team') || [])];
                      curr[idx] = { ...curr[idx], image: e.target.value };
                      sobreForm.setValue('team', curr);
                    }}
                    placeholder="URL da foto"
                    className="mb-2 focus-visible:ring-primary"
                  />
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
            </div>
          </div>
        )}

        {/* TECHNOLOGY SECTION */}
        {sobreSection === 'technology' && (
          <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-5">
            <h3 className="text-lg font-bold text-secondary border-b pb-3">Seção Tecnologia</h3>
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
              <Input {...sobreForm.register('technology_image')} placeholder="https://..." className="mt-2 focus-visible:ring-primary" />
              <Input id="sobre_technology_image_file" type="file" accept="image/*" className="mt-2 bg-white" />
              {sobreConfig?.technology_image && (
                <img src={sobreConfig.technology_image} alt="Preview" className="mt-3 w-full h-36 object-cover rounded-xl border border-border" />
              )}
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
        </div>
      </div>
    </form>
  </div>
);

export default SobreTab;
