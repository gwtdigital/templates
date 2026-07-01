'use server'

import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'

export async function createCompanyWithOwner(formData: FormData) {
  const empresaNome = formData.get('empresaNome') as string
  const ownerNome = formData.get('ownerNome') as string
  const ownerEmail = formData.get('ownerEmail') as string
  const ownerSenha = formData.get('ownerSenha') as string
  const planId = formData.get('planId') as string

  const admin = createAdminClient()

  const { data: plano, error: planoError } = await admin
    .from('plan')
    .select('id, trial_days')
    .eq('id', planId)
    .single()

  if (planoError || !plano) {
    redirect(`/master/nova-empresa?erro=${encodeURIComponent('Plano inválido.')}`)
  }

  const { data: userData, error: userError } = await admin.auth.admin.createUser({
    email: ownerEmail,
    password: ownerSenha,
    email_confirm: true,
    user_metadata: { full_name: ownerNome },
  })

  if (userError || !userData.user) {
    redirect(`/master/nova-empresa?erro=${encodeURIComponent(userError?.message ?? 'Não foi possível criar o usuário.')}`)
  }

  const ownerId = userData.user.id

  const { data: company, error: companyError } = await admin
    .from('companies')
    .insert({ name: empresaNome, owner_id: ownerId })
    .select('id')
    .single()

  if (companyError || !company) {
    redirect(`/master/nova-empresa?erro=${encodeURIComponent('Não foi possível criar a empresa.')}`)
  }

  await admin
    .from('profiles')
    .upsert({ id: ownerId, full_name: ownerNome, role: 'owner', company_id: company.id }, { onConflict: 'id' })

  const trialEndsAt = new Date(Date.now() + plano.trial_days * 24 * 60 * 60 * 1000)

  await admin.from('subscriptions').insert({
    company_id: company.id,
    plan_id: plano.id,
    status: 'trialing',
    trial_ends_at: trialEndsAt.toISOString(),
  })

  await admin.from('pipeline_stages').insert([
    { company_id: company.id, name: 'Novo Lead', order: 1, color: '#3b82f6' },
    { company_id: company.id, name: 'Qualificando', order: 2, color: '#8b5cf6' },
    { company_id: company.id, name: 'Proposta', order: 3, color: '#f59e0b' },
    { company_id: company.id, name: 'Negociação', order: 4, color: '#f97316' },
    { company_id: company.id, name: 'Fechado', order: 5, color: '#22c55e' },
  ])

  redirect('/master/nova-empresa?sucesso=1')
}
