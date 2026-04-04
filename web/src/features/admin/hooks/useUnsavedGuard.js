import { useState, useCallback, useRef } from 'react';

/**
 * Guards tab navigation when there are unsaved form changes.
 *
 * @param {boolean} isDirty - true when any watched form has unsaved changes
 * @returns {{ guardTab, showDialog, confirmLeave, cancelLeave }}
 *
 * Usage in AdminDashboard:
 *   const anyDirty = [form1, form2, ...].some(f => f.formState.isDirty);
 *   const { guardTab, showDialog, confirmLeave, cancelLeave } = useUnsavedGuard(anyDirty);
 *   <Tabs onValueChange={(tab) => guardTab(tab, setActiveTab)} ...>
 *   <UnsavedChangesDialog open={showDialog} onConfirm={confirmLeave} onCancel={cancelLeave} />
 */
export function useUnsavedGuard(isDirty) {
  const [showDialog, setShowDialog] = useState(false);
  const pendingRef = useRef(null); // { tab, setActiveTab }

  const guardTab = useCallback((tab, setActiveTab) => {
    if (isDirty) {
      pendingRef.current = { tab, setActiveTab };
      setShowDialog(true);
    } else {
      setActiveTab(tab);
    }
  }, [isDirty]);

  const confirmLeave = useCallback(() => {
    if (pendingRef.current) {
      pendingRef.current.setActiveTab(pendingRef.current.tab);
      pendingRef.current = null;
    }
    setShowDialog(false);
  }, []);

  const cancelLeave = useCallback(() => {
    pendingRef.current = null;
    setShowDialog(false);
  }, []);

  return { guardTab, showDialog, confirmLeave, cancelLeave };
}
