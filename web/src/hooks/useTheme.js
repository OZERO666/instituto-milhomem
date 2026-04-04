// src/hooks/useTheme.js
// Busca as cores configuradas no admin e aplica como CSS custom properties no :root
// Chamado UMA VEZ em App.jsx — sem re-renders desnecessários
import { useEffect } from 'react';
import { useSiteSettings } from './useSiteSettings';

// Converte cor hex (#RRGGBB ou #RGB) para string HSL sem o wrapper hsl()
// Ex: '#D4AF37' → '43 67% 53%'  (formato usado nas CSS vars do projeto)
function hexToHslString(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return null;

  let r, g, b;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16) / 255;
    g = parseInt(hex[2] + hex[2], 16) / 255;
    b = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  } else {
    return null;
  }

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Mapeamento: chave da setting → nome da CSS variable
const COLOR_VAR_MAP = {
  primary_color:    '--primary',
  secondary_color:  '--secondary',
  accent_color:     '--accent',
  background_color: '--background',
  foreground_color: '--foreground',
  muted_color:      '--muted',
  card_color:       '--card',
  border_color:     '--border',
};

export function useTheme() {
  const { settings } = useSiteSettings();

  useEffect(() => {
    if (!settings) return;

    const root = document.documentElement;
    for (const [key, cssVar] of Object.entries(COLOR_VAR_MAP)) {
      const hex = settings[key];
      if (!hex) continue;
      const hsl = hexToHslString(hex);
      if (hsl) root.style.setProperty(cssVar, hsl);
    }
  }, [settings]);
}
