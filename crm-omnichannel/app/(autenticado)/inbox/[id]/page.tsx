import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ListaConversas } from '@/components/lista-conversas'
import { PainelMensagens } from '@/components/painel-mensagens'
import type { Conversation, Message } from '@/types/database'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ConversaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: conversas }, { data: conversa }, { data: mensagens }] =
    await Promise.all([
      supabase
        .from('conversations')
        .select(`
          *,
          contact:contacts(id, name, email, phone),
          channel:channels(id, name, type)
        `)
        .order('last_message_at', { ascending: false, nullsFirst: false }),

      supabase
        .from('conversations')
        .select(`
          *,
          contact:contacts(id, name, email, phone),
          channel:channels(id, name, type)
        `)
        .eq('id', id)
        .single(),

      supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', id)
        .order('created_at', { ascending: true }),
    ])

  if (!conversa) {
    notFound()
  }

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-80 flex-col border-r border-gray-200">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <h2 className="font-semibold text-gray-900">Inbox</h2>
        </div>
        <ListaConversas conversas={(conversas as Conversation[]) ?? []} />
      </div>
      <PainelMensagens
        conversa={conversa as Conversation}
        mensagens={(mensagens as Message[]) ?? []}
      />
    </div>
  )
}
