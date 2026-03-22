import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM depoimentos ORDER BY data DESC');
    res.json(rows);
  } catch (error) {
    logger.error('Depoimentos GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id, nome, servico, texto, foto, data } = req.body;
    const now = new Date();
    await pool.execute(
      'INSERT INTO depoimentos (id, nome, servico, texto, foto, data, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, nome, servico, texto, foto, data || now, now, now]
    );
    res.status(201).json({ message: 'Criado com sucesso' });
  } catch (error) {
    logger.error('Depoimentos POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, servico, texto, foto, data } = req.body;
    await pool.execute(
      'UPDATE depoimentos SET nome=?, servico=?, texto=?, foto=?, data=?, updated=? WHERE id=?',
      [nome, servico, texto, foto, data, new Date(), req.params.id]
    );
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('Depoimentos PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM depoimentos WHERE id=?', [req.params.id]);
    res.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    logger.error('Depoimentos DELETE error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
