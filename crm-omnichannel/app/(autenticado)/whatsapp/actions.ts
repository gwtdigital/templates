'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  instanceNameForCompany,
  createInstance,
  getQrCode,
  getConnectionState,
  logoutInstance,
  deleteInstance,
} from '@/lib/evolution'

async function getCompanyId() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user.id).single()

  if (!profile?.company_id) throw new Error('Usuário sem empresa vinculada.')

  return { supabase, companyId: profile.company_id as string }
}

export async function startConnection() {
  const { supabase, companyId } = await getCompanyId()

  const instanceName = instanceNameForCompany(companyId)
  const webhookSecret = process.env.EVOLUTION_WEBHOOK_SECRET
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  if (!webhookSecret || !appUrl) {
    throw new Error('NEXT_PUBLIC_APP_URL ou EVOLUTION_WEBHOOK_SECRET não configurados.')
  }

  const { data: existente } = await supabase
    .from('channels')
    .select('id')
    .eq('company_id', companyId)
    .eq('type', 'whatsapp')
    .maybeSingle()

  if (!existente) {
    // Cria a instância na Evolution primeiro — só grava a linha em
    // `channels` se isso funcionar, pra nunca ficar com um canal "fantasma"
    // apontando pra uma instância que não existe de verdade.
    await createInstance(instanceName, `${appUrl}/api/whatsapp/webhook/${webhookSecret}`)

    const { error } = await supabase.from('channels').insert({
      name: 'WhatsApp',
      type: 'whatsapp',
      active: false,
      config: { instanceName },
    })

    if (error) {
      await deleteInstance(instanceName).catch(() => {})
      throw new Error(error.message)
    }
  }

  const qr = await getQrCode(instanceName)
  return qr
}

export async function checkConnectionStatus() {
  const { supabase, companyId } = await getCompanyId()
  const instanceName = instanceNameForCompany(companyId)

  const state = await getConnectionState(instanceName)

  if (state === 'open') {
    await supabase.from('channels').update({ active: true }).eq('company_id', companyId).eq('type', 'whatsapp')
    revalidatePath('/whatsapp')
  }

  return state
}

export async function disconnect() {
  const { supabase, companyId } = await getCompanyId()
  const instanceName = instanceNameForCompany(companyId)

  await logoutInstance(instanceName).catch(() => {})
  await deleteInstance(instanceName).catch(() => {})

  await supabase.from('channels').delete().eq('company_id', companyId).eq('type', 'whatsapp')

  revalidatePath('/whatsapp')
}
