import { MessageSquare, Kanban, Bot, Calendar, Webhook, Headset } from 'lucide-react'

const recursos = [
  {
    icone: MessageSquare,
    titulo: 'Inbox unificado de WhatsApp',
    descricao: 'Toda a conversa do seu número de WhatsApp centralizada num painel só, sem trocar de tela.',
  },
  {
    icone: Kanban,
    titulo: 'CRM Kanban',
    descricao: 'Cada conversa vira uma oportunidade organizada visualmente no funil de vendas.',
  },
  {
    icone: Bot,
    titulo: 'Agentes de IA (Gemini, GPT, Claude)',
    descricao: 'Agentes de IA treinados pro seu negócio respondem, qualificam e organizam o funil sem perder lead.',
  },
  {
    icone: Calendar,
    titulo: 'Google Agenda + Relatórios',
    descricao: 'Agendamentos sincronizados e relatórios pra acompanhar a performance da sua operação.',
  },
  {
    icone: Webhook,
    titulo: 'API + Webhooks',
    descricao: 'Integre o CRM com o resto do seu sistema e automatize o fluxo de dados entre eles.',
  },
  {
    icone: Headset,
    titulo: 'Suporte dedicado',
    descricao: 'Do suporte por email no Starter até gerente dedicado e SLA 99,9% no Business.',
  },
]

export function FeaturesSection() {
  return (
    <section id="recursos" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Tudo que sua operação de vendas precisa</h2>
        <p className="mt-3 text-gray-600">Atendimento, CRM e IA trabalhando juntos — não módulos soltos.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recursos.map(({ icone: Icone, titulo, descricao }) => (
          <div key={titulo} className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent)]">
              <Icone className="h-5 w-5 text-gray-800" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">{titulo}</h3>
            <p className="mt-2 text-sm text-gray-600">{descricao}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
