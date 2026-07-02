'use client'

import { useRef, useState, useTransition } from 'react'
import { Send } from 'lucide-react'
import { sendMessage } from '@/app/(autenticado)/inbox/actions'

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function enviar() {
    if (!texto.trim() || pending) return
    const valor = texto
    setTexto('')
    setErro(null)

    startTransition(async () => {
      try {
        await sendMessage(conversationId, valor)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível enviar a mensagem.')
      } finally {
        inputRef.current?.focus()
      }
    })
  }

  return (
    <div className="border-t border-gray-200 p-3">
      {erro && <p className="mb-2 text-xs text-red-600">{erro}</p>}
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') enviar()
          }}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[var(--color-primary)] focus:outline-none"
        />
        <button
          onClick={enviar}
          disabled={pending || !texto.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
