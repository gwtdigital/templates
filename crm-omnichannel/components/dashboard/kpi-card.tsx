import type { LucideIcon } from 'lucide-react'

export function KpiCard({
  icone: Icone,
  label,
  valor,
  sublabel,
  corIcone = 'text-gray-700',
  fundoIcone = 'bg-gray-100',
}: {
  icone: LucideIcon
  label: string
  valor: string
  sublabel?: string
  corIcone?: string
  fundoIcone?: string
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${fundoIcone}`}>
          <Icone className={`h-5 w-5 ${corIcone}`} />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{valor}</p>
      <p className="text-xs text-gray-500">{label}</p>
      {sublabel && <p className="text-[11px] text-gray-400">{sublabel}</p>}
    </div>
  )
}
