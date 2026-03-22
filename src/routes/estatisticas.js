import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM estatisticas LIMIT 1');
    res.json(rows[0] || {});
  } catch (error) {
    logger.error('Estatisticas GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { id, experiencia, pacientes, procedimentos, satisfacao } = req.body;
    const now = new Date();
    await pool.execute(
      'INSERT INTO estatisticas (id, experiencia, pacientes, procedimentos, satisfacao, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, experiencia, pacientes, procedimentos, satisfacao, now, now]
    );
    res.status(201).json({ message: 'Criado com sucesso' });
  } catch (error) {
    logger.error('Estatisticas POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { experiencia, pacientes, procedimentos, satisfacao } = req.body;
    await pool.execute(
      'UPDATE estatisticas SET experiencia=?, pacientes=?, procedimentos=?, satisfacao=?, updated=? WHERE id=?',
      [experiencia, pacientes, procedimentos, satisfacao, new Date(), req.params.id]
    );
    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('Estatisticas PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
