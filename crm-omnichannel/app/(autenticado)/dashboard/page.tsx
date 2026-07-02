import { Users, TrendingUp, Wallet, HandCoins } from 'lucide-react'
import { getDashboardData } from '@/lib/dashboard'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { FunnelList } from '@/components/dashboard/funnel-list'
import { ConversionDonut } from '@/components/dashboard/conversion-donut'

export const dynamic = 'force-dynamic'

function formatarValor(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function DashboardPage() {
  const dados = await getDashboardData()

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <h2 className="font-semibold text-gray-900">Visão Geral</h2>
      </div>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icone={Users}
            label="Leads Ativos"
            valor={String(dados.leadsAtivos)}
            sublabel={`${dados.totalLeads} no total`}
            corIcone="text-blue-600"
            fundoIcone="bg-blue-50"
          />
          <KpiCard
            icone={TrendingUp}
            label="Taxa de Conversão"
            valor={`${dados.taxaConversao}%`}
            sublabel="dos leads fechados"
            corIcone="text-green-600"
            fundoIcone="bg-green-50"
          />
          <KpiCard
            icone={Wallet}
            label="Valor em Negociação"
            valor={formatarValor(dados.valorEmNegociacao)}
            sublabel="negócios em aberto"
            corIcone="text-amber-600"
            fundoIcone="bg-amber-50"
          />
          <KpiCard
            icone={HandCoins}
            label="Valor Ganho"
            valor={formatarValor(dados.valorGanho)}
            sublabel="negócios fechados"
            corIcone="text-[var(--color-primary)]"
            fundoIcone="bg-[var(--color-accent)]"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <FunnelList funil={dados.funil} />
          <ConversionDonut percentual={dados.taxaConversao} />
        </div>
      </div>
    </div>
  )
}
