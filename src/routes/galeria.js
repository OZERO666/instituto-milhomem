import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM galeria ORDER BY created DESC');
    res.json(rows);
  } catch (error) {
    logger.error('Galeria GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id, titulo, descricao, filtro, foto_antes, foto_depois, meses_pos_operatorio, tema_id } = req.body;
    const now = new Date();
    await pool.execute(
      'INSERT INTO galeria (id, titulo, descricao, filtro, foto_antes, foto_depois, meses_pos_operatorio, tema_id, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, titulo, descricao, filtro, foto_antes, foto_depois, meses_pos_operatorio || 0, tema_id, now, now]
    );
    res.status(201).json({ message: 'Criado com sucesso' });
  } catch (error) {
    logger.error('Galeria POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { titulo, descricao, filtro, foto_antes, foto_depois, meses_pos_operatorio, tema_id } = req.body;
    const now = new Date();
    await pool.execute(
      'UPDATE galeria SET titulo=?, descricao=?, filtro=?, foto_antes=?, foto_depois=?, meses_pos_operatorio=?, tema_id=?, updated=? WHERE id=?',
      [titulo, descricao, filtro, foto_antes, foto_depois, meses_pos_operatorio || 0, tema_id, now, req.params.id]
    );
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('Galeria PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.execute('DELETE FROM galeria WHERE id=?', [req.params.id]);
    res.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    logger.error('Galeria DELETE error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
