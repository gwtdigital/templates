import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateCompanyName, createFirstChannel, finishOnboarding } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { brand } from '@/lib/brand'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ step?: string }>
}

export default async function OnboardingPage({ searchParams }: Props) {
  const { step: stepParam } = await searchParams
  const step = Number(stepParam ?? '1')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id, onboarding_completed_at')
    .eq('id', user.id)
    .single()

  // Sem empresa vinculada (ex.: cadastro self-service ou usuário Master) —
  // não há onboarding de trial pra fazer.
  if (!profile?.company_id) redirect('/inbox')
  if (profile.onboarding_completed_at) redirect('/inbox')

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('id', profile.company_id)
    .single()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo ao {brand.name}</h1>
          <p className="text-sm text-gray-500">Passo {Math.min(step, 3)} de 3</p>
        </div>

        {step <= 1 && (
          <form action={updateCompanyName} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="empresaNome">Confirme o nome da sua empresa</Label>
              <Input id="empresaNome" name="empresaNome" defaultValue={company?.name ?? ''} required />
            </div>
            <Button type="submit" className="w-full">
              Continuar
            </Button>
          </form>
        )}

        {step === 2 && (
          <form action={createFirstChannel} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="canalNome">Dê um nome pro seu primeiro canal de WhatsApp</Label>
              <Input id="canalNome" name="canalNome" placeholder="Ex: WhatsApp Comercial" required />
              <p className="text-xs text-gray-500">
                A conexão do número acontece depois, dentro do painel.
              </p>
            </div>
            <Button type="submit" className="w-full">
              Continuar
            </Button>
          </form>
        )}

        {step >= 3 && (
          <form action={finishOnboarding} className="space-y-4">
            <p className="text-sm text-gray-600">
              Tudo pronto. Seu período grátis já está ativo — sem cartão de crédito.
            </p>
            <Button type="submit" className="w-full">
              Ir para o painel
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
