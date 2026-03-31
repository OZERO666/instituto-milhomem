import jwt from 'jsonwebtoken';
import pool from '../db/mysql.js';
import logger from '../utils/logger.js';
import sanitizeInput from '../lib/sanitizeInput.js';

// Middleware para sanitizar entradas
export const sanitizeMiddleware = (req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = sanitizeInput(req.body[key]);
    }
  }
  next();
};

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificação leve: apenas confirma que o usuário ainda existe
    const [rows] = await pool.execute(
      `SELECT id, name, email, role_id FROM users WHERE id = ?`,
      [decoded.id]
    );

    if (!rows[0]) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const baseUser = rows[0];

    // Permissões e role já estão no JWT — evita JOIN extra a cada requisição
    req.user = {
      id: baseUser.id,
      name: baseUser.name,
      email: baseUser.email,
      role_id: baseUser.role_id,
      role_name: decoded.role_name || null,
      role_description: decoded.role_description || null,
      permissions: Array.isArray(decoded.permissions) ? decoded.permissions : [],
    };

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    res.status(401).json({ error: 'Token inválido' });
  }
};
