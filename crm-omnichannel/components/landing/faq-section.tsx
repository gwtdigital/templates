import { brand } from '@/lib/brand'

const faqs = [
  {
    pergunta: 'Preciso colocar o cartão de crédito para testar?',
    resposta:
      'Não. Seus dias grátis começam automaticamente assim que sua conta é criada — sem cartão e sem checkout.',
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
  {
    pergunta: 'Preciso instalar alguma coisa?',
    resposta: 'Não. É tudo pelo navegador — basta conectar seu número de WhatsApp e começar a atender.',
  },
  {
    pergunta: 'Quantas pessoas do meu time podem usar o painel?',
    resposta:
      'Depende do plano: o Starter vem com 1 usuário, o Pro com 5 e o Business com 20 usuários no painel.',
  },
]

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
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
  )
}
