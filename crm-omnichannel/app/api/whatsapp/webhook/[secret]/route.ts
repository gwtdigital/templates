import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

type Props = {
  params: Promise<{ secret: string }>
}

function extrairTexto(mensagem: Record<string, unknown> | undefined): string | null {
  if (!mensagem) return null
  if (typeof mensagem.conversation === 'string') return mensagem.conversation
  const extendida = mensagem.extendedTextMessage as { text?: string } | undefined
  if (extendida?.text) return extendida.text
  return null
}

export async function POST(request: NextRequest, { params }: Props) {
  const { secret } = await params

  if (!process.env.EVOLUTION_WEBHOOK_SECRET || secret !== process.env.EVOLUTION_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)
  if (!payload?.instance) {
    return NextResponse.json({ ok: true })
  }

  const admin = createAdminClient()

  const { data: canal } = await admin
    .from('channels')
    .select('id, company_id')
    .eq('type', 'whatsapp')
    .contains('config', { instanceName: payload.instance })
    .maybeSingle()

  if (!canal) {
    return NextResponse.json({ ok: true })
  }

  const evento = String(payload.event ?? '').toLowerCase()

  if (evento === 'connection.update') {
    const estado = payload.data?.state
    if (estado === 'open') {
      await admin.from('channels').update({ active: true }).eq('id', canal.id)
    } else if (estado === 'close') {
      await admin.from('channels').update({ active: false }).eq('id', canal.id)
    }
    return NextResponse.json({ ok: true })
  }

  if (evento === 'messages.upsert') {
    const data = payload.data
    const fromMe = Boolean(data?.key?.fromMe)
    if (fromMe) {
      return NextResponse.json({ ok: true })
    }

    const remoteJid = String(data?.key?.remoteJid ?? '')
    const numero = remoteJid.split('@')[0]
    const texto = extrairTexto(data?.message) ?? '[mensagem sem texto]'
    const nomeContato = data?.pushName || numero

    if (!numero) {
      return NextResponse.json({ ok: true })
    }

    let { data: contato } = await admin
      .from('contacts')
      .select('id')
      .eq('company_id', canal.company_id)
      .eq('phone', numero)
      .maybeSingle()

    if (!contato) {
      const { data: novoContato } = await admin
        .from('contacts')
        .insert({ company_id: canal.company_id, name: nomeContato, phone: numero })
        .select('id')
        .single()
      contato = novoContato
    }

    if (!contato) {
      return NextResponse.json({ ok: true })
    }

    let { data: conversa } = await admin
      .from('conversations')
      .select('id')
      .eq('company_id', canal.company_id)
      .eq('contact_id', contato.id)
      .eq('channel_id', canal.id)
      .maybeSingle()

    if (!conversa) {
      const { data: novaConversa } = await admin
        .from('conversations')
        .insert({ company_id: canal.company_id, contact_id: contato.id, channel_id: canal.id, status: 'open' })
        .select('id')
        .single()
      conversa = novaConversa
    }

    if (!conversa) {
      return NextResponse.json({ ok: true })
    }

    await admin.from('messages').insert({
      company_id: canal.company_id,
      conversation_id: conversa.id,
      content: texto,
      direction: 'inbound',
    })
  }

  return NextResponse.json({ ok: true })
}
