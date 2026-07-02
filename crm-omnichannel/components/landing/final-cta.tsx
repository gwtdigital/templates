import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { brand } from '@/lib/brand'

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="rounded-3xl bg-[var(--color-secondary)] px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Pronto pra transformar seu WhatsApp numa máquina de vendas?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-300">
          Comece agora com {brand.name} e tenha atendimento, CRM e IA trabalhando juntos pelo seu negócio.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
        >
          Testar grátis por 3 dias
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
