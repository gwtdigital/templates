import { Smartphone, Bot, Kanban, TrendingUp } from 'lucide-react'

const passos = [
  {
    icone: Smartphone,
    titulo: 'Conecte seu WhatsApp',
    descricao: 'Configure seu número direto do painel, em minutos.',
  },
  {
    icone: Bot,
    titulo: 'A IA atende e qualifica',
    descricao: 'Agentes de IA treinados pro seu negócio respondem seus clientes automaticamente.',
  },
  {
    icone: Kanban,
    titulo: 'Acompanhe no funil',
    descricao: 'Cada conversa vira uma oportunidade organizada no CRM Kanban.',
  },
  {
    icone: TrendingUp,
    titulo: 'Feche mais vendas',
    descricao: 'Relatórios e integrações ajudam sua equipe a bater metas sem perder lead.',
  },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Como funciona</h2>
          <p className="mt-3 text-gray-600">Do primeiro contato até o negócio fechado, tudo automatizado.</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map(({ icone: Icone, titulo, descricao }, i) => (
            <div key={titulo} className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
                <Icone className="h-5 w-5" />
              </div>
              <span className="mt-4 block text-xs font-semibold text-gray-400">Passo {i + 1}</span>
              <h3 className="mt-1 font-semibold text-gray-900">{titulo}</h3>
              <p className="mt-2 text-sm text-gray-600">{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
