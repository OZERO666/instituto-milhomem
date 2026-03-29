import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = Router();

const ensureTable = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS sobre_config (
      id VARCHAR(36) PRIMARY KEY,
      hero_title TEXT,
      hero_subtitle TEXT,
      hero_image TEXT,
      about_title TEXT,
      about_text TEXT,
      about_image TEXT,
      \`values\` JSON,
      \`team\` JSON,
      technology_title TEXT,
      technology_text TEXT,
      technology_image TEXT,
      created DATETIME,
      updated DATETIME
    )
  `);
};

router.get('/', async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await pool.execute('SELECT * FROM sobre_config LIMIT 1');
    return res.json(rows[0] || {});
  } catch (error) {
    logger.error('SobreConfig GET error:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    await ensureTable();

    const [existing] = await pool.execute('SELECT id FROM sobre_config LIMIT 1');
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já existe uma configuração Sobre. Use PUT para atualizar.' });
    }

    const id = uuidv4();
    const now = new Date();
    const {
      hero_title,
      hero_subtitle,
      hero_image,
      about_title,
      about_text,
      about_image,
      values,
      team,
      technology_title,
      technology_text,
      technology_image,
    } = req.body;

    await pool.execute(
      `INSERT INTO sobre_config (
        id, hero_title, hero_subtitle, hero_image,
        about_title, about_text, about_image,
        \`values\`, \`team\`,
        technology_title, technology_text, technology_image,
        created, updated
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        hero_title || null,
        hero_subtitle || null,
        hero_image || null,
        about_title || null,
        about_text || null,
        about_image || null,
        JSON.stringify(values || []),
        JSON.stringify(team || []),
        technology_title || null,
        technology_text || null,
        technology_image || null,
        now,
        now,
      ]
    );

    const [rows] = await pool.execute('SELECT * FROM sobre_config WHERE id = ?', [id]);
    return res.status(201).json(rows[0]);
  } catch (error) {
    logger.error('SobreConfig POST error:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    await ensureTable();

    const {
      hero_title,
      hero_subtitle,
      hero_image,
      about_title,
      about_text,
      about_image,
      values,
      team,
      technology_title,
      technology_text,
      technology_image,
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE sobre_config SET
        hero_title = ?,
        hero_subtitle = ?,
        hero_image = ?,
        about_title = ?,
        about_text = ?,
        about_image = ?,
        \`values\` = ?,
        \`team\` = ?,
        technology_title = ?,
        technology_text = ?,
        technology_image = ?,
        updated = ?
      WHERE id = ?`,
      [
        hero_title || null,
        hero_subtitle || null,
        hero_image || null,
        about_title || null,
        about_text || null,
        about_image || null,
        JSON.stringify(values || []),
        JSON.stringify(team || []),
        technology_title || null,
        technology_text || null,
        technology_image || null,
        new Date(),
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Configuração Sobre não encontrada' });
    }

    const [rows] = await pool.execute('SELECT * FROM sobre_config WHERE id = ?', [req.params.id]);
    return res.json(rows[0]);
  } catch (error) {
    logger.error('SobreConfig PUT error:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
