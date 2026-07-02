import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getActivePlans } from '@/lib/plans'
import { PricingCard } from '@/components/landing/pricing-card'
import { LandingNav } from '@/components/landing/nav'
import { Hero } from '@/components/landing/hero'
import { TrustStrip } from '@/components/landing/trust-strip'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { FaqSection } from '@/components/landing/faq-section'
import { FinalCta } from '@/components/landing/final-cta'
import { LandingFooter } from '@/components/landing/footer'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  const planos = await getActivePlans()

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <LandingNav />
      <Hero />
      <TrustStrip />
      <FeaturesSection />
      <HowItWorks />

      <section id="planos" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Planos</h2>
          <p className="mt-3 text-gray-600">
            Escolha o plano ideal pra fase da sua operação. Todos com dias grátis, sem cartão.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {planos.map((plano) => (
            <PricingCard key={plano.id} plano={plano} />
          ))}
        </div>
      </section>

      <FaqSection />
      <FinalCta />
      <LandingFooter />
    </div>
  )
}
