-- ============================================================
-- Migration 011 — Formaliza workflow editorial de artigos
-- Adds status, tags, featured columns in an idempotent way.
-- ============================================================

START TRANSACTION;

SET @col_status_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'artigos'
    AND COLUMN_NAME = 'status'
);

SET @sql_add_status = IF(
  @col_status_exists = 0,
  'ALTER TABLE artigos ADD COLUMN status ENUM(''draft'',''published'',''scheduled'') NOT NULL DEFAULT ''published'' AFTER slug',
  'SELECT 1'
);
PREPARE stmt_add_status FROM @sql_add_status;
EXECUTE stmt_add_status;
DEALLOCATE PREPARE stmt_add_status;

SET @col_tags_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'artigos'
    AND COLUMN_NAME = 'tags'
);

SET @sql_add_tags = IF(
  @col_tags_exists = 0,
  'ALTER TABLE artigos ADD COLUMN tags JSON NULL AFTER status',
  'SELECT 1'
);
PREPARE stmt_add_tags FROM @sql_add_tags;
EXECUTE stmt_add_tags;
DEALLOCATE PREPARE stmt_add_tags;

SET @col_featured_exists = (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'artigos'
    AND COLUMN_NAME = 'featured'
);

SET @sql_add_featured = IF(
  @col_featured_exists = 0,
  'ALTER TABLE artigos ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0 AFTER tags',
  'SELECT 1'
);
PREPARE stmt_add_featured FROM @sql_add_featured;
EXECUTE stmt_add_featured;
DEALLOCATE PREPARE stmt_add_featured;

SET @idx_status_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'artigos'
    AND INDEX_NAME = 'idx_artigos_status'
);

SET @sql_add_idx_status = IF(
  @idx_status_exists = 0,
  'ALTER TABLE artigos ADD INDEX idx_artigos_status (status)',
  'SELECT 1'
);
PREPARE stmt_add_idx_status FROM @sql_add_idx_status;
EXECUTE stmt_add_idx_status;
DEALLOCATE PREPARE stmt_add_idx_status;

SET @idx_featured_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'artigos'
    AND INDEX_NAME = 'idx_artigos_featured'
);

SET @sql_add_idx_featured = IF(
  @idx_featured_exists = 0,
  'ALTER TABLE artigos ADD INDEX idx_artigos_featured (featured)',
  'SELECT 1'
);
PREPARE stmt_add_idx_featured FROM @sql_add_idx_featured;
EXECUTE stmt_add_idx_featured;
DEALLOCATE PREPARE stmt_add_idx_featured;

COMMIT;
