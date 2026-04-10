-- ============================================================
-- 016_responsive_settings.sql
-- Seeds responsive layout tokens for admin-configurable behavior
-- ============================================================

INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('container_max_width', '1280', 'number', 'Largura maxima do container principal em px'),
  ('container_padding_mobile', '16', 'number', 'Padding horizontal do container em mobile (px)'),
  ('container_padding_tablet', '24', 'number', 'Padding horizontal do container em tablet (px)'),
  ('container_padding_desktop', '32', 'number', 'Padding horizontal do container em desktop (px)'),
  ('section_padding_mobile', '48', 'number', 'Espacamento vertical das secoes em mobile (px)'),
  ('section_padding_tablet', '64', 'number', 'Espacamento vertical das secoes em tablet (px)'),
  ('section_padding_desktop', '80', 'number', 'Espacamento vertical das secoes em desktop (px)'),
  ('hero_min_height_mobile', '560', 'number', 'Altura minima do hero em mobile (px)'),
  ('hero_min_height_desktop', '980', 'number', 'Altura maxima-alvo do hero em desktop (px)'),
  ('mobile_type_scale', '100', 'number', 'Escala de tipografia no mobile em porcentagem'),
  ('show_decorations_mobile', 'true', 'boolean', 'Exibir elementos decorativos em telas pequenas');
