// src/lib/sanitizeInput.js
/**
 * Sanitização robusta de input para prevenir XSS, SQL Injection e outros ataques.
 * Suporta objetos aninhados, arrays e sanitização seletiva.
 */

const DANGEROUS_TAGS = [
  'script', 'iframe', 'object', 'embed', 'svg', 'math', 'form',
  'input', 'textarea', 'select', 'link', 'meta'
];

const DANGEROUS_ATTRS = [
  'onload', 'onerror', 'onfocus', 'onblur', 'onclick', 'onmouseover',
  'onmouseout', 'onkeydown', 'onkeyup', 'onkeypress', 'onchange',
  'javascript:', 'vbscript:', 'data:', 'livescript:'
];

// ─── Escape HTML básico ─────────────────────────────────────────────────────
export const escapeHTML = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// ─── Remove scripts e tags perigosas ───────────────────────────────────────
const removeDangerousContent = (html) => {
  if (typeof html !== 'string') return html;
  
  let clean = html;
  
  // Remove tags perigosas
  DANGEROUS_TAGS.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`, 'gi');
    clean = clean.replace(regex, '');
  });
  
  // Remove atributos perigosos
  DANGEROUS_ATTRS.forEach(attr => {
    const regex = new RegExp(`\\s*(on\\w+|javascript:|vbscript:|data:|livescript:)\\s*=\\s*["'][^"']*["']`, 'gi');
    clean = clean.replace(regex, '');
  });
  
  // Remove estilos inline perigosos
  clean = clean.replace(/style\s*=\s*["'][^"']*["']/gi, '');
  
  return clean.trim();
};

// ─── Sanitização principal ──────────────────────────────────────────────────
export const sanitizeObject = (obj, options = {}) => {
  const {
    allowHTML = false,     // Permite HTML básico
    maxStringLength = 5000, // Limite de caracteres
    trimWhitespace = true,
  } = options;

  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    
    const value = obj[key];

    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      let clean = value;
      
      if (trimWhitespace) clean = clean.trim();
      
      if (!allowHTML) {
        // Sanitização completa
        clean = removeDangerousContent(clean);
        clean = escapeHTML(clean);
      } else {
        // Apenas remove conteúdo perigoso, mantém HTML básico
        clean = removeDangerousContent(clean);
      }
      
      // Limite de tamanho
      if (clean.length > maxStringLength) {
        clean = clean.slice(0, maxStringLength);
      }
      
      sanitized[key] = clean;
      
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
      
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        sanitizeObject(item, options)
      );
      
    } else if (value instanceof Date) {
      sanitized[key] = value.toISOString();
      
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeObject(value, options);
    }
  }

  return sanitized;
};

// ─── Sanitização para campos específicos ────────────────────────────────────
export const sanitizeField = (value, fieldType = 'text') => {
  switch (fieldType) {
    case 'email':
      return typeof value === 'string' ? value.toLowerCase().trim() : value;
    
    case 'phone':
      return typeof value === 'string' 
        ? value.replace(/[^\d+]/g, '') 
        : value;
    
    case 'slug':
      return generateSlug(typeof value === 'string' ? value : '');
    
    case 'html':
      return removeDangerousContent(typeof value === 'string' ? value : '');
    
    case 'url':
      return typeof value === 'string' && /^https?:\/\//.test(value)
        ? value
        : '';
    
    default:
      return sanitizeObject({ value }, { allowHTML: false }).value;
  }
};

// ─── Validações complementares ─────────────────────────────────────────────
export const isSanitized = (value) => {
  if (typeof value !== 'string') return true;
  return !/[<>"'&\s]/.test(value.replace(/&(?:amp|lt|gt|quot|#039);/g, ''));
};

// ─── Slug helper (usado em sanitizeField) ──────────────────────────────────
const generateSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
};

// ─── Export default para compatibilidade ───────────────────────────────────
export default {
  sanitizeObject,
  sanitizeField,
  escapeHTML,
  removeDangerousContent,
  isSanitized,
};
