// Fonte única da marca. Referencie estes valores em vez de texto fixo
// sempre que o nome/tom da marca aparecer na interface.

const supportWhatsapp = '' // TODO: PREENCHER — DDI+DDD+NUMERO, ex 5551999999999
const supportWhatsappDisplay = '' // TODO: PREENCHER — numero formatado, ex (51) 99999-9999

export const brand = {
  name: 'SalesPro',
  tagline: 'Atendimento e vendas no WhatsApp, no automático com IA.',
  primary: '#32e0c4',
  primaryOklch: '0.82 0.14 179',
  secondary: '#222831', // grafite escuro — texto/base
  surface: '#393e46', // slate — superfícies/bordas
  background: '#fafafa', // off-white — fundo
  supportWhatsapp,
  supportWhatsappDisplay,
  get supportWhatsappUrl() {
    return supportWhatsapp ? `https://wa.me/${supportWhatsapp}` : ''
  },
} as const
