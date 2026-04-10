-- ================================================================
-- 019_seo_advanced_fields.sql
-- Add advanced SEO fields and backfill safe defaults
-- ================================================================

ALTER TABLE seo_settings
  ADD COLUMN IF NOT EXISTS canonical_url VARCHAR(512) NULL,
  ADD COLUMN IF NOT EXISTS robots VARCHAR(32) NULL,
  ADD COLUMN IF NOT EXISTS twitter_title VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS twitter_description VARCHAR(320) NULL,
  ADD COLUMN IF NOT EXISTS twitter_image VARCHAR(512) NULL,
  ADD COLUMN IF NOT EXISTS twitter_card VARCHAR(32) NULL;

UPDATE seo_settings
SET robots = 'index, follow'
WHERE robots IS NULL OR TRIM(robots) = '';

UPDATE seo_settings
SET canonical_url = CONCAT(
  'https://institutomilhomem.com',
  CASE
    WHEN page_name = 'home' THEN '/'
    WHEN page_name = 'servicos' THEN '/servicos'
    WHEN page_name = 'sobre' THEN '/sobre'
    WHEN page_name = 'resultados' THEN '/resultados'
    WHEN page_name = 'blog' THEN '/blog'
    WHEN page_name = 'contato' THEN '/contato'
    WHEN page_name = 'faq' THEN '/faq'
    WHEN page_name IN ('politica-de-privacidade', 'politica_privacidade') THEN '/politica-de-privacidade'
    WHEN page_name IN ('termos-de-uso', 'termos_de_uso') THEN '/termos-de-uso'
    ELSE CONCAT('/', page_name)
  END
)
WHERE canonical_url IS NULL OR TRIM(canonical_url) = '';

UPDATE seo_settings
SET twitter_title = meta_title
WHERE (twitter_title IS NULL OR TRIM(twitter_title) = '')
  AND meta_title IS NOT NULL
  AND TRIM(meta_title) <> '';

UPDATE seo_settings
SET twitter_description = meta_description
WHERE (twitter_description IS NULL OR TRIM(twitter_description) = '')
  AND meta_description IS NOT NULL
  AND TRIM(meta_description) <> '';

UPDATE seo_settings
SET twitter_image = og_image
WHERE (twitter_image IS NULL OR TRIM(twitter_image) = '')
  AND og_image IS NOT NULL
  AND TRIM(og_image) <> '';

UPDATE seo_settings
SET twitter_card = 'summary_large_image'
WHERE twitter_card IS NULL OR TRIM(twitter_card) = '';