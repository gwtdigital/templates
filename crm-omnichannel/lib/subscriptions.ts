import { createClient } from '@/lib/supabase/server'

export type Subscription = {
  id: string
  company_id: string
  plan_id: string
  status: 'trialing' | 'active' | 'past_due' | 'canceled'
  trial_ends_at: string
  current_period_end: string | null
  checkout_url: string | null
}

export async function getCompanySubscription(companyId: string): Promise<Subscription | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('company_id', companyId)
    .maybeSingle()

  if (error) throw error
  return data
}

/** Dias restantes de trial, arredondado pra cima. Negativo = expirado. */
export function trialDaysRemaining(subscription: Pick<Subscription, 'trial_ends_at'>) {
  const msRestantes = new Date(subscription.trial_ends_at).getTime() - Date.now()
  return Math.ceil(msRestantes / (1000 * 60 * 60 * 24))
}

export function isTrialExpired(subscription: Subscription) {
  return subscription.status === 'trialing' && trialDaysRemaining(subscription) < 0
}
