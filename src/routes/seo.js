import { Router } from 'express';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission } from '../middleware/checkPermission.js';
import logger from '../utils/logger.js';
import { regenerateSitemap, SITEMAP_CACHE_TTL_MS } from './sitemap.js';

const router = Router();

// GET /seo-settings — lista todas as páginas (painel admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM seo_settings ORDER BY page_name ASC');
    res.json(rows);
  } catch (error) {
    logger.error('SEO GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /seo-settings/sitemap/regenerate — força nova geração do sitemap (admin)
router.post('/sitemap/regenerate', authMiddleware, checkPermission('dashboard', 'update'), async (_req, res) => {
  try {
    const result = await regenerateSitemap();

    res.json({
      message: 'Sitemap regenerado com sucesso',
      generated_at: new Date(result.generatedAt).toISOString(),
      cache_ttl_ms: SITEMAP_CACHE_TTL_MS,
      counts: result.stats,
    });
  } catch (error) {
    logger.error('SEO sitemap regenerate error:', error.message);
    res.status(500).json({ error: 'Erro ao regenerar sitemap' });
  }
});

// GET /seo-settings/:page_name — busca por página (frontend)
router.get('/:page_name', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM seo_settings WHERE page_name = ? LIMIT 1',
      [req.params.page_name]
    );
    if (!rows.length) return res.status(404).json({ error: 'Página não encontrada' });
    res.json(rows[0]);
  } catch (error) {
    logger.error('SEO GET by page_name error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /seo-settings/:id — atualiza SEO de uma página (admin, autenticado)
router.put('/:id', authMiddleware, checkPermission('dashboard', 'update'), async (req, res) => {
  try {
    const { meta_title, meta_description, keywords, og_image } = req.body;
    const now = new Date();

    const [result] = await pool.execute(
      `UPDATE seo_settings
       SET meta_title=?, meta_description=?, keywords=?, og_image=?, updated=?
       WHERE id=?`,
      [
        meta_title    || null,
        meta_description || null,
        keywords      || null,
        og_image      || null,
        now,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro SEO não encontrado' });
    }

    res.json({ message: 'SEO atualizado com sucesso' });
  } catch (error) {
    logger.error('SEO PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor', code: error.code });
  }
});

export default router;
