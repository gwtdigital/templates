import { createClient } from '@/lib/supabase/server'

export type Plan = {
  id: string
  slug: string
  nome: string
  descricao: string | null
  preco_cents: number
  moeda: string
  intervalo: string
  trial_days: number
  limite_mensagens: number | null
  limite_instancias: number | null
  limite_usuarios: number | null
  limite_contatos: number | null
  features: string[]
  destaque: boolean
  ativo: boolean
  ordem: number
}

/** Planos ativos, ordenados para exibição (landing e Master → Planos). */
export async function getActivePlans(): Promise<Plan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('plan')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true })

  if (error) throw error
  return data
}

/** Versão enxuta usada no dropdown de Master → Nova empresa. */
export async function listPlansBasic(): Promise<Pick<Plan, 'id' | 'slug' | 'nome' | 'preco_cents' | 'trial_days'>[]> {
  const plans = await getActivePlans()
  return plans.map(({ id, slug, nome, preco_cents, trial_days }) => ({
    id,
    slug,
    nome,
    preco_cents,
    trial_days,
  }))
}

export function formatPrecoBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
