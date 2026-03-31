-- RBAC collation and FK fix for MariaDB/MySQL
-- Apply manually after 001_rbac_schema.sql and 002_rbac_seed.sql

START TRANSACTION;

-- Normalize collations for RBAC key columns to match users table
ALTER TABLE roles
  MODIFY COLUMN id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE role_permissions
  MODIFY COLUMN role_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  MODIFY COLUMN permission_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE permissions
  MODIFY COLUMN id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

ALTER TABLE users
  MODIFY COLUMN role_id CHAR(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL;

-- Ensure index exists on users.role_id
SET @idx_exists = (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND INDEX_NAME = 'idx_users_role_id'
);

SET @idx_sql = IF(
  @idx_exists = 0,
  'CREATE INDEX idx_users_role_id ON users(role_id)',
  'SELECT 1'
);
PREPARE stmt_idx FROM @idx_sql;
EXECUTE stmt_idx;
DEALLOCATE PREPARE stmt_idx;

-- Ensure FK users.role_id -> roles.id exists
SET @fk_exists = (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'users'
    AND CONSTRAINT_NAME = 'fk_users_role'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @fk_sql = IF(
  @fk_exists = 0,
  'ALTER TABLE users ADD CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE stmt_fk FROM @fk_sql;
EXECUTE stmt_fk;
DEALLOCATE PREPARE stmt_fk;

COMMIT;
