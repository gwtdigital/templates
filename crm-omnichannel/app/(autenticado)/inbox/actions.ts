'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendTextMessage } from '@/lib/evolution'

export async function sendMessage(conversationId: string, texto: string) {
  if (!texto.trim()) return

  const supabase = await createClient()

  const { data: conversa, error: conversaError } = await supabase
    .from('conversations')
    .select('id, contact:contacts(phone), channel:channels(config)')
    .eq('id', conversationId)
    .single()

  if (conversaError || !conversa) {
    throw new Error('Conversa não encontrada.')
  }

  const numero = (conversa.contact as unknown as { phone: string | null })?.phone
  const instanceName = ((conversa.channel as unknown as { config: { instanceName?: string } })?.config)
    ?.instanceName

  if (!numero || !instanceName) {
    throw new Error('Contato sem telefone ou canal sem instância do WhatsApp configurada.')
  }

  await sendTextMessage(instanceName, numero, texto)

  const { error: insertError } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    content: texto,
    direction: 'outbound',
  })

  if (insertError) {
    throw new Error(insertError.message)
  }

  revalidatePath(`/inbox/${conversationId}`)
}
