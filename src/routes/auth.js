import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import pool from '../db/mysql.js';
import { comparePassword, generateToken } from '../utils/auth.js';
import logger from '../utils/logger.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Rate limit para login (protege contra brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                  // máximo 10 tentativas
  message: { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({ 
      error: 'Muitas tentativas. Tente novamente em 15 minutos.',
      retryAfter: Math.ceil((15 * 60 * 1000 - (Date.now() - req.rateLimit.resetTime)) / 1000)
    });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const [users] = await pool.execute(
      'SELECT id, name, email, password FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      logger.warn(`Tentativa de login falhou: email ${email} não encontrado`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = users[0];
    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      logger.warn(`Tentativa de login falhou: email ${email}, senha inválida`);
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = generateToken(user.id);

    logger.info(`Login bem-sucedido: user ${user.id} (${user.email})`);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Login error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    logger.error('Auth me error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
