-- ================================================================
-- 020_drop_seo_facebook_instagram_fields.sql
-- Revert social metadata fields added for Facebook and Instagram
-- ================================================================

ALTER TABLE seo_settings
  DROP COLUMN IF EXISTS facebook_title,
  DROP COLUMN IF EXISTS facebook_description,
  DROP COLUMN IF EXISTS facebook_image,
  DROP COLUMN IF EXISTS instagram_title,
  DROP COLUMN IF EXISTS instagram_description,
  DROP COLUMN IF EXISTS instagram_image;
