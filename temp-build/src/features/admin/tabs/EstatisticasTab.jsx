import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const FieldError = ({ error }) =>
  error ? <p className="text-xs text-destructive mt-1">{error.message || 'Campo obrigatório'}</p> : null;

const EstatisticasTab = ({ statsForm, isLoading, onStatsSubmit }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = statsForm;

  if (isLoading) return <TabLoader rows={3} card />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Estatísticas</h2>
      <form onSubmit={handleSubmit(onStatsSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="font-bold">Procedimentos realizados</Label>
            <Input type="number" {...register('procedimentos', { required: 'Obrigatório', min: { value: 0, message: 'Min 0' } })} className="mt-2 focus-visible:ring-primary" />
            <FieldError error={errors.procedimentos} />
          </div>
          <div>
            <Label className="font-bold">Pacientes satisfeitos (%)</Label>
            <Input type="number" {...register('satisfacao', { required: 'Obrigatório', min: { value: 0, message: 'Min 0' }, max: { value: 100, message: 'Max 100' } })} className="mt-2 focus-visible:ring-primary" />
            <FieldError error={errors.satisfacao} />
          </div>
          <div>
            <Label className="font-bold">Anos de experiência</Label>
            <Input type="number" {...register('experiencia', { required: 'Obrigatório', min: { value: 0, message: 'Min 0' } })} className="mt-2 focus-visible:ring-primary" />
            <FieldError error={errors.experiencia} />
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting} className="mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-white">
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar Estatísticas
        </Button>
      </form>
    </div>
  );
};

export default EstatisticasTab;
