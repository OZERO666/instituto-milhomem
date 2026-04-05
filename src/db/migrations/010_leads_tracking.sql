-- ============================================================
-- Migration 010 — Lead tracking metadata for agendamentos
-- Adds source / UTM / CTA fields in an idempotent way.
-- ============================================================

START TRANSACTION;

SET @col_origem_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'origem'
);

SET @sql_add_origem = IF(
  @col_origem_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN origem VARCHAR(120) NULL AFTER mensagem',
  'SELECT 1'
);
PREPARE stmt_add_origem FROM @sql_add_origem;
EXECUTE stmt_add_origem;
DEALLOCATE PREPARE stmt_add_origem;

SET @col_cta_origem_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'cta_origem'
);

SET @sql_add_cta_origem = IF(
  @col_cta_origem_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN cta_origem VARCHAR(160) NULL AFTER origem',
  'SELECT 1'
);
PREPARE stmt_add_cta_origem FROM @sql_add_cta_origem;
EXECUTE stmt_add_cta_origem;
DEALLOCATE PREPARE stmt_add_cta_origem;

SET @col_utm_source_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'utm_source'
);

SET @sql_add_utm_source = IF(
  @col_utm_source_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN utm_source VARCHAR(160) NULL AFTER cta_origem',
  'SELECT 1'
);
PREPARE stmt_add_utm_source FROM @sql_add_utm_source;
EXECUTE stmt_add_utm_source;
DEALLOCATE PREPARE stmt_add_utm_source;

SET @col_utm_medium_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'utm_medium'
);

SET @sql_add_utm_medium = IF(
  @col_utm_medium_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN utm_medium VARCHAR(160) NULL AFTER utm_source',
  'SELECT 1'
);
PREPARE stmt_add_utm_medium FROM @sql_add_utm_medium;
EXECUTE stmt_add_utm_medium;
DEALLOCATE PREPARE stmt_add_utm_medium;

SET @col_utm_campaign_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'utm_campaign'
);

SET @sql_add_utm_campaign = IF(
  @col_utm_campaign_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN utm_campaign VARCHAR(180) NULL AFTER utm_medium',
  'SELECT 1'
);
PREPARE stmt_add_utm_campaign FROM @sql_add_utm_campaign;
EXECUTE stmt_add_utm_campaign;
DEALLOCATE PREPARE stmt_add_utm_campaign;

SET @col_utm_content_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'utm_content'
);

SET @sql_add_utm_content = IF(
  @col_utm_content_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN utm_content VARCHAR(180) NULL AFTER utm_campaign',
  'SELECT 1'
);
PREPARE stmt_add_utm_content FROM @sql_add_utm_content;
EXECUTE stmt_add_utm_content;
DEALLOCATE PREPARE stmt_add_utm_content;

SET @col_utm_term_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'utm_term'
);

SET @sql_add_utm_term = IF(
  @col_utm_term_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN utm_term VARCHAR(180) NULL AFTER utm_content',
  'SELECT 1'
);
PREPARE stmt_add_utm_term FROM @sql_add_utm_term;
EXECUTE stmt_add_utm_term;
DEALLOCATE PREPARE stmt_add_utm_term;

SET @col_landing_page_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'landing_page'
);

SET @sql_add_landing_page = IF(
  @col_landing_page_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN landing_page VARCHAR(255) NULL AFTER utm_term',
  'SELECT 1'
);
PREPARE stmt_add_landing_page FROM @sql_add_landing_page;
EXECUTE stmt_add_landing_page;
DEALLOCATE PREPARE stmt_add_landing_page;

SET @col_referrer_url_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND COLUMN_NAME = 'referrer_url'
);

SET @sql_add_referrer_url = IF(
  @col_referrer_url_exists = 0,
  'ALTER TABLE agendamentos ADD COLUMN referrer_url VARCHAR(512) NULL AFTER landing_page',
  'SELECT 1'
);
PREPARE stmt_add_referrer_url FROM @sql_add_referrer_url;
EXECUTE stmt_add_referrer_url;
DEALLOCATE PREPARE stmt_add_referrer_url;

SET @idx_agendamentos_origem_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND INDEX_NAME = 'idx_agendamentos_origem'
);

SET @sql_idx_agendamentos_origem = IF(
  @idx_agendamentos_origem_exists = 0,
  'ALTER TABLE agendamentos ADD INDEX idx_agendamentos_origem (origem)',
  'SELECT 1'
);
PREPARE stmt_idx_agendamentos_origem FROM @sql_idx_agendamentos_origem;
EXECUTE stmt_idx_agendamentos_origem;
DEALLOCATE PREPARE stmt_idx_agendamentos_origem;

SET @idx_agendamentos_cta_origem_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND INDEX_NAME = 'idx_agendamentos_cta_origem'
);

SET @sql_idx_agendamentos_cta_origem = IF(
  @idx_agendamentos_cta_origem_exists = 0,
  'ALTER TABLE agendamentos ADD INDEX idx_agendamentos_cta_origem (cta_origem)',
  'SELECT 1'
);
PREPARE stmt_idx_agendamentos_cta_origem FROM @sql_idx_agendamentos_cta_origem;
EXECUTE stmt_idx_agendamentos_cta_origem;
DEALLOCATE PREPARE stmt_idx_agendamentos_cta_origem;

SET @idx_agendamentos_utm_campaign_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'agendamentos'
    AND INDEX_NAME = 'idx_agendamentos_utm_campaign'
);

SET @sql_idx_agendamentos_utm_campaign = IF(
  @idx_agendamentos_utm_campaign_exists = 0,
  'ALTER TABLE agendamentos ADD INDEX idx_agendamentos_utm_campaign (utm_campaign)',
  'SELECT 1'
);
PREPARE stmt_idx_agendamentos_utm_campaign FROM @sql_idx_agendamentos_utm_campaign;
EXECUTE stmt_idx_agendamentos_utm_campaign;
DEALLOCATE PREPARE stmt_idx_agendamentos_utm_campaign;

COMMIT;