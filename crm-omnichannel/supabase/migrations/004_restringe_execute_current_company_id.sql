-- ============================================================
-- Restringe quem pode chamar current_company_id() via API
-- Execute no SQL Editor do Supabase (dashboard → SQL Editor)
--
-- O linter de segurança do Supabase apontou que, por padrão, uma
-- função SECURITY DEFINER fica exposta em /rest/v1/rpc/<nome> até
-- para o role anon. current_company_id() só faz sentido pra quem
-- está autenticado (retorna null pra anon de qualquer forma, já que
-- auth.uid() é null), mas não há motivo pra deixá-la exposta.
-- ============================================================

revoke execute on function public.current_company_id() from public;
grant execute on function public.current_company_id() to authenticated;
