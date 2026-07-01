import Link from 'next/link'
import { brand } from '@/lib/brand'
import { trialDaysRemaining, type Subscription } from '@/lib/subscriptions'

export function TrialBanner({ subscription }: { subscription: Subscription }) {
  const dias = trialDaysRemaining(subscription)
  const linkAssinar = subscription.checkout_url || brand.supportWhatsappUrl || '/master/nova-empresa'

  return (
    <div className="flex items-center justify-between gap-4 bg-red-600 px-4 py-2 text-sm text-white">
      <span>
        {dias > 0
          ? `Você tem ${dias} dia${dias === 1 ? '' : 's'} grátis restante${dias === 1 ? '' : 's'}.`
          : 'Seu período grátis termina hoje.'}
      </span>
      <Link href={linkAssinar} className="shrink-0 font-semibold underline hover:no-underline">
        Assinar agora
      </Link>
    </div>
  )
}
