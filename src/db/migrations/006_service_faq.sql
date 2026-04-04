-- Migration 006: add faq column to servicos table
ALTER TABLE servicos
  ADD COLUMN IF NOT EXISTS faq TEXT NULL DEFAULT NULL
    COMMENT 'JSON array of {pergunta, resposta} objects for FAQPage schema';
