// src/features/admin/utils/adminApi.js
import { toast } from 'sonner';
import api from '@/lib/apiServerClient';
import { sanitizeObject } from '@/lib/sanitizeInput.js';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export const uploadFile = async (file, folder) => {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`A imagem excede o limite de 5 MB (${(file.size / 1024 / 1024).toFixed(1)} MB).`);
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Tipo de arquivo não permitido: ${file.type}. Use JPEG, PNG, WebP, GIF ou SVG.`);
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.fetch(`/upload/${folder}`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload falhou (${res.status}): ${await res.text()}`);
  const { url } = await res.json();
  return url;
};

export const logAction = async (actionType, collectionName, recordId, details, currentUser) => {
  try {
    await api.fetch('/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id:         currentUser?.id,
        action_type:     actionType.toUpperCase(),
        collection_name: collectionName,
        record_id:       recordId,
        details,
      }),
    });
  } catch (e) { console.error('Failed to log action', e); }
};

export const deleteRecord = async (collection, id, title, currentUser, onSuccess, confirmFn) => {
  const confirmed = confirmFn
    ? await confirmFn({ collection, id, title })
    : window.confirm('Tem certeza que deseja excluir este item permanentemente?');
  if (!confirmed) return;
  try {
    await api.fetch(`/${collection}/${id}`, { method: 'DELETE' });
    await logAction('DELETE', collection, id, `Deleted: ${title || id}`, currentUser);
    toast.success('Item excluído com sucesso!');
    if (onSuccess) onSuccess();
  } catch (err) { toast.error(`Erro ao excluir: ${err.message}`); }
};

export const genericSubmit = async ({
  collection, data, form, fileFields = [],
  editingItem, setEditingItem, currentUser, onSuccess,
}) => {
  // Extract File/FileList values before sanitizing (they are not plain values)
  const fileMap = {};
  for (const field of fileFields) {
    const val = data[field];
    fileMap[field] = val instanceof FileList ? val[0]
                   : val instanceof File     ? val
                   : null;
    delete data[field];
  }
  const sanitizedData = sanitizeObject(data);
  try {
    for (const field of fileFields) {
      const file = fileMap[field];
      if (file) {
        const folder = ['galeria', 'depoimentos', 'servicos'].includes(collection) ? collection : 'misc';
        sanitizedData[field] = await uploadFile(file, folder);
      } else if (editingItem?.[field]) {
        sanitizedData[field] = editingItem[field];
      } else {
        delete sanitizedData[field];
      }
    }
    if (collection === 'galeria' && (!sanitizedData.foto_antes || !sanitizedData.foto_depois)) {
      throw new Error('Envie as duas fotos: antes e depois.');
    }
    const url    = editingItem ? `/${collection}/${editingItem.id}` : `/${collection}`;
    const method = editingItem ? 'PUT' : 'POST';
    const res    = await api.fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sanitizedData) });
    if (!res.ok) throw new Error(await res.text());
    const record = await res.json();
    await logAction(editingItem ? 'UPDATE' : 'CREATE', collection, record.id,
      `${editingItem ? 'Updated' : 'Created'} item in ${collection}`, currentUser);
    toast.success(editingItem ? 'Atualizado com sucesso!' : 'Criado com sucesso!');
    form.reset();
    if (setEditingItem) setEditingItem(null);
    if (onSuccess) onSuccess();
  } catch (error) {
    console.error(error);
    toast.error(`Erro ao salvar: ${error.message}`);
  }
};
