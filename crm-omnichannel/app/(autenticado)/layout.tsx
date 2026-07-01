import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/sidebar'
import { TrialBanner } from '@/components/trial-banner'
import { getCompanySubscription, isTrialExpired } from '@/lib/subscriptions'

export default async function LayoutAutenticado({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, onboarding_completed_at')
    .eq('id', user.id)
    .single()

  let subscription = null
  if (profile?.company_id) {
    if (!profile.onboarding_completed_at) {
      redirect('/onboarding')
    }

    subscription = await getCompanySubscription(profile.company_id)

    if (subscription && isTrialExpired(subscription)) {
      redirect('/trial-expirado')
    }
  }

  return (
    <div className="flex h-full flex-col">
      {subscription?.status === 'trialing' && <TrialBanner subscription={subscription} />}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userEmail={user.email ?? ''} />
        <main className="flex flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
