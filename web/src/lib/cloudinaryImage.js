const CLOUDINARY_HOST_RE = /^https?:\/\/res\.cloudinary\.com\//i;

const isCloudinaryUrl = (url) => CLOUDINARY_HOST_RE.test(String(url || ''));

const sanitizeToken = (value) => String(value).replace(/[^a-zA-Z0-9:_-]/g, '');

const buildTransformation = ({
  width,
  height,
  aspectRatio,
  crop = 'fill',
  gravity = 'auto',
  quality = 'auto',
  format = 'auto',
  dpr = 'auto',
} = {}) => {
  const tokens = [];
  if (crop) tokens.push(`c_${sanitizeToken(crop)}`);
  if (gravity) tokens.push(`g_${sanitizeToken(gravity)}`);
  if (aspectRatio) tokens.push(`ar_${sanitizeToken(aspectRatio)}`);
  if (width) tokens.push(`w_${Math.round(width)}`);
  if (height) tokens.push(`h_${Math.round(height)}`);
  if (dpr) tokens.push(`dpr_${sanitizeToken(dpr)}`);
  if (quality) tokens.push(`q_${sanitizeToken(quality)}`);
  if (format) tokens.push(`f_${sanitizeToken(format)}`);
  return tokens.join(',');
};

export const buildCloudinaryUrl = (url, opts = {}) => {
  if (!url || !isCloudinaryUrl(url)) return url;
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const base = url.slice(0, idx + marker.length);
  const rest = url.slice(idx + marker.length);
  const transformation = buildTransformation(opts);
  if (!transformation) return url;

  return `${base}${transformation}/${rest}`;
};

export const buildCloudinarySrcSet = (url, widths = [], opts = {}) => {
  if (!url || !isCloudinaryUrl(url) || !Array.isArray(widths) || widths.length === 0) {
    return undefined;
  }

  return widths
    .filter((w) => Number.isFinite(w) && w > 0)
    .map((w) => `${buildCloudinaryUrl(url, { ...opts, width: w })} ${w}w`)
    .join(', ');
};

export const getCloudinaryResponsiveImageProps = (
  url,
  { widths = [], sizes, fallbackWidth, ...opts } = {},
) => {
  if (!url) return { src: url };
  if (!isCloudinaryUrl(url)) return { src: url, sizes };

  const safeWidths = widths.filter((w) => Number.isFinite(w) && w > 0);
  const widthForSrc = fallbackWidth || safeWidths[safeWidths.length - 1];

  return {
    src: buildCloudinaryUrl(url, { ...opts, width: widthForSrc }),
    srcSet: buildCloudinarySrcSet(url, safeWidths, opts),
    sizes,
  };
};
