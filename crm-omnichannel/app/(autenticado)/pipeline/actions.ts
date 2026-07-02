'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createLead(formData: FormData) {
  const nome = formData.get('nome') as string
  const telefone = formData.get('telefone') as string
  const valor = formData.get('valor') as string
  const stageId = formData.get('stageId') as string

  const supabase = await createClient()

  const { data: contato, error: contatoError } = await supabase
    .from('contacts')
    .insert({ name: nome, phone: telefone || null })
    .select('id')
    .single()

  if (contatoError || !contato) {
    throw new Error(contatoError?.message ?? 'Não foi possível criar o contato.')
  }

  const { error: dealError } = await supabase.from('deals').insert({
    contact_id: contato.id,
    stage_id: stageId,
    title: nome,
    value: valor ? Number(valor) : null,
  })

  if (dealError) {
    throw new Error(dealError.message)
  }

  revalidatePath('/pipeline')
}

export async function moveDeal(dealId: string, stageId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('deals').update({ stage_id: stageId }).eq('id', dealId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/pipeline')
}
