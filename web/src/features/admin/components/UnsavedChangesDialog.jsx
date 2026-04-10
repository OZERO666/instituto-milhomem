import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog.jsx';

const UnsavedChangesDialog = ({ open, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel?.(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.dialog.unsaved_title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.dialog.unsaved_description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t('admin.dialog.continue_editing')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('admin.dialog.leave_without_saving')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnsavedChangesDialog;
