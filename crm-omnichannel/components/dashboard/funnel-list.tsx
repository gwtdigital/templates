import type { DashboardData } from '@/lib/dashboard'

export function FunnelList({ funil }: { funil: DashboardData['funil'] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Funil de Vendas</h3>
        <span className="text-xs text-gray-400">
          {funil.reduce((acc, f) => acc + f.total, 0)} leads
        </span>
      </div>

      <div className="space-y-3">
        {funil.map(({ stage, total, percentual }) => (
          <div key={stage.id} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">{stage.name}</span>
                <span className="text-gray-400">{percentual}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percentual}%`, backgroundColor: stage.color ?? 'var(--color-primary)' }}
                />
              </div>
            </div>
            <span className="w-8 shrink-0 text-right text-sm font-semibold text-gray-900">{total}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
