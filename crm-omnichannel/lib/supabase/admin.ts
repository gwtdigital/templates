import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente com service role — só pode ser usado em código de servidor
 * (server actions / route handlers), nunca importado por código de cliente.
 * Necessário para o Master criar empresas + usuários dono (auth admin API)
 * e para escrever em `subscriptions`, que não é gravável via RLS comum.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
