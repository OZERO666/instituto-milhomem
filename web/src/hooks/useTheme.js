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

const RESPONSIVE_DEFAULTS = {
  container_max_width: 1280,
  container_padding_mobile: 16,
  container_padding_tablet: 24,
  container_padding_desktop: 32,
  section_padding_mobile: 48,
  section_padding_tablet: 64,
  section_padding_desktop: 80,
  hero_min_height_mobile: 560,
  hero_min_height_desktop: 980,
  mobile_type_scale: 100,
  show_decorations_mobile: 'true',
};

const clampNumber = (value, fallback, min, max) => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
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

    const containerMaxWidth = clampNumber(
      settings.container_max_width,
      RESPONSIVE_DEFAULTS.container_max_width,
      960,
      1680,
    );
    const containerPaddingMobile = clampNumber(
      settings.container_padding_mobile,
      RESPONSIVE_DEFAULTS.container_padding_mobile,
      8,
      48,
    );
    const containerPaddingTablet = clampNumber(
      settings.container_padding_tablet,
      RESPONSIVE_DEFAULTS.container_padding_tablet,
      12,
      64,
    );
    const containerPaddingDesktop = clampNumber(
      settings.container_padding_desktop,
      RESPONSIVE_DEFAULTS.container_padding_desktop,
      16,
      80,
    );
    const sectionPaddingMobile = clampNumber(
      settings.section_padding_mobile,
      RESPONSIVE_DEFAULTS.section_padding_mobile,
      24,
      120,
    );
    const sectionPaddingTablet = clampNumber(
      settings.section_padding_tablet,
      RESPONSIVE_DEFAULTS.section_padding_tablet,
      32,
      140,
    );
    const sectionPaddingDesktop = clampNumber(
      settings.section_padding_desktop,
      RESPONSIVE_DEFAULTS.section_padding_desktop,
      40,
      180,
    );
    const heroMinHeightMobile = clampNumber(
      settings.hero_min_height_mobile,
      RESPONSIVE_DEFAULTS.hero_min_height_mobile,
      420,
      900,
    );
    const heroMinHeightDesktop = clampNumber(
      settings.hero_min_height_desktop,
      RESPONSIVE_DEFAULTS.hero_min_height_desktop,
      640,
      1200,
    );
    const mobileTypeScale = clampNumber(
      settings.mobile_type_scale,
      RESPONSIVE_DEFAULTS.mobile_type_scale,
      85,
      120,
    );

    root.style.setProperty('--container-max-w', `${containerMaxWidth}px`);
    root.style.setProperty('--container-pad-x-mobile', `${containerPaddingMobile}px`);
    root.style.setProperty('--container-pad-x-tablet', `${containerPaddingTablet}px`);
    root.style.setProperty('--container-pad-x-desktop', `${containerPaddingDesktop}px`);
    root.style.setProperty('--section-pad-y-mobile', `${sectionPaddingMobile}px`);
    root.style.setProperty('--section-pad-y-tablet', `${sectionPaddingTablet}px`);
    root.style.setProperty('--section-pad-y-desktop', `${sectionPaddingDesktop}px`);
    root.style.setProperty('--hero-min-h-mobile', `${heroMinHeightMobile}px`);
    root.style.setProperty('--hero-min-h-desktop', `${heroMinHeightDesktop}px`);
    root.style.setProperty('--mobile-type-scale', `${mobileTypeScale / 100}`);
    root.style.setProperty('--mobile-decor-opacity', settings.show_decorations_mobile === 'false' ? '0' : '1');
  }, [settings]);
}
