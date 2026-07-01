import { Check } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatPrecoBRL, type Plan } from '@/lib/plans'

export function PricingCard({ plano }: { plano: Plan }) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border p-6',
        plano.destaque
          ? 'border-[var(--color-primary)] bg-white shadow-lg ring-2 ring-[var(--color-primary)]'
          : 'border-gray-200 bg-white'
      )}
    >
      {plano.destaque && (
        <span className="mb-3 inline-block w-fit rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-foreground)]">
          Mais popular
        </span>
      )}

      <h3 className="text-lg font-bold text-gray-900">{plano.nome}</h3>
      <p className="mt-1 text-sm text-gray-500">{plano.descricao}</p>

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-3xl font-extrabold text-gray-900">{formatPrecoBRL(plano.preco_cents)}</span>
        <span className="text-sm text-gray-500">/mês</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plano.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href="/signup"
        className={cn(
          'mt-6 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors',
          plano.destaque
            ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        )}
      >
        Testar grátis por {plano.trial_days} dias
      </Link>
    </div>
  )
}
