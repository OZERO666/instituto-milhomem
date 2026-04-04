import React from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog.jsx';

/**
 * Controlled confirmation dialog for destructive actions.
 *
 * Usage — controlled (preferred):
 *   const [pending, setPending] = useState(null);
 *   <ConfirmDeleteDialog
 *     open={!!pending}
 *     title={pending?.title}
 *     onConfirm={() => { doDelete(pending); setPending(null); }}
 *     onCancel={() => setPending(null)}
 *   />
 */
const ConfirmDeleteDialog = ({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}) => (
  <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel?.(); }}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Excluir permanentemente?</AlertDialogTitle>
        <AlertDialogDescription>
          {description ?? (
            <>
              Esta ação não pode ser desfeita.{' '}
              {title && <><strong>{title}</strong> será excluído.</>}
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Excluir
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default ConfirmDeleteDialog;
