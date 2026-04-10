import React from 'react';
import { useTranslation } from 'react-i18next';
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
}) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel?.(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.dialog.delete_title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ?? t('admin.dialog.delete_description', { title: title || '' })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>{t('admin.dialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('admin.dialog.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteDialog;
