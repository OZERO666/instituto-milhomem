import React from 'react';
import usePermission from '@/hooks/usePermission.js';

const CanAccess = ({ resource, action = 'read', fallback = null, children }) => {
  const { canAccess } = usePermission();

  if (!canAccess(resource, action)) {
    return fallback;
  }

  return children;
};

export default CanAccess;
