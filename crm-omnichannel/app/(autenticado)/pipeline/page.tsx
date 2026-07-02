import { Kanban } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PipelineBoard } from '@/components/pipeline/board'
import type { PipelineStage, Deal, Contact } from '@/types/database'

export const dynamic = 'force-dynamic'

type DealComContato = Deal & { contact: Contact | null }
type StageComDeals = PipelineStage & { deals: DealComContato[] }

export default async function PipelinePage() {
  const supabase = await createClient()

  const [{ data: stages }, { data: deals }] = await Promise.all([
    supabase.from('pipeline_stages').select('*').order('order', { ascending: true }),
    supabase
      .from('deals')
      .select('*, contact:contacts(*)')
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

  return <PipelineBoard colunas={colunas} />
}
