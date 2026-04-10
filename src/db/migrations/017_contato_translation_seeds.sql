-- ================================================================
-- 017_contato_translation_seeds.sql
-- Add missing contato_config EN/ES translation seeds for schedule fields
-- ================================================================

SET @contato_id = '00000002-seed-0000-0000-000000000001';

INSERT INTO traducoes (tabela, registro_id, campo, locale, valor) VALUES
  ('contato_config', @contato_id, 'dias_funcionamento', 'en', 'Monday to Saturday'),
  ('contato_config', @contato_id, 'horario',            'en', '08:00 - 18:00'),
  ('contato_config', @contato_id, 'dias_funcionamento', 'es', 'Lunes a Sábado'),
  ('contato_config', @contato_id, 'horario',            'es', '08:00 - 18:00')
ON DUPLICATE KEY UPDATE valor = VALUES(valor);
