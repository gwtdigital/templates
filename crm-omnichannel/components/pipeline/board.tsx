'use client'

import { useMemo, useState, useTransition } from 'react'
import { Phone, Plus, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createLead, moveDeal } from '@/app/(autenticado)/pipeline/actions'
import type { Contact, Deal, PipelineStage } from '@/types/database'

type DealComContato = Deal & { contact: Contact | null }
type StageComDeals = PipelineStage & { deals: DealComContato[] }

function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PipelineBoard({ colunas: colunasIniciais }: { colunas: StageComDeals[] }) {
  const [busca, setBusca] = useState('')
  const [painelAberto, setPainelAberto] = useState<string | null>(null)
  const [dealArrastado, setDealArrastado] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const colunas = useMemo(() => {
    if (!busca.trim()) return colunasIniciais
    const termo = busca.toLowerCase()
    return colunasIniciais.map((coluna) => ({
      ...coluna,
      deals: coluna.deals.filter(
        (d) =>
          d.title.toLowerCase().includes(termo) ||
          d.contact?.name.toLowerCase().includes(termo) ||
          d.contact?.phone?.includes(termo)
      ),
    }))
  }, [colunasIniciais, busca])

  const totalLeads = colunasIniciais.reduce((acc, c) => acc + c.deals.length, 0)

  function onDrop(stageId: string) {
    if (!dealArrastado) return
    const id = dealArrastado
    setDealArrastado(null)
    startTransition(() => {
      moveDeal(id, stageId)
    })
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Pipeline de Leads</h2>
          <p className="text-xs text-gray-400">{totalLeads} leads no funil</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar lead..."
              className="w-56 rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-[var(--color-primary)] focus:outline-none"
            />
          </div>
          <button
            onClick={() => setPainelAberto(colunasIniciais[0]?.id ?? null)}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Novo Lead
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-4 overflow-x-auto p-6">
        {colunas.map((coluna) => {
          const totalColuna = coluna.deals.reduce((acc, d) => acc + (d.value ?? 0), 0)

          return (
            <div
              key={coluna.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(coluna.id)}
              className="flex h-fit min-h-[200px] w-72 shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50"
            >
              <div
                className="flex items-center justify-between rounded-t-lg border-b border-gray-200 px-4 py-3"
                style={{ borderTop: `3px solid ${coluna.color ?? '#9ca3af'}` }}
              >
                <div>
                  <span className="text-sm font-medium text-gray-700">{coluna.name}</span>
                  <p className="text-xs text-gray-400">{formatarValor(totalColuna)}</p>
                </div>
                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {coluna.deals.length}
                </span>
              </div>

              <div className="flex flex-col gap-2 p-3">
                {coluna.deals.length === 0 ? (
                  <p className="py-4 text-center text-xs text-gray-400">Sem negócios</p>
                ) : (
                  coluna.deals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDealArrastado(deal.id)}
                      className="cursor-grab rounded-md border border-gray-200 bg-white p-3 shadow-sm active:cursor-grabbing"
                    >
                      <p className="text-sm font-medium text-gray-900">{deal.contact?.name ?? deal.title}</p>
                      {deal.contact?.phone && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          <Phone className="h-3 w-3" />
                          {deal.contact.phone}
                        </p>
                      )}
                      {deal.value != null && (
                        <p className="mt-1 text-xs font-medium text-green-600">{formatarValor(deal.value)}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {painelAberto && (
        <NovoLeadPanel
          stages={colunasIniciais}
          stageIdPadrao={painelAberto}
          onClose={() => setPainelAberto(null)}
        />
      )}
    </div>
  )
}

function NovoLeadPanel({
  stages,
  stageIdPadrao,
  onClose,
}: {
  stages: PipelineStage[]
  stageIdPadrao: string
  onClose: () => void
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Novo lead</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          action={(formData) => {
            startTransition(async () => {
              await createLead(formData)
              onClose()
            })
          }}
          className="space-y-3"
        >
          <div>
            <label className="text-xs font-medium text-gray-600">Nome</label>
            <input
              name="nome"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Telefone</label>
            <input
              name="telefone"
              placeholder="55DDDNÚMERO"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Valor estimado (R$)</label>
            <input
              name="valor"
              type="number"
              step="0.01"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Etapa</label>
            <select
              name="stageId"
              defaultValue={stageIdPadrao}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90 disabled:opacity-50"
          >
            {pending ? 'Criando...' : 'Criar lead'}
          </button>
        </form>
      </div>
    </div>
  )
}
