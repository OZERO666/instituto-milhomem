import React, { useEffect, useMemo, useState } from 'react';

const phosphorIconModules = import.meta.glob('/node_modules/@phosphor-icons/react/dist/csr/*.es.js');
const iconCache = new Map();
const FALLBACK_ICON = 'Sparkle';

const normalizePhosphorIconName = (name) => {
  if (!name) return null;

  const sanitizedName = String(name).trim().replace(/Icon$/i, '');
  if (!sanitizedName) return null;

  if (/^[A-Z][A-Za-z0-9]*$/.test(sanitizedName)) {
    return sanitizedName;
  }

  return sanitizedName
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join('');
};

const getIconModulePath = (iconName) => (
  iconName ? `/node_modules/@phosphor-icons/react/dist/csr/${iconName}.es.js` : null
);

const resolveIconExport = (iconModule) => {
  if (!iconModule) return null;
  // Rollup minifies export names in production, so we cannot rely on named lookups.
  // Instead, take the first exported value that is a React forwardRef / function component.
  for (const val of Object.values(iconModule)) {
    if (typeof val === 'function') return val;
  }
  return null;
};

const loadIcon = async (requestedName) => {
  const normalizedName = normalizePhosphorIconName(requestedName) ?? FALLBACK_ICON;
  const requestedPath = getIconModulePath(normalizedName);
  const fallbackPath = getIconModulePath(FALLBACK_ICON);

  if (requestedPath && iconCache.has(requestedPath)) {
    return iconCache.get(requestedPath);
  }

  const moduleLoader = (requestedPath && phosphorIconModules[requestedPath])
    || phosphorIconModules[fallbackPath];

  if (!moduleLoader) {
    return null;
  }

  const iconModule = await moduleLoader();
  const resolvedIcon = resolveIconExport(iconModule);

  if (resolvedIcon) {
    iconCache.set(requestedPath ?? fallbackPath, resolvedIcon);
  }

  return resolvedIcon;
};

const PhosphorIcon = ({ name, ...props }) => {
  const normalizedName = useMemo(
    () => normalizePhosphorIconName(name) ?? FALLBACK_ICON,
    [name],
  );

  const [IconComponent, setIconComponent] = useState(() => {
    const cachedPath = getIconModulePath(normalizedName);
    return cachedPath ? iconCache.get(cachedPath) ?? null : null;
  });

  useEffect(() => {
    let isMounted = true;

    loadIcon(normalizedName).then((resolvedIcon) => {
      if (isMounted) {
        setIconComponent(() => resolvedIcon);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [normalizedName]);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent {...props} />;
};

export default PhosphorIcon;