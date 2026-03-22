import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM contato_config LIMIT 1');
    res.json(rows[0] || {});
  } catch (error) {
    logger.error('ContatoConfig GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id, email, telefone, whatsapp, mensagem_whatsapp, endereco, dias_funcionamento, horario, latitude, longitude, zoom } = req.body;
    const now = new Date();
    await pool.execute(
      'INSERT INTO contato_config (id, email, telefone, whatsapp, mensagem_whatsapp, endereco, dias_funcionamento, horario, latitude, longitude, zoom, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, email, telefone, whatsapp, mensagem_whatsapp, endereco, dias_funcionamento, horario, latitude, longitude, zoom || 0, now, now]
    );
    res.status(201).json({ message: 'Criado com sucesso' });
  } catch (error) {
    logger.error('ContatoConfig POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { email, telefone, whatsapp, mensagem_whatsapp, endereco, dias_funcionamento, horario, latitude, longitude, zoom } = req.body;
    await pool.execute(
      'UPDATE contato_config SET email=?, telefone=?, whatsapp=?, mensagem_whatsapp=?, endereco=?, dias_funcionamento=?, horario=?, latitude=?, longitude=?, zoom=?, updated=? WHERE id=?',
      [email, telefone, whatsapp, mensagem_whatsapp, endereco, dias_funcionamento, horario, latitude, longitude, zoom, new Date(), req.params.id]
    );
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('ContatoConfig PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
