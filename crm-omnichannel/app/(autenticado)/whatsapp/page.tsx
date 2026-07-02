import { createClient } from '@/lib/supabase/server'
import { WhatsappConnectionPanel } from '@/components/whatsapp/connection-panel'

export const dynamic = 'force-dynamic'

export default async function WhatsappPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('company_id').eq('id', user!.id).single()

  const { data: canal } = profile?.company_id
    ? await supabase.from('channels').select('active').eq('company_id', profile.company_id).eq('type', 'whatsapp').maybeSingle()
    : { data: null }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <h2 className="font-semibold text-gray-900">Conexão WhatsApp</h2>
      </div>
      <div className="p-6">
        <WhatsappConnectionPanel conectado={canal?.active ?? false} />
      </div>
    </div>
  )
}
