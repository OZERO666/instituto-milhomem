import React from 'react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog.jsx';

const UnsavedChangesDialog = ({ open, onConfirm, onCancel }) => (
  <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel?.(); }}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Alterações não salvas</AlertDialogTitle>
        <AlertDialogDescription>
          Você tem alterações não salvas nesta aba. Se sair agora, elas serão perdidas.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel}>Continuar editando</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Sair sem salvar
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default UnsavedChangesDialog;
