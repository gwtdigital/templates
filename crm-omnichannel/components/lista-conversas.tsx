'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Conversation } from '@/types/database'

type Props = {
  conversas: Conversation[]
}

function formatarData(data: string | null) {
  if (!data) return ''
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ListaConversas({ conversas }: Props) {
  const pathname = usePathname()

  if (conversas.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
        <MessageSquare className="h-10 w-10 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">Nenhuma conversa ainda</p>
        <p className="text-xs text-gray-400">
          As conversas aparecerão aqui quando chegarem mensagens
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {conversas.map((conversa) => {
        const ativa = pathname === `/inbox/${conversa.id}`
        const nomeContato = conversa.contact?.name ?? 'Contato desconhecido'
        const canal = conversa.channel?.name ?? ''

        return (
          <Link
            key={conversa.id}
            href={`/inbox/${conversa.id}`}
            className={cn(
              'flex flex-col gap-1 border-b border-gray-100 px-4 py-3 transition-colors',
              ativa
                ? 'bg-blue-50'
                : 'hover:bg-gray-50'
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn('text-sm font-medium', ativa ? 'text-blue-700' : 'text-gray-900')}>
                {nomeContato}
              </span>
              <span className="text-xs text-gray-400">
                {formatarData(conversa.last_message_at)}
              </span>
            </div>
            {canal && (
              <span className="text-xs text-gray-400">{canal}</span>
            )}
            <span
              className={cn(
                'text-xs',
                conversa.status === 'open' ? 'text-green-600' : 'text-gray-400'
              )}
            >
              {conversa.status === 'open'
                ? 'Aberta'
                : conversa.status === 'resolved'
                ? 'Resolvida'
                : 'Pendente'}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
