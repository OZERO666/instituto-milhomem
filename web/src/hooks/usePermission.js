import { useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';

const normalizePermission = (resource, action) => `${resource}:${action}`;

export default function usePermission() {
  const { currentUser } = useAuth();

  const permissionSet = useMemo(() => {
    const permissions = Array.isArray(currentUser?.permissions) ? currentUser.permissions : [];
    return new Set(permissions);
  }, [currentUser?.permissions]);

  const isSuperAdmin = currentUser?.role_name === 'super_admin';

  // useCallback evita nova referência a cada render — previne loop infinito
  // quando canAccess está em dependências de useCallback/useEffect
  const canAccess = useCallback((resource, action = 'read') => {
    if (!currentUser) return false;
    if (isSuperAdmin) return true;
    return permissionSet.has(normalizePermission(resource, action));
  }, [currentUser, isSuperAdmin, permissionSet]);

  return {
    currentUser,
    isSuperAdmin,
    canAccess,
    permissions: Array.from(permissionSet),
  };
}
