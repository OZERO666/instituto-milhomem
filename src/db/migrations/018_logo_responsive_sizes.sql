-- ================================================================
-- 018_logo_responsive_sizes.sql
-- Add responsive logo size settings for mobile/tablet breakpoints
-- ================================================================

INSERT IGNORE INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('logo_size_header_mobile', '40', 'number', 'Logo no header em mobile (px)'),
  ('logo_size_header_tablet', '48', 'number', 'Logo no header em tablet (px)'),
  ('logo_size_footer_mobile', '36', 'number', 'Logo no footer em mobile (px)'),
  ('logo_size_footer_tablet', '40', 'number', 'Logo no footer em tablet (px)');
