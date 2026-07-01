import { getActivePlans, formatPrecoBRL } from '@/lib/plans'

export const dynamic = 'force-dynamic'

export default async function MasterPlanosPage() {
  const planos = await getActivePlans()

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Planos</h1>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Ordem</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Preço</th>
              <th className="px-4 py-3">Trial</th>
              <th className="px-4 py-3">Limites</th>
              <th className="px-4 py-3">Destaque</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {planos.map((plano) => (
              <tr key={plano.id}>
                <td className="px-4 py-3 text-gray-500">{plano.ordem}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{plano.nome}</td>
                <td className="px-4 py-3 text-gray-500">{plano.slug}</td>
                <td className="px-4 py-3">
                  {formatPrecoBRL(plano.preco_cents)}/{plano.intervalo === 'month' ? 'mês' : plano.intervalo}
                </td>
                <td className="px-4 py-3 text-gray-500">{plano.trial_days} dias</td>
                <td className="px-4 py-3 text-gray-500">
                  {plano.limite_usuarios} usuários · {plano.limite_mensagens} conversas · {plano.limite_contatos} contatos
                </td>
                <td className="px-4 py-3">
                  {plano.destaque && (
                    <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-xs font-medium text-gray-900">
                      Mais popular
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
