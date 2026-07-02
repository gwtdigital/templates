-- ============================================================
-- Limita 1 canal de WhatsApp por empresa (todos os planos hoje têm
-- limite_instancias = 1 — ver seção "Planos" da landing).
-- Execute no SQL Editor do Supabase (dashboard → SQL Editor)
-- ============================================================

create unique index if not exists um_whatsapp_por_empresa
  on public.channels (company_id)
  where type = 'whatsapp';
