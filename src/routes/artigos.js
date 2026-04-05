import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../db/mysql.js';
import { authMiddleware } from '../middleware/auth.js';
import { checkPermission } from '../middleware/checkPermission.js';
import logger from '../utils/logger.js';

const router = Router();

// Schema for artigos workflow is formalized in 011_artigos_workflow_schema.sql
// Columns: status ENUM('draft','published','scheduled'), tags JSON, featured TINYINT

router.get('/', async (req, res) => {
  try {
    // ?published=1  → apenas publicados (frontend público)
    // ?status=draft → apenas rascunhos (admin)
    // sem filtro    → todos (admin pode passar sem flag)
    let query = 'SELECT * FROM artigos';
    const params = [];

    if (req.query.published === '1') {
      query += " WHERE status = 'published' AND (data_publicacao IS NULL OR data_publicacao <= NOW())";
    } else if (req.query.status) {
      query += ' WHERE status = ?';
      params.push(req.query.status);
    }

    query += ' ORDER BY data_publicacao DESC';

    const [rows] = await pool.execute(query, params);
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(rows);
  } catch (error) {
    logger.error('Artigos GET error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM artigos WHERE slug=?', [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'Artigo não encontrado' });
    // Rascunhos só acessíveis via admin (não bloqueamos aqui para o preview do editor)
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(rows[0]);
  } catch (error) {
    logger.error('Artigos GET slug error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.post('/', authMiddleware, checkPermission('blog', 'create'), async (req, res) => {
  try {
    const {
      titulo, slug, autor, categoria, categoria_id,
      conteudo, resumo, imagem_destaque, data_publicacao,
      status = 'published', tags,
    } = req.body;

    if (!titulo || !slug) {
      return res.status(400).json({ error: 'titulo e slug são obrigatórios' });
    }

    // Slug único
    const [existing] = await pool.execute('SELECT id FROM artigos WHERE slug=?', [slug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já existe um artigo com este slug' });
    }

    const id = uuidv4();
    const now = new Date();
    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags || null);

    await pool.execute(
      'INSERT INTO artigos (id, titulo, slug, autor, categoria, categoria_id, conteudo, resumo, imagem_destaque, data_publicacao, status, tags, created, updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, titulo, slug, autor || null, categoria || null, categoria_id || null, conteudo || null, resumo || null, imagem_destaque || null, data_publicacao || now, status, tagsJson, now, now]
    );
    res.status(201).json({ id, message: 'Criado com sucesso' });
  } catch (error) {
    logger.error('Artigos POST error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.put('/:id', authMiddleware, checkPermission('blog', 'update'), async (req, res) => {
  try {
    const {
      titulo, slug, autor, categoria, categoria_id,
      conteudo, resumo, imagem_destaque, data_publicacao,
      status, tags,
    } = req.body;

    if (!titulo || !slug) {
      return res.status(400).json({ error: 'titulo e slug são obrigatórios' });
    }

    // Slug único (exceto o próprio artigo)
    const [existing] = await pool.execute(
      'SELECT id FROM artigos WHERE slug=? AND id != ?',
      [slug, req.params.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já existe um artigo com este slug' });
    }

    const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : (tags ?? null);
    const statusVal = ['draft', 'published', 'scheduled'].includes(status) ? status : 'published';

    const [result] = await pool.execute(
      'UPDATE artigos SET titulo=?, slug=?, autor=?, categoria=?, categoria_id=?, conteudo=?, resumo=?, imagem_destaque=?, data_publicacao=?, status=?, tags=?, updated=? WHERE id=?',
      [titulo, slug, autor || null, categoria || null, categoria_id || null, conteudo || null, resumo || null, imagem_destaque || null, data_publicacao || null, statusVal, tagsJson, new Date(), req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Artigo não encontrado' });
    }

    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    logger.error('Artigos PUT error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.delete('/:id', authMiddleware, checkPermission('blog', 'delete'), async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM artigos WHERE id=?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Artigo não encontrado' });
    }

    res.json({ message: 'Deletado com sucesso' });
  } catch (error) {
    logger.error('Artigos DELETE error:', error.message);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
