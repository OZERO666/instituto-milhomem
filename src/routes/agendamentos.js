import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM agendamentos ORDER BY created DESC');
    res.json(rows);
  } catch (error) {
    logger.error('Agendamentos GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, nome, email, telefone, tipo_servico, mensagem } = req.body;
    const now = new Date();
    await pool.execute(
      'INSERT INTO agendamentos (id, nome, email, telefone, tipo_servico, mensagem, lido, created, updated) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)',
      [id, nome, email, telefone, tipo_servico, mensagem, now, now]
    );
    res.status(201).json({ message: 'Agendamento recebido com sucesso' });
  } catch (error) {
    logger.error('Agendamentos POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { lido } = req.body;
    await pool.execute(
      'UPDATE agendamentos SET lido=?, updated=? WHERE id=?',
      [lido, new Date(), req.params.id]
    );
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('Agendamentos PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM agendamentos WHERE id=?', [req.params.id]);
    res.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    logger.error('Agendamentos DELETE error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
