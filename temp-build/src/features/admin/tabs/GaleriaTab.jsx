import React, { useState, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Edit, Trash2, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';
import Pagination from '@/features/admin/components/Pagination.jsx';
import { useFilePreview } from '@/features/admin/hooks/useFilePreview.js';
import { usePagination } from '@/features/admin/hooks/usePagination.js';

const GaleriaTab = ({
  galleryItems, galleryThemes, isLoading, galleryForm, themeForm,
  editingItem, setEditingItem, editingTheme, setEditingTheme,
  onGenericSubmit, onThemeSubmit, onDelete,
}) => {
  const { register, handleSubmit, reset, watch, control, formState: { isSubmitting } } = galleryForm;
  const antesPreview  = useFilePreview(watch('foto_antes'));
  const depoisPreview = useFilePreview(watch('foto_depois'));
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return galleryItems;
    return galleryItems.filter(g =>
      g.titulo?.toLowerCase().includes(q) ||
      g.tema_nome?.toLowerCase().includes(q)
    );
  }, [galleryItems, query]);
  const { paged, page, setPage, totalPages, from, to, total } = usePagination(filtered, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
          <h2 className="text-xl font-bold mb-4 text-secondary border-b border-border pb-3">Temas / Filtros</h2>
          <form onSubmit={themeForm.handleSubmit(onThemeSubmit)} className="space-y-3 mb-4">
            <Input placeholder={editingTheme ? 'Editar nome do tema' : 'Nome do novo tema'} {...themeForm.register('nome', { required: true })} />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                {editingTheme ? 'Salvar' : 'Adicionar Tema'}
              </Button>
              {editingTheme && (
                <Button type="button" variant="outline" onClick={() => { setEditingTheme(null); themeForm.reset(); }}>Cancelar</Button>
              )}
            </div>
          </form>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {galleryThemes.map(theme => (
              <div key={theme.id} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                <span className="font-medium">{theme.nome}</span>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-primary"
                    onClick={() => { setEditingTheme(theme); themeForm.reset({ nome: theme.nome }); }}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-destructive"
                    onClick={() => onDelete('galeria-temas', theme.id, theme.nome)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
            {galleryThemes.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">Nenhum tema criado ainda.</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-secondary border-b border-border pb-3">
            {editingItem ? 'Editar Foto' : 'Adicionar Foto'}
          </h2>
          <form onSubmit={handleSubmit(data => onGenericSubmit('galeria', data))} className="space-y-5">
            <div>
              <Label className="font-bold">Título</Label>
              <Input {...register('titulo', { required: true })} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Tema / Filtro</Label>
              <Controller
                name="tema_id"
                control={control}
                rules={{ required: 'Selecione um tema' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select onValueChange={field.onChange} value={field.value ?? ''}>
                      <SelectTrigger className="mt-2 focus:ring-primary">
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {galleryThemes.map(t => (
                          <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                        ))}
                        {galleryThemes.length === 0 && <SelectItem value="__none" disabled>Nenhum tema criado</SelectItem>}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <p className="text-xs text-destructive mt-1">{fieldState.error.message}</p>}
                  </>
                )}
              />
            </div>
            <div>
              <Label className="font-bold">Meses pós-operatório</Label>
              <Input type="number" {...register('meses_pos_operatorio')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div className="p-4 border border-dashed border-border rounded-lg bg-muted/30">
              <Label className="mb-2 block font-bold">Foto Antes</Label>
              {(antesPreview || editingItem?.foto_antes) && (
                <img
                  src={antesPreview ?? editingItem.foto_antes}
                  alt="preview antes"
                  className="w-full h-24 object-cover rounded-lg mb-2 border border-border"
                />
              )}
              <Input type="file" accept="image/*" className="bg-white" {...register('foto_antes')} />
              {!antesPreview && editingItem?.foto_antes && <p className="text-[10px] text-muted-foreground mt-1">Deixe vazio para manter a foto atual</p>}
            </div>
            <div className="p-4 border border-dashed border-border rounded-lg bg-muted/30">
              <Label className="mb-2 block font-bold">Foto Depois</Label>
              {(depoisPreview || editingItem?.foto_depois) && (
                <img
                  src={depoisPreview ?? editingItem.foto_depois}
                  alt="preview depois"
                  className="w-full h-24 object-cover rounded-lg mb-2 border border-border"
                />
              )}
              <Input type="file" accept="image/*" className="bg-white" {...register('foto_depois')} />
              {!depoisPreview && editingItem?.foto_depois && <p className="text-[10px] text-muted-foreground mt-1">Deixe vazio para manter a foto atual</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold uppercase tracking-wide">
                <Upload className="w-4 h-4 mr-2" /> {editingItem ? 'Atualizar' : 'Adicionar'}
              </Button>
              {editingItem && (
                <Button type="button" variant="outline" onClick={() => { setEditingItem(null); reset(); }}>Cancelar</Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-secondary">Galeria Cadastrada</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar galeria..."
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 w-52"
            />
          </div>
        </div>
        {isLoading ? (
          <TabLoader rows={3} />
        ) : paged.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">{query ? 'Nenhuma foto encontrada.' : 'Nenhuma foto cadastrada.'}</p>
        ) : paged.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-4 border border-border shadow-sm flex flex-col md:flex-row gap-4 hover:border-primary/50 transition-colors">
            <div className="flex gap-2 flex-shrink-0">
              <div className="w-28 h-28 bg-muted rounded-lg overflow-hidden border border-border">
                {item.foto_antes ? <img src={item.foto_antes} alt="antes" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>}
              </div>
              <div className="w-28 h-28 bg-muted rounded-lg overflow-hidden border border-border">
                {item.foto_depois ? <img src={item.foto_depois} alt="depois" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-secondary">{item.titulo}</h3>
                  {item.tema_nome && <p className="text-xs text-muted-foreground">Tema: {item.tema_nome}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => { setEditingItem(item); reset(item); }}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => onDelete('galeria', item.id, item.titulo)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              {item.meses_pos_operatorio && <p className="text-xs text-muted-foreground">{item.meses_pos_operatorio} meses pós-operatório</p>}
            </div>
          </div>
        ))}
        <Pagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default GaleriaTab;
