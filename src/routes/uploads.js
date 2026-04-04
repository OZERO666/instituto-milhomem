// src/routes/uploads.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import sanitizeHtml from 'sanitize-html';
import { authMiddleware } from '../middleware/auth.js';
import '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ─── Tipos permitidos ──────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

// ─── Tags SVG seguras (sem <script>, <foreignObject>, <iframe>, <use> externo) ─
const SVG_SAFE_TAGS = [
  'svg','g','path','circle','ellipse','line','polyline','polygon','rect',
  'text','tspan','textPath','defs','symbol','clipPath','mask',
  'marker','pattern','linearGradient','radialGradient','stop',
  'animate','animateMotion','animateTransform','mpath','set',
  'filter','feBlend','feColorMatrix','feComponentTransfer','feComposite',
  'feConvolveMatrix','feDiffuseLighting','feDisplacementMap','feFlood',
  'feFuncA','feFuncB','feFuncG','feFuncR','feGaussianBlur',
  'feMerge','feMergeNode','feMorphology','feOffset','fePointLight',
  'feSpecularLighting','feSpotLight','feTile','feTurbulence','title','desc',
  // <use> é permitido mas com href restrito apenas a referências internas (#id)
  'use',
];

// ─── Sanitiza SVG removendo XSS (scripts, event handlers, refs externas) ──────
function sanitizeSvg(buffer) {
  const raw = buffer.toString('utf-8');

  // Valida estrutura mínima — rejeita se não contiver tag <svg
  if (!/<svg[\s>]/i.test(raw)) {
    throw new Error('O arquivo não é um SVG válido.');
  }

  const sanitized = sanitizeHtml(raw, {
    allowedTags: SVG_SAFE_TAGS,
    allowedAttributes: {
      '*': [
        // Estrutura
        'id','class','style','tabindex','role',
        'aria-label','aria-labelledby','aria-describedby',
        // Viewport / dimensões
        'x','y','x1','y1','x2','y2','cx','cy','r','rx','ry',
        'width','height','viewBox','preserveAspectRatio',
        // Formas
        'd','points',
        // Pintura / traço
        'fill','stroke','stroke-width','stroke-linecap','stroke-linejoin',
        'stroke-dasharray','stroke-dashoffset','stroke-opacity','fill-opacity',
        'opacity','color','display','visibility','overflow','fill-rule','clip-rule',
        // Transformações
        'transform','clip-path','mask','filter',
        // Texto
        'dx','dy','font-size','font-family','font-weight','font-style',
        'text-anchor','dominant-baseline','alignment-baseline',
        'letter-spacing','word-spacing','text-decoration',
        // Gradientes
        'gradientUnits','gradientTransform','spreadMethod',
        'offset','stop-color','stop-opacity','fx','fy','fr',
        // Padrões / clipPath / filtros
        'patternUnits','patternContentUnits','patternTransform',
        'clipPathUnits','maskUnits','maskContentUnits',
        'filterUnits','primitiveUnits',
        // Primitivas de filtro
        'in','in2','result','stdDeviation','type','values','mode','operator',
        'k1','k2','k3','k4','order','kernelMatrix','edgeMode',
        'baseFrequency','numOctaves','seed','stitchTiles',
        'scale','xChannelSelector','yChannelSelector',
        'flood-color','flood-opacity','lighting-color',
        'diffuseConstant','specularConstant','specularExponent','surfaceScale',
        'azimuth','elevation','pointsAtX','pointsAtY','pointsAtZ','limitingConeAngle',
        // Marcadores
        'marker-start','marker-mid','marker-end',
        'marker-units','markerWidth','markerHeight','orient','refX','refY',
        // Animação
        'begin','dur','end','repeatCount','repeatDur',
        'calcMode','keyTimes','keySplines','from','to','by',
        'attributeName','attributeType','additive','accumulate',
        'path','keyPoints','rotate',
        // Renderização
        'shape-rendering','text-rendering','image-rendering',
        'color-interpolation','color-rendering',
        // Namespace
        'xmlns','version',
      ],
      // <use> só pode referenciar elementos internos (#id) — nunca URLs externas
      'use': ['href', 'xlink:href'],
    },
    // Esquemas permitidos em atributos — exclui javascript: e data: URIs
    allowedSchemes: ['https', 'http'],
    allowedSchemesAppliedToAttributes: ['href', 'src', 'xlink:href', 'action'],
    transformTags: {
      // Garante que <use> aponta apenas para referências internas (#id)
      use: (tagName, attribs) => {
        const href = attribs.href || attribs['xlink:href'] || '';
        if (href && !href.startsWith('#')) {
          // Referência externa: neutraliza o elemento
          return { tagName: 'g', attribs: { id: attribs.id, class: attribs.class } };
        }
        return { tagName, attribs };
      },
    },
    disallowedTagsMode: 'discard',
  });

  if (!sanitized || sanitized.trim().length === 0) {
    throw new Error('O SVG ficou vazio após sanitização — verifique o conteúdo do arquivo.');
  }

  return Buffer.from(sanitized, 'utf-8');
}

// ─── Rota de upload ────────────────────────────────────────────────────────────
router.post('/upload/:folder', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { folder } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo obrigatório' });
    }

    if (!ALLOWED_MIME_TYPES.has(req.file.mimetype)) {
      return res.status(415).json({
        error: `Tipo de arquivo não permitido: ${req.file.mimetype}. Use JPEG, PNG, WebP, GIF ou SVG.`,
      });
    }

    const isSvg = req.file.mimetype === 'image/svg+xml';
    let fileBuffer = req.file.buffer;

    if (isSvg) {
      try {
        fileBuffer = sanitizeSvg(fileBuffer);
      } catch (sanitizeErr) {
        return res.status(422).json({ error: `SVG inválido: ${sanitizeErr.message}` });
      }
    }

    const targetFolder = `instituto-milhomem/${folder}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder:        targetFolder,
        resource_type: 'image',
        // SVG não suporta as mesmas transformações de raster — sem fetch_format/quality
        ...(isSvg ? { format: 'svg' } : {}),
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary error:', error);
          return res.status(500).json({ error: 'Erro ao enviar para Cloudinary' });
        }
        return res.json({ url: result.secure_url });
      },
    );

    stream.end(fileBuffer);
  } catch (err) {
    console.error('Upload route error:', err);
    res.status(500).json({ error: 'Erro inesperado no upload' });
  }
});

export default router;