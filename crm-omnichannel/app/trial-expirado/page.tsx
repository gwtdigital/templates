import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCompanySubscription, isTrialExpired } from '@/lib/subscriptions'
import { logout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/brand'

export const dynamic = 'force-dynamic'

export default async function TrialExpiradoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  const subscription = profile?.company_id ? await getCompanySubscription(profile.company_id) : null

  // Se o trial ainda está válido (ou já foi regularizado), não há motivo pra bloquear.
  if (!subscription || !isTrialExpired(subscription)) {
    redirect('/inbox')
  }

  const linkAssinar = subscription.checkout_url || brand.supportWhatsappUrl || '/master/nova-empresa'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">Seu período grátis terminou</h1>
        <p className="text-sm text-gray-600">
          Seu acesso ao {brand.name} foi pausado. Assine agora pra continuar atendendo seus clientes sem perder
          o histórico.
        </p>
        <Button asChild className="w-full">
          <a href={linkAssinar}>Assinar agora</a>
        </Button>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 underline hover:no-underline">
            Sair
          </button>
        </form>
      </div>
    </div>
  )
}
