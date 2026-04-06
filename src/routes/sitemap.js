import pool from '../db/mysql.js';
import logger from '../utils/logger.js';

const BASE_URL = process.env.SITE_URL || 'https://institutomilhomem.com';

// Rotas estáticas com prioridades e frequência de atualização
const STATIC_ROUTES = [
  { path: '/',          changefreq: 'weekly',  priority: '1.0' },
  { path: '/sobre',     changefreq: 'monthly', priority: '0.8' },
  { path: '/servicos',  changefreq: 'weekly',  priority: '0.9' },
  { path: '/resultados',changefreq: 'weekly',  priority: '0.8' },
  { path: '/blog',      changefreq: 'daily',   priority: '0.9' },
  { path: '/contato',   changefreq: 'monthly', priority: '0.7' },
];

const toW3CDate = (d) => {
  const date = d ? new Date(d) : new Date();
  return date.toISOString().split('T')[0];
};

const urlEntry = (loc, lastmod, changefreq, priority) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const safeQuery = async (query, fallbackLabel) => {
  try {
    const [rows] = await pool.execute(query);
    return Array.isArray(rows) ? rows : [];
  } catch (error) {
    logger.warn(`[SITEMAP] ${fallbackLabel}:`, error.message);
    return [];
  }
};

export default async function sitemapRoute(_req, res) {
  try {
    // Busca serviços ativos. Seleciona apenas slug para reduzir risco de quebra por diferenças de schema entre ambientes.
    const servicos = await safeQuery(
      "SELECT slug FROM servicos WHERE ativo = 1 AND slug IS NOT NULL ORDER BY ordem ASC",
      'Falha ao consultar servicos para sitemap'
    );

    // Busca artigos publicados com o mesmo critério de resiliência.
    const artigos = await safeQuery(
      "SELECT slug FROM artigos WHERE status = 'published' AND slug IS NOT NULL ORDER BY data_publicacao DESC",
      'Falha ao consultar artigos para sitemap'
    );

    const today = toW3CDate();

    const staticEntries = STATIC_ROUTES.map(({ path, changefreq, priority }) =>
      urlEntry(`${BASE_URL}${path}`, today, changefreq, priority)
    ).join('');

    const servicoEntries = servicos.map(s =>
      urlEntry(encodeURI(`${BASE_URL}/servicos/${s.slug}`), today, 'weekly', '0.8')
    ).join('');

    const artigoEntries = artigos.map(a =>
      urlEntry(encodeURI(`${BASE_URL}/blog/${a.slug}`), today, 'monthly', '0.7')
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${staticEntries}${servicoEntries}${artigoEntries}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // cache 1h
    res.status(200).send(xml);
  } catch (error) {
    logger.error('Sitemap generation error:', error.message);
    res.status(500).send('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>');
  }
}
