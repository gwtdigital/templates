'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updateCompanyName(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const nome = formData.get('empresaNome') as string

  await supabase.from('companies').update({ name: nome }).eq('owner_id', user.id)

  redirect('/onboarding?step=2')
}

export async function createFirstChannel(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const nomeCanal = formData.get('canalNome') as string

  await supabase.from('channels').insert({ name: nomeCanal, type: 'whatsapp', active: true })

  redirect('/onboarding?step=3')
}

export async function finishOnboarding() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  await supabase.from('profiles').update({ onboarding_completed_at: new Date().toISOString() }).eq('id', user.id)

  redirect('/inbox')
}
