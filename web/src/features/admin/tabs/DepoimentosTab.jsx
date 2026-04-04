import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Upload, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';
import Pagination from '@/features/admin/components/Pagination.jsx';
import TranslationFields from '@/features/admin/components/TranslationFields.jsx';
import { useFilePreview } from '@/features/admin/hooks/useFilePreview.js';
import { usePagination } from '@/features/admin/hooks/usePagination.js';

const FieldError = ({ error }) =>
  error ? <p className="text-xs text-destructive mt-1">{error.message || 'Campo obrigatório'}</p> : null;

const DepoimentosTab = ({ testimonials, isLoading, testimonialForm, editingItem, setEditingItem, onGenericSubmit, onDelete }) => {
  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = testimonialForm;
  const fotoPreview = useFilePreview(watch('foto'));
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return testimonials;
    return testimonials.filter(t =>
      t.nome?.toLowerCase().includes(q) ||
      t.cargo?.toLowerCase().includes(q) ||
      t.mensagem?.toLowerCase().includes(q)
    );
  }, [testimonials, query]);
  const { paged, page, setPage, totalPages, from, to, total } = usePagination(filtered, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 sticky top-24">
          <h2 className="text-xl font-bold mb-6 text-secondary border-b border-border pb-3">
            {editingItem ? 'Editar Depoimento' : 'Adicionar Depoimento'}
          </h2>
          <form onSubmit={handleSubmit(data => onGenericSubmit('depoimentos', data))} className="space-y-5">
            <div>
              <Label className="font-bold">Nome</Label>
              <Input {...register('nome', { required: 'Informe o nome' })} className="mt-2 focus-visible:ring-primary" />
              <FieldError error={errors.nome} />
            </div>
            <div>
              <Label className="font-bold">Profissão / Cidade</Label>
              <Input {...register('cargo')} className="mt-2 focus-visible:ring-primary" />
            </div>
            <div>
              <Label className="font-bold">Depoimento</Label>
              <Textarea {...register('mensagem', { required: 'Informe o depoimento' })} rows={3} className="mt-2 resize-none focus-visible:ring-primary" />
              <FieldError error={errors.mensagem} />
            </div>
            <div className="p-4 border border-dashed border-border rounded-lg bg-muted/30">
              <Label className="mb-2 block font-bold">Foto</Label>
              {(fotoPreview || editingItem?.foto) && (
                <img
                  src={fotoPreview ?? editingItem.foto}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-lg mb-2 border border-border"
                />
              )}
              <Input type="file" accept="image/*" className="bg-white" {...register('foto')} />
              {!fotoPreview && editingItem?.foto && <p className="text-[10px] text-muted-foreground mt-1">Deixe vazio para manter a foto atual</p>}
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-primary-foreground hover:bg-secondary hover:text-white font-bold uppercase tracking-wide">
                {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {editingItem ? 'Atualizar' : 'Adicionar'}
              </Button>
              {editingItem && (
                <Button type="button" variant="outline" onClick={() => { setEditingItem(null); reset(); }}>Cancelar</Button>
              )}
            </div>
          </form>

          <TranslationFields
            tabela="depoimentos"
            registroId={editingItem?.id}
            originalData={editingItem}
            fields={[
              { name: 'cargo',    label: 'Profissão / Cidade', type: 'input'    },
              { name: 'mensagem', label: 'Depoimento',           type: 'textarea', rows: 4 },
            ]}
          />
        </div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-secondary">Depoimentos Cadastrados</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar depoimentos..."
              className="pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 w-52"
            />
          </div>
        </div>
        {isLoading ? (
          <TabLoader rows={3} />
        ) : paged.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">{query ? 'Nenhum depoimento encontrado.' : 'Nenhum depoimento cadastrado.'}</p>
        ) : paged.map(item => (
          <div key={item.id} className="bg-white rounded-xl p-6 border border-border shadow-sm flex gap-5 hover:border-primary/50 transition-colors">
            <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-full overflow-hidden border border-border">
              {item.foto ? <img src={item.foto} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem foto</div>}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-lg text-secondary">{item.nome}</h3>
                  {item.cargo && <p className="text-xs text-muted-foreground">{item.cargo}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" onClick={() => { setEditingItem(item); reset(item); }}><Edit className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" onClick={() => onDelete('depoimentos', item.id, item.nome)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{item.mensagem}</p>
            </div>
          </div>
        ))}
        <Pagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default DepoimentosTab;
