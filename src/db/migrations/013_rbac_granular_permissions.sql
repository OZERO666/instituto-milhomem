-- ============================================================
-- Migration 013 — Granular RBAC permissions por módulo admin
-- Adds resources and permissions for each admin section.
-- ============================================================

START TRANSACTION;

-- Ensure resources table has core resources
INSERT IGNORE INTO resources (resource_slug, resource_name, created, updated) VALUES
  ('dashboard', 'Dashboard & Overview', NOW(), NOW()),
  ('leads', 'Lead Management', NOW(), NOW()),
  ('services', 'Services Management', NOW(), NOW()),
  ('gallery', 'Gallery Management', NOW(), NOW()),
  ('media', 'Media Library', NOW(), NOW()),
  ('blog', 'Blog & Articles', NOW(), NOW()),
  ('testimonials', 'Testimonials', NOW(), NOW()),
  ('faq', 'FAQ Management', NOW(), NOW()),
  ('users', 'Users Management', NOW(), NOW()),
  ('seo', 'SEO Settings', NOW(), NOW()),
  ('hero', 'Hero Configuration', NOW(), NOW()),
  ('pages', 'Pages Configuration', NOW(), NOW()),
  ('branding', 'Branding & Images', NOW(), NOW()),
  ('translations', 'Translations', NOW(), NOW()),
  ('audit', 'Audit Logs', NOW(), NOW()),
  ('settings', 'System Settings', NOW(), NOW());

-- Insert granular permissions for each resource
-- Dashboard / Overview
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('dashboard:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'dashboard';

-- Leads Management
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('leads:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'leads'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('leads:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'leads'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('leads:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'leads';

-- Services Management
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('services:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'services'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('services:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'services'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('services:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'services'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('services:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'services';

-- Gallery Management
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('gallery:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'gallery'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('gallery:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'gallery'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('gallery:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'gallery'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('gallery:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'gallery';

-- Media Library
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('media:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'media'
UNION ALL
SELECT UUID(), id, 'upload', CONCAT('media:upload'), NOW(), NOW()
FROM resources WHERE resource_slug = 'media'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('media:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'media';

-- Blog & Articles
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('blog:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'blog'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('blog:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'blog'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('blog:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'blog'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('blog:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'blog';

-- Testimonials
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('testimonials:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'testimonials'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('testimonials:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'testimonials'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('testimonials:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'testimonials'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('testimonials:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'testimonials';

-- FAQ Management
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('faq:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'faq'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('faq:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'faq'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('faq:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'faq'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('faq:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'faq';

-- Users Management
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('users:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'users'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('users:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'users'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('users:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'users'
UNION ALL
SELECT UUID(), id, 'delete', CONCAT('users:delete'), NOW(), NOW()
FROM resources WHERE resource_slug = 'users';

-- SEO Settings
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('seo:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'seo'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('seo:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'seo';

-- Hero Configuration
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('hero:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'hero'
UNION ALL
SELECT UUID(), id, 'create', CONCAT('hero:create'), NOW(), NOW()
FROM resources WHERE resource_slug = 'hero'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('hero:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'hero';

-- Pages Configuration
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('pages:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'pages'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('pages:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'pages';

-- Branding & Images
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('branding:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'branding'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('branding:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'branding';

-- Translations
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('translations:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'translations'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('translations:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'translations';

-- Audit Logs
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('audit:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'audit';

-- System Settings
INSERT IGNORE INTO permissions (permission_slug, resource_id, action, permission_name, created, updated)
SELECT UUID(), id, 'read', CONCAT('settings:read'), NOW(), NOW()
FROM resources WHERE resource_slug = 'settings'
UNION ALL
SELECT UUID(), id, 'update', CONCAT('settings:update'), NOW(), NOW()
FROM resources WHERE resource_slug = 'settings';

-- Now bind all permissions to super_admin role
INSERT IGNORE INTO role_permissions (role_id, permission_id, created, updated)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.role_slug = 'super_admin'
AND p.id NOT IN (
  SELECT permission_id FROM role_permissions
  WHERE role_id = (SELECT id FROM roles WHERE role_slug = 'super_admin')
);

COMMIT;
