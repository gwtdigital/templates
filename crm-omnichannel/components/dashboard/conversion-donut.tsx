export function ConversionDonut({ percentual }: { percentual: number }) {
  const gradiente = `conic-gradient(var(--color-primary) 0% ${percentual}%, #e5e7eb ${percentual}% 100%)`

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Taxa de Conversão</h3>
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative h-32 w-32 rounded-full" style={{ background: gradiente }}>
          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-gray-900">{percentual}%</span>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">dos leads fechados</p>
      </div>
    </div>
  )
}
