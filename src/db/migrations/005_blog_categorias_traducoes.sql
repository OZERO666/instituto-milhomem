-- ================================================================
-- 005_blog_categorias_traducoes.sql
-- Seed translations (EN + ES) for the 3 example blog categories
-- seeded in 003_seed_example_content.sql
-- ================================================================

-- Transplante Capilar
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('blog_categorias', '40000000-0000-4000-8000-000000000001', 'nome', 'en', 'Hair Transplant'),
  ('blog_categorias', '40000000-0000-4000-8000-000000000001', 'nome', 'es', 'Trasplante Capilar')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- Saude Capilar
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('blog_categorias', '40000000-0000-4000-8000-000000000002', 'nome', 'en', 'Hair Health'),
  ('blog_categorias', '40000000-0000-4000-8000-000000000002', 'nome', 'es', 'Salud Capilar')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);

-- Pos-Operatorio
INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('blog_categorias', '40000000-0000-4000-8000-000000000003', 'nome', 'en', 'Post-Operative'),
  ('blog_categorias', '40000000-0000-4000-8000-000000000003', 'nome', 'es', 'Postoperatorio')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
