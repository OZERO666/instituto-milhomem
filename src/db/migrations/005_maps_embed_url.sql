-- Adiciona colunas de localização que estavam faltando no contato_config
ALTER TABLE contato_config
  ADD COLUMN IF NOT EXISTS maps_embed_url TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS maps_url       TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS nome_local     VARCHAR(255) DEFAULT NULL;
