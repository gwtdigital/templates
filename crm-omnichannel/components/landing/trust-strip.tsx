import { CreditCard, Lock, Timer, Headset } from 'lucide-react'

const itens = [
  { icone: CreditCard, texto: 'Sem cartão de crédito pra testar' },
  { icone: Timer, texto: 'Configuração em minutos' },
  { icone: Lock, texto: 'Dados isolados por empresa' },
  { icone: Headset, texto: 'Suporte em português' },
]

export function TrustStrip() {
  return (
    <section className="border-y border-gray-200 bg-white/60">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 sm:grid-cols-4">
        {itens.map(({ icone: Icone, texto }) => (
          <div key={texto} className="flex items-center gap-2 text-sm font-medium text-gray-600">
            <Icone className="h-4 w-4 shrink-0 text-[var(--color-primary)]" />
            {texto}
          </div>
        ))}
      </div>
    </section>
  )
}
