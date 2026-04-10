-- ================================================================
-- 020_seo_facebook_instagram_fields.sql
-- Add Facebook and Instagram social metadata fields
-- ================================================================

ALTER TABLE seo_settings
  ADD COLUMN IF NOT EXISTS facebook_title VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS facebook_description VARCHAR(320) NULL,
  ADD COLUMN IF NOT EXISTS facebook_image VARCHAR(512) NULL,
  ADD COLUMN IF NOT EXISTS instagram_title VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS instagram_description VARCHAR(320) NULL,
  ADD COLUMN IF NOT EXISTS instagram_image VARCHAR(512) NULL;

UPDATE seo_settings
SET facebook_title = meta_title
WHERE (facebook_title IS NULL OR TRIM(facebook_title) = '')
  AND meta_title IS NOT NULL
  AND TRIM(meta_title) <> '';

UPDATE seo_settings
SET facebook_description = meta_description
WHERE (facebook_description IS NULL OR TRIM(facebook_description) = '')
  AND meta_description IS NOT NULL
  AND TRIM(meta_description) <> '';

UPDATE seo_settings
SET facebook_image = og_image
WHERE (facebook_image IS NULL OR TRIM(facebook_image) = '')
  AND og_image IS NOT NULL
  AND TRIM(og_image) <> '';

UPDATE seo_settings
SET instagram_title = facebook_title
WHERE (instagram_title IS NULL OR TRIM(instagram_title) = '')
  AND facebook_title IS NOT NULL
  AND TRIM(facebook_title) <> '';

UPDATE seo_settings
SET instagram_description = facebook_description
WHERE (instagram_description IS NULL OR TRIM(instagram_description) = '')
  AND facebook_description IS NOT NULL
  AND TRIM(facebook_description) <> '';

UPDATE seo_settings
SET instagram_image = facebook_image
WHERE (instagram_image IS NULL OR TRIM(instagram_image) = '')
  AND facebook_image IS NOT NULL
  AND TRIM(facebook_image) <> '';