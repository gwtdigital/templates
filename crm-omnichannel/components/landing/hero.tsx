import Link from 'next/link'
import { ArrowRight, Bot, Check } from 'lucide-react'
import { brand } from '@/lib/brand'

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-gray-800">
            <Bot className="h-3.5 w-3.5" />
            Atendimento + CRM + agentes de IA num só lugar
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Transforme seu WhatsApp numa máquina de vendas com IA.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            {brand.name} centraliza atendimento, CRM e agentes de IA treinados pro seu negócio — sem perder lead, sem
            aumentar sua equipe.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
            >
              Testar grátis por 3 dias
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#planos" className="text-base font-semibold text-gray-700 hover:text-gray-900">
              Ver planos e preços
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">Sem cartão de crédito. Cancele quando quiser.</p>
        </div>

        <div className="relative">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs font-medium text-gray-400">Inbox — WhatsApp</span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2 text-sm text-gray-800">
                  Oi, vi o anúncio de vocês. Quanto custa o plano Pro?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-[var(--color-primary)] px-4 py-2 text-sm text-[var(--color-primary-foreground)]">
                  R$ 197/mês, com 3 dias grátis pra testar. Quer que eu já agende uma demonstração?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2 text-sm text-gray-800">
                  Quero sim!
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>Pipeline</span>
                <span>Qualificando</span>
              </div>
              <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                <p className="text-sm font-medium text-gray-900">Lead do anúncio — plano Pro</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
                  <Check className="h-3 w-3" /> Demonstração agendada pela IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
