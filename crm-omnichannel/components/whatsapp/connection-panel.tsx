'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { CheckCircle2, Smartphone, Loader2 } from 'lucide-react'
import { startConnection, checkConnectionStatus, disconnect } from '@/app/(autenticado)/whatsapp/actions'

type Props = {
  conectado: boolean
}

export function WhatsappConnectionPanel({ conectado: conectadoInicial }: Props) {
  const [conectado, setConectado] = useState(conectadoInicial)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  function iniciarConexao() {
    setErro(null)
    startTransition(async () => {
      try {
        const qr = await startConnection()
        setQrCode(qr.base64 ?? null)

        pollRef.current = setInterval(async () => {
          const estado = await checkConnectionStatus()
          if (estado === 'open') {
            if (pollRef.current) clearInterval(pollRef.current)
            setConectado(true)
            setQrCode(null)
          }
        }, 4000)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível conectar.')
      }
    })
  }

  function desconectar() {
    startTransition(async () => {
      try {
        await disconnect()
        setConectado(false)
        setQrCode(null)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível desconectar.')
      }
    })
  }

  if (conectado) {
    return (
      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">WhatsApp conectado</p>
            <p className="text-xs text-gray-500">Sua instância está ativa e recebendo mensagens.</p>
          </div>
        </div>
        <button
          onClick={desconectar}
          disabled={pending}
          className="mt-4 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          {pending ? 'Desconectando...' : 'Desconectar'}
        </button>
        {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}
      </div>
    )
  }

  return (
    <div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
        <Smartphone className="h-5 w-5 text-gray-600" />
      </div>
      <p className="mt-3 text-sm font-semibold text-gray-900">Nenhum WhatsApp conectado</p>
      <p className="mt-1 text-xs text-gray-500">Conecte seu número escaneando o QR Code com o app do WhatsApp.</p>

      {qrCode ? (
        <div className="mt-4">
          <img src={qrCode} alt="QR Code de conexão do WhatsApp" className="mx-auto h-56 w-56 rounded-md border" />
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Aguardando leitura do QR Code...
          </p>
        </div>
      ) : (
        <button
          onClick={iniciarConexao}
          disabled={pending}
          className="mt-4 rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90 disabled:opacity-50"
        >
          {pending ? 'Gerando QR Code...' : 'Conectar WhatsApp'}
        </button>
      )}

      {erro && <p className="mt-3 text-xs text-red-600">{erro}</p>}
    </div>
  )
}
