// src/main.js
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';

import heroConfigRoutes from './routes/hero-config.js';
import routes from './routes/index.js';
import uploadRoutes from './routes/uploads.js';
import { errorMiddleware, writeLimiter, sanitizeMiddleware } from './middleware/index.js';
import logger from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR   = path.join(__dirname, '../../dist');

const app = express();

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
  logger.info('Interrupted');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received');
  await new Promise(resolve => setTimeout(resolve, 3000));
  logger.info('Exiting');
  process.exit();
});

// Compressão gzip — deve vir antes de qualquer rota
app.use(compression());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:              ["'self'"],
      scriptSrc:               ["'self'", "'unsafe-inline'"],
      styleSrc:                ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:                 ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:                  ["'self'", 'data:', 'blob:', 'https://horizons-cdn.hostinger.com', 'https://images.unsplash.com', 'https://res.cloudinary.com'],
      objectSrc:               ["'none'"],
      frameSrc:                ["'none'"],
      frameAncestors:          ["'none'"],
      connectSrc:              ["'self'"],
      formAction:              ["'self'"],
      baseUri:                 ["'self'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy:  false,
  crossOriginOpenerPolicy:    { policy: 'same-origin' },
  crossOriginResourcePolicy:  { policy: 'same-origin' },
  referrerPolicy:             { policy: 'strict-origin-when-cross-origin' },
  strictTransportSecurity: {
    maxAge:            31536000,
    includeSubDomains: true,
    preload:           true,
  },
  xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
  xFrameOptions:         { action: 'deny' },
}));

// Bloqueia indexação por mecanismos de busca
app.use((_req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  next();
});

// robots.txt — bloqueia todos os crawlers
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send('User-agent: *\nDisallow: /\n');
});

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting apenas para escrita (anti-spam)
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return writeLimiter(req, res, next);
  }
  next();
});
app.use(sanitizeMiddleware);

// Rotas da API — prefixadas com /api
app.use('/api', routes());
app.use('/api', uploadRoutes);
app.use('/api/hero-config', heroConfigRoutes);

// Serve o build do frontend (React SPA)
app.use(express.static(DIST_DIR));

// SPA fallback — qualquer rota não-API devolve o index.html
app.get(/^(?!\/api).*$/, (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Middleware de erro
app.use(errorMiddleware);

// 404 para rotas desconhecidas da API
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  logger.info(`🚀 API Server running on http://127.0.0.1:${port}`);
});

export default app;