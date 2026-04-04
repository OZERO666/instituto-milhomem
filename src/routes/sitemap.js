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

export default async function sitemapRoute(_req, res) {
  try {
    // Busca serviços ativos
    const [servicos] = await pool.execute(
      "SELECT slug, updated FROM servicos WHERE ativo = 1 AND slug IS NOT NULL ORDER BY ordem ASC"
    );

    // Busca artigos publicados
    const [artigos] = await pool.execute(
      "SELECT slug, updated FROM artigos WHERE status = 'published' AND slug IS NOT NULL ORDER BY data_publicacao DESC"
    );

    const today = toW3CDate();

    const staticEntries = STATIC_ROUTES.map(({ path, changefreq, priority }) =>
      urlEntry(`${BASE_URL}${path}`, today, changefreq, priority)
    ).join('');

    const servicoEntries = servicos.map(s =>
      urlEntry(`${BASE_URL}/servicos/${s.slug}`, toW3CDate(s.updated), 'weekly', '0.8')
    ).join('');

    const artigoEntries = artigos.map(a =>
      urlEntry(`${BASE_URL}/blog/${a.slug}`, toW3CDate(a.updated), 'monthly', '0.7')
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
