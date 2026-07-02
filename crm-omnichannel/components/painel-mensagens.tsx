import { cn } from '@/lib/utils'
import { MessageComposer } from '@/components/message-composer'
import type { Conversation, Message } from '@/types/database'

type Props = {
  conversa: Conversation
  mensagens: Message[]
}

function formatarHora(data: string) {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PainelMensagens({ conversa, mensagens }: Props) {
  const nomeContato = conversa.contact?.name ?? 'Contato desconhecido'

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <div>
          <p className="font-semibold text-gray-900">{nomeContato}</p>
          {conversa.channel?.name && (
            <p className="text-xs text-gray-400">{conversa.channel.name}</p>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-6">
        {mensagens.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            Nenhuma mensagem nesta conversa
          </div>
        ) : (
          mensagens.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex flex-col gap-1',
                msg.direction === 'outbound' ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  'max-w-xs rounded-2xl px-4 py-2 text-sm lg:max-w-md',
                  msg.direction === 'outbound'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                )}
              >
                {msg.content}
              </div>
              <span className="text-xs text-gray-400">
                {formatarHora(msg.created_at)}
              </span>
            </div>
          ))
        )}
      </div>

      <MessageComposer conversationId={conversa.id} />
    </div>
  )
}
