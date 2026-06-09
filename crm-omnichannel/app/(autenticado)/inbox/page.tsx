import { createClient } from '@/lib/supabase/server'
import { ListaConversas } from '@/components/lista-conversas'
import type { Conversation } from '@/types/database'

export default async function InboxPage() {
  const supabase = await createClient()

  const { data: conversas } = await supabase
    .from('conversations')
    .select(`
      *,
      contact:contacts(id, name, email, phone),
      channel:channels(id, name, type)
    `)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-80 flex-col border-r border-gray-200">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <h2 className="font-semibold text-gray-900">Inbox</h2>
        </div>
        <ListaConversas conversas={(conversas as Conversation[]) ?? []} />
      </div>
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p className="text-sm">Selecione uma conversa para começar</p>
      </div>
    </div>
  )
}
