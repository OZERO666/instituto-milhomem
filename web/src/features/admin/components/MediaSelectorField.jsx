import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Image as ImageIcon, Loader2, RefreshCw, Search, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.jsx';
import { useMediaLibrary } from '@/features/admin/hooks/useMediaLibrary.js';
import { uploadFile } from '@/features/admin/utils/adminApi.js';

const DEFAULT_FOLDER_LABELS = {
  all: 'Todos',
  branding: 'Branding',
  servicos: 'Serviços',
  misc: 'Misc',
  artigos: 'Artigos',
  galeria: 'Galeria',
  depoimentos: 'Depoimentos',
};

function buildFolderOptions(folders) {
  return folders.map((value) => ({
    value,
    label: DEFAULT_FOLDER_LABELS[value] || value,
  }));
}

export default function MediaSelectorField({
  label,
  value,
  onChange,
  folder = 'misc',
  libraryFolders,
  placeholder = 'https://...',
  previewClassName = 'h-36',
  helperText,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);
  const { assets, isLoading, activeFolder, fetchMedia } = useMediaLibrary();
  const folderOptions = useMemo(
    () => buildFolderOptions(libraryFolders?.length ? libraryFolders : ['all', folder, 'misc'].filter((item, index, list) => list.indexOf(item) === index)),
    [folder, libraryFolders],
  );

  useEffect(() => {
    if (open) {
      fetchMedia(activeFolder || folderOptions[0]?.value || 'all');
    }
  }, [fetchMedia, folderOptions, open]);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return assets;
    return assets.filter((asset) =>
      [asset.public_id, asset.folder, asset.format]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [assets, query]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadFile(file, folder === 'all' ? 'misc' : folder);
      onChange(uploadedUrl);
      toast.success('Imagem enviada para o Cloudinary.');
    } catch (error) {
      toast.error(error.message || 'Erro ao enviar imagem');
    } finally {
      event.target.value = '';
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {label ? <Label className="font-bold">{label}</Label> : null}
      <Input value={value || ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="focus-visible:ring-primary" />

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => setOpen(true)} className="gap-2">
          <ImageIcon className="w-4 h-4" /> Biblioteca Cloudinary
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={isUploading} className="gap-2">
          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {isUploading ? 'Enviando...' : 'Upload do dispositivo'}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" onClick={() => onChange('')} className="gap-2 text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" /> Limpar
          </Button>
        ) : null}
      </div>

      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}

      <div className="border border-dashed border-border rounded-xl bg-muted/30 overflow-hidden">
        {value ? (
          <img src={value} alt="Prévia" className={`w-full ${previewClassName} object-cover`} />
        ) : (
          <div className={`w-full ${previewClassName} flex flex-col items-center justify-center gap-2 text-muted-foreground`}>
            <ImageIcon className="w-6 h-6" />
            <p className="text-xs font-medium">Nenhuma imagem selecionada</p>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Selecionar imagem</DialogTitle>
            <DialogDescription>
              Escolha um arquivo já existente no Cloudinary ou faça upload direto para preencher este campo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex flex-wrap gap-2">
                {folderOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => fetchMedia(option.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      activeFolder === option.value ? 'bg-primary text-secondary shadow-sm' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="relative lg:ml-auto lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome, pasta ou formato..." className="pl-9" />
              </div>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Carregando mídia...
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                Nenhuma mídia encontrada para os filtros atuais.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                {filteredAssets.map((asset) => {
                  const isSelected = value === asset.secure_url;
                  return (
                    <button
                      key={asset.asset_id}
                      type="button"
                      onClick={() => {
                        onChange(asset.secure_url);
                        setOpen(false);
                        toast.success('Imagem selecionada.');
                      }}
                      className={`text-left rounded-xl border bg-white overflow-hidden shadow-sm transition-colors ${
                        isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                        {asset.thumbnail_url ? (
                          <img src={asset.thumbnail_url} alt={asset.public_id} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                        {isSelected ? (
                          <div className="absolute top-3 right-3 bg-primary text-secondary rounded-full p-1.5">
                            <Check className="w-4 h-4" />
                          </div>
                        ) : null}
                      </div>
                      <div className="p-4 space-y-2">
                        <p className="font-semibold text-secondary line-clamp-2 break-all">{asset.public_id}</p>
                        <p className="text-xs text-muted-foreground">{asset.folder || 'sem pasta'} • {(asset.format || 'img').toUpperCase()}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="button" variant="outline" onClick={() => fetchMedia(activeFolder || folderOptions[0]?.value || 'all')} className="gap-2">
                <RefreshCw className="w-4 h-4" /> Atualizar lista
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}