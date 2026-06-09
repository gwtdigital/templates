import { Kanban } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { PipelineStage, Deal, Contact } from '@/types/database'

type DealComContato = Deal & { contact: Contact | null }
type StageComDeals = PipelineStage & { deals: DealComContato[] }

export default async function PipelinePage() {
  const supabase = await createClient()

  const [{ data: stages }, { data: deals }] = await Promise.all([
    supabase.from('pipeline_stages').select('*').order('order', { ascending: true }),
    supabase
      .from('deals')
      .select('*, contact:contacts(id, name)')
      .order('created_at', { ascending: false }),
  ])

  const stagesLista = (stages as PipelineStage[]) ?? []
  const dealsLista = (deals as DealComContato[]) ?? []

  const colunas: StageComDeals[] = stagesLista.map((stage) => ({
    ...stage,
    deals: dealsLista.filter((d) => d.stage_id === stage.id),
  }))

  if (stagesLista.length === 0) {
    return (
      <div className="flex h-full w-full flex-col">
        <div className="flex h-14 items-center border-b border-gray-200 px-6">
          <h2 className="font-semibold text-gray-900">Pipeline</h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <Kanban className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">Nenhuma etapa configurada</p>
          <p className="text-xs text-gray-400">
            Adicione etapas ao pipeline para começar a organizar seus negócios
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <h2 className="font-semibold text-gray-900">Pipeline</h2>
      </div>
      <div className="flex flex-1 gap-4 overflow-x-auto p-6">
        {colunas.map((coluna) => (
          <div
            key={coluna.id}
            className="flex h-fit w-64 shrink-0 flex-col rounded-lg border border-gray-200 bg-gray-50"
          >
            <div className="flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white px-4 py-3">
              <span className="text-sm font-medium text-gray-700">{coluna.name}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
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
                    className="rounded-md border border-gray-200 bg-white p-3 shadow-sm"
                  >
                    <p className="text-sm font-medium text-gray-900">{deal.title}</p>
                    {deal.contact && (
                      <p className="mt-1 text-xs text-gray-400">{deal.contact.name}</p>
                    )}
                    {deal.value != null && (
                      <p className="mt-1 text-xs font-medium text-green-600">
                        {deal.value.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
