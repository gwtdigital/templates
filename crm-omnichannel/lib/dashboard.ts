import { createClient } from '@/lib/supabase/server'
import type { Deal, PipelineStage } from '@/types/database'

export type DashboardData = {
  stages: PipelineStage[]
  totalLeads: number
  leadsAtivos: number
  taxaConversao: number
  valorEmNegociacao: number
  valorGanho: number
  funil: { stage: PipelineStage; total: number; percentual: number }[]
}

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient()

  const [{ data: stages }, { data: deals }] = await Promise.all([
    supabase.from('pipeline_stages').select('*').order('order', { ascending: true }),
    supabase.from('deals').select('*'),
  ])

  const stagesLista = (stages as PipelineStage[]) ?? []
  const dealsLista = (deals as Deal[]) ?? []

  const ultimaEtapa = stagesLista[stagesLista.length - 1]
  const dealsFechados = ultimaEtapa ? dealsLista.filter((d) => d.stage_id === ultimaEtapa.id) : []
  const dealsAbertos = ultimaEtapa ? dealsLista.filter((d) => d.stage_id !== ultimaEtapa.id) : dealsLista

  const totalLeads = dealsLista.length
  const primeiraEtapaTotal = stagesLista.length > 0
    ? dealsLista.filter((d) => d.stage_id === stagesLista[0].id).length || totalLeads
    : totalLeads

  const funil = stagesLista.map((stage) => {
    const total = dealsLista.filter((d) => d.stage_id === stage.id).length
    const percentual = primeiraEtapaTotal > 0 ? Math.round((total / primeiraEtapaTotal) * 100) : 0
    return { stage, total, percentual }
  })

  return {
    stages: stagesLista,
    totalLeads,
    leadsAtivos: dealsAbertos.length,
    taxaConversao: totalLeads > 0 ? Math.round((dealsFechados.length / totalLeads) * 100) : 0,
    valorEmNegociacao: dealsAbertos.reduce((acc, d) => acc + (d.value ?? 0), 0),
    valorGanho: dealsFechados.reduce((acc, d) => acc + (d.value ?? 0), 0),
    funil,
  }
}
