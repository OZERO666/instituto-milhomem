import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
    res.json(rows);
  } catch (error) {
    logger.error('AuditLogs GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id, action_type, collection_name, record_id, details } = req.body;
    const now = new Date();
    await pool.execute(
      'INSERT INTO audit_logs (id, action_type, collection_name, record_id, user_id, details, timestamp, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, action_type, collection_name, record_id, req.user.id, details, now, now, now]
    );
    res.status(201).json({ message: 'Log registrado' });
  } catch (error) {
    logger.error('AuditLogs POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
