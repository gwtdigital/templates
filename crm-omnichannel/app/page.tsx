import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActivePlans } from '@/lib/plans'
import { PricingCard } from '@/components/landing/pricing-card'
import { brand } from '@/lib/brand'

export const dynamic = 'force-dynamic'

const faqs = [
  {
    pergunta: 'Preciso colocar o cartão de crédito para testar?',
    resposta: `Não. Seus dias grátis começam automaticamente assim que sua conta é criada — sem cartão e sem checkout.`,
  },
  {
    pergunta: 'O que acontece quando o período grátis acaba?',
    resposta:
      'Você recebe um aviso no painel durante todo o período de teste com o link para assinar. Se o trial expirar sem assinatura, o acesso ao painel é bloqueado até a regularização.',
  },
  {
    pergunta: `O ${brand.name} é só um chatbot?`,
    resposta: `Não. O ${brand.name} centraliza atendimento, CRM e agentes de IA treinados pro seu negócio — a IA responde, qualifica e organiza o funil, sem perder lead.`,
  },
  {
    pergunta: 'Posso trocar de plano depois?',
    resposta: 'Sim, o plano pode ser ajustado conforme o crescimento da sua operação.',
  },
]

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/inbox')
  }

  const planos = await getActivePlans()

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="text-lg font-bold">{brand.name}</span>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Entrar
            </Link>
            <Link
              href="/signup"
              className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
            >
              Testar grátis por 3 dias
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Transforme seu WhatsApp numa máquina de vendas com IA.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          {brand.name} centraliza atendimento, CRM e agentes de IA treinados pro seu negócio — sem perder lead, sem
          aumentar sua equipe.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
          >
            Testar grátis por 3 dias
          </Link>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Planos</h2>
          <p className="mt-3 text-gray-600">Escolha o plano ideal pra fase da sua operação. Todos com dias grátis, sem cartão.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {planos.map((plano) => (
            <PricingCard key={plano.id} plano={plano} />
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Perguntas frequentes</h2>
        <div className="space-y-6">
          {faqs.map((item) => (
            <div key={item.pergunta} className="border-b border-gray-200 pb-6">
              <h3 className="font-semibold text-gray-900">{item.pergunta}</h3>
              <p className="mt-2 text-sm text-gray-600">{item.resposta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-10">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-500">
          <p>
            {brand.name} — {brand.tagline}
          </p>
          <p className="mt-2">© {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
