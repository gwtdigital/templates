/**
 * Cliente para a Evolution API (WhatsApp). Server-only — usa a API key
 * global, nunca deve ser importado por código de cliente.
 *
 * Convenção de instanceName: `salespro-{company_id}`. Definida aqui
 * porque não existia nenhuma integração Evolution neste projeto antes
 * desta mudança — não é uma convenção herdada de instâncias já
 * conectadas em produção.
 */

function baseUrl() {
  const url = process.env.EVOLUTION_API_URL
  if (!url) throw new Error('EVOLUTION_API_URL não configurada.')
  return url.replace(/\/$/, '')
}

function apiKey() {
  const key = process.env.EVOLUTION_API_KEY
  if (!key) throw new Error('EVOLUTION_API_KEY não configurada.')
  return key
}

export function instanceNameForCompany(companyId: string) {
  return `salespro-${companyId}`
}

async function evolutionFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      apikey: apiKey(),
      ...init?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Evolution API ${path} -> ${res.status}: ${body}`)
  }

  return res.json()
}

export async function createInstance(instanceName: string, webhookUrl: string) {
  return evolutionFetch('/instance/create', {
    method: 'POST',
    body: JSON.stringify({
      instanceName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
      webhook: {
        url: webhookUrl,
        enabled: true,
        events: ['MESSAGES_UPSERT', 'CONNECTION_UPDATE'],
      },
    }),
  })
}

export async function getQrCode(instanceName: string): Promise<{ base64?: string; pairingCode?: string }> {
  const data = await evolutionFetch(`/instance/connect/${instanceName}`)
  return { base64: data.base64, pairingCode: data.pairingCode }
}

export async function getConnectionState(instanceName: string): Promise<'open' | 'connecting' | 'close'> {
  const data = await evolutionFetch(`/instance/connectionState/${instanceName}`)
  return data?.instance?.state ?? 'close'
}

export async function logoutInstance(instanceName: string) {
  await evolutionFetch(`/instance/logout/${instanceName}`, { method: 'DELETE' })
}

export async function deleteInstance(instanceName: string) {
  await evolutionFetch(`/instance/delete/${instanceName}`, { method: 'DELETE' })
}

export async function sendTextMessage(instanceName: string, numero: string, texto: string) {
  return evolutionFetch(`/message/sendText/${instanceName}`, {
    method: 'POST',
    body: JSON.stringify({ number: numero, text: texto }),
  })
}
