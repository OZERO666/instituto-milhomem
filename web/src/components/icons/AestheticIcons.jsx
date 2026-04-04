/**
 * AestheticIcons.jsx
 * Ícones SVG customizados para procedimentos estéticos e transplante capilar.
 * Uso: <HairTransplantIcon className="w-8 h-8" />
 * viewBox 0 0 48 48. As cores são fixas conforme o manual visual.
 */

import React from 'react';

// Factory: envolve paths em <svg viewBox="0 0 48 48">
const svg48 = (content) =>
  ({ className = 'w-6 h-6', ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {content}
    </svg>
  );

/* ── 1. Transplante Capilar (cabeça + fios) ──────────────────────────────── */
export const HairTransplantIcon = svg48(
  <>
    <circle cx="24" cy="24" r="16" fill="#F1F5F9" stroke="#1E40AF" strokeWidth="2"/>
    <path d="M18 18C18 18 20 14 24 14C28 14 30 18 30 18C30 18 26 22 24 22C22 22 18 18 18 18Z" fill="#1E40AF"/>
    <path d="M16 22C16 22 20 18 24 18C28 18 32 22 32 22C32 22 28 26 24 26C20 26 16 22 16 22Z" fill="#1E40AF"/>
    <path d="M18 26C18 26 22 30 26 30C30 30 34 26 34 26C34 26 30 22 26 22C22 22 18 26 18 26Z" fill="#1E40AF"/>
  </>
);

/* ── 2. Transplante Capilar – Técnica FUE ────────────────────────────────── */
export const HairFUEIcon = svg48(
  <>
    <circle cx="24" cy="24" r="16" fill="#F1F5F9" stroke="#1E40AF" strokeWidth="2"/>
    <circle cx="20" cy="20" r="2" fill="#1E40AF"/>
    <circle cx="28" cy="20" r="2" fill="#1E40AF"/>
    <circle cx="20" cy="28" r="2" fill="#1E40AF"/>
    <circle cx="28" cy="28" r="2" fill="#1E40AF"/>
    <path d="M18 16C18 16 24 12 30 16" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
  </>
);

/* ── 3. Transplante Capilar – Técnica DHI (caneta) ───────────────────────── */
export const HairDHIIcon = svg48(
  <>
    <circle cx="24" cy="24" r="16" fill="#F1F5F9" stroke="#1E40AF" strokeWidth="2"/>
    <path d="M20 28L24 24L28 28" stroke="#1E40AF" strokeWidth="2" strokeLinecap="round"/>
    <rect x="22" y="16" width="4" height="8" fill="#1E40AF"/>
    <circle cx="24" cy="14" r="2" fill="#1E40AF"/>
  </>
);

/* ── 4. Transplante de Barba ─────────────────────────────────────────────── */
export const BeardTransplantIcon = svg48(
  <>
    <path d="M24 12C24 12 16 20 16 30C16 40 24 46 24 46C24 46 32 40 32 30C32 20 24 12 24 12Z" fill="#F1F5F9" stroke="#1E40AF" strokeWidth="2"/>
    <path d="M20 28C20 28 22 22 24 22C26 22 28 28 28 28C28 28 26 32 24 32C22 32 20 28 20 28Z" fill="#1E40AF"/>
    <path d="M20 32C20 32 22 36 24 36C26 36 28 32 28 32" fill="#1E40AF"/>
  </>
);

/* ── 5. Transplante de Sobrancelhas ─────────────────────────────────────── */
export const EyebrowTransplantIcon = svg48(
  <>
    <path d="M24 12C16 12 12 20 12 26C12 32 16 36 24 36C32 36 36 32 36 26C36 20 32 12 24 12Z" fill="#F1F5F9" stroke="#1E40AF" strokeWidth="2"/>
    <path d="M18 24L20 26L22 24L24 26L26 24L28 26L30 24" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round"/>
    <path d="M18 30L20 32L22 30L24 32L26 30L28 32L30 30" stroke="#1E40AF" strokeWidth="3" strokeLinecap="round"/>
  </>
);

/* ── 6. Estética da Pele – Rosto / Limpeza ──────────────────────────────── */
export const SkinCleansingIcon = svg48(
  <>
    <circle cx="24" cy="24" r="16" fill="#F1F5F9" stroke="#7C3AED" strokeWidth="2"/>
    <path d="M18 26C18 26 20 30 24 30C28 30 30 26 30 26" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 22C18 22 20 18 24 18C28 18 30 22 30 22" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 28L24 32L28 28" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
  </>
);

/* ── 7. Peeling / Laser de Pele ─────────────────────────────────────────── */
export const PeelingLaserIcon = svg48(
  <>
    <rect x="12" y="12" width="24" height="24" rx="6" fill="#F1F5F9" stroke="#DC2626" strokeWidth="2"/>
    <path d="M18 18L24 24L30 18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 24L24 18L30 24" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 24L18 30L24 36L30 30L24 24Z" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </>
);

/* ── 8. Hidratação / Nutrição da Pele ───────────────────────────────────── */
export const SkinHydrationIcon = svg48(
  <>
    <path d="M24 8C16 8 10 14 10 26C10 38 16 44 24 44C32 44 38 38 38 26C38 14 32 8 24 8Z" fill="#F1F5F9" stroke="#16A34A" strokeWidth="2"/>
    <path d="M20 22C20 22 22 26 24 26C26 26 28 22 28 22C28 22 26 18 24 18C22 18 20 22 20 22Z" fill="#16A34A"/>
    <path d="M20 30C20 30 22 34 24 34C26 34 28 30 28 30" fill="#16A34A"/>
  </>
);

/* ── 9. Rejuvenescimento da Pele (micro-ar) ─────────────────────────────── */
export const SkinRejuvenationIcon = svg48(
  <>
    <circle cx="24" cy="24" r="16" fill="#F1F5F9" stroke="#059669" strokeWidth="2"/>
    <path d="M16 24C16 24 18 20 24 20C30 20 32 24 32 24" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 18C18 18 24 14 30 18" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 30C18 30 24 34 30 30" stroke="#059669" strokeWidth="2" strokeLinecap="round"/>
  </>
);

/* ── 10. Antes e Depois ─────────────────────────────────────────────────── */
export const BeforeAfterIcon = svg48(
  <>
    <rect x="8" y="12" width="16" height="24" rx="2" fill="#F1F5F9" stroke="#64748B" strokeWidth="2"/>
    <rect x="28" y="12" width="16" height="24" rx="2" fill="#F1F5F9" stroke="#64748B" strokeWidth="2"/>
    <path d="M16 24L20 20" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 28L20 32" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 20L36 24" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    <path d="M32 32L36 28" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
  </>
);

/* ── 11. Consulta Médica / Avaliação ────────────────────────────────────── */
export const MedicalConsultIcon = svg48(
  <>
    <circle cx="24" cy="24" r="16" fill="#F1F5F9" stroke="#0EA5E9" strokeWidth="2"/>
    <path d="M18 24L22 28L30 20" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 20C18 20 20 16 24 16C28 16 30 20 30 20" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 28L24 32L28 28" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round"/>
  </>
);

/* ── 12. Resultado Natural (check capilar) ──────────────────────────────── */
export const NaturalResultIcon = svg48(
  <>
    <path d="M24 8C16 8 8 16 8 26C8 36 16 44 24 44C32 44 40 36 40 26C40 16 32 8 24 8Z" fill="#F1F5F9" stroke="#16A34A" strokeWidth="2"/>
    <path d="M18 24L21 27L30 18" stroke="#16A34A" strokeWidth="3" strokeLinecap="round"/>
  </>
);

/* ── Exporte agrupado ────────────────────────────────────────────────────── */
export const aestheticIcons = {
  HairTransplantIcon,
  HairFUEIcon,
  HairDHIIcon,
  BeardTransplantIcon,
  EyebrowTransplantIcon,
  SkinCleansingIcon,
  PeelingLaserIcon,
  SkinHydrationIcon,
  SkinRejuvenationIcon,
  BeforeAfterIcon,
  MedicalConsultIcon,
  NaturalResultIcon,
};

export default aestheticIcons;
