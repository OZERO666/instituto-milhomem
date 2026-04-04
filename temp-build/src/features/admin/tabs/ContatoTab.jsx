import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Label } from '@/components/ui/label.jsx';
import TabLoader from '@/features/admin/components/TabLoader.jsx';

const ContatoTab = ({ contactForm, isLoading, onContactSubmit }) => {
  const { register, handleSubmit, formState: { isSubmitting } } = contactForm;

  if (isLoading) return <TabLoader rows={5} card />;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-border p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-secondary border-b pb-4">Configurações de Contato</h2>
      <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-5">
        <div>
          <Label className="font-bold">Telefone / WhatsApp</Label>
          <Input {...register('whatsapp')} className="mt-2 focus-visible:ring-primary" />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="font-bold">Latitude</Label>
            <Input type="number" step="any" {...register('latitude')} className="mt-2 focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold">Longitude</Label>
            <Input type="number" step="any" {...register('longitude')} className="mt-2 focus-visible:ring-primary" />
          </div>
          <div>
            <Label className="font-bold">Zoom do Mapa</Label>
            <Input type="number" {...register('zoom')} className="mt-2 focus-visible:ring-primary" />
          </div>
        </div>
        <div>
          <Label className="font-bold">Endereço</Label>
          <Textarea {...register('endereco')} rows={2} className="mt-2 resize-none focus-visible:ring-primary" />
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
    </div>
  );
};

export default ContatoTab;
