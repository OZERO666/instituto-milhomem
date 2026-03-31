import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { sanitizeMiddleware, authMiddleware } from './auth.js';
import errorMiddleware from './error.js';

// Adicionar cabeçalhos de segurança
export const helmetMiddleware = helmet();

// Configurar rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por IP
});
export const rateLimitMiddleware = limiter;

// Exportações consolidadas
export { sanitizeMiddleware, authMiddleware, errorMiddleware };