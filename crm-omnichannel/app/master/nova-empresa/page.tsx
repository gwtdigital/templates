import { listPlansBasic, formatPrecoBRL } from '@/lib/plans'
import { createCompanyWithOwner } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ erro?: string; sucesso?: string }>
}

export default async function NovaEmpresaPage({ searchParams }: Props) {
  const { erro, sucesso } = await searchParams
  const planos = await listPlansBasic()

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Nova empresa</h1>

      {sucesso && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          Empresa criada com sucesso. O trial já está ativo para o dono.
        </div>
      )}

      {erro && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{decodeURIComponent(erro)}</div>
      )}

      <form action={createCompanyWithOwner} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-1.5">
          <Label htmlFor="empresaNome">Nome da empresa</Label>
          <Input id="empresaNome" name="empresaNome" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ownerNome">Nome do responsável</Label>
          <Input id="ownerNome" name="ownerNome" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ownerEmail">E-mail do responsável</Label>
          <Input id="ownerEmail" name="ownerEmail" type="email" required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ownerSenha">Senha inicial</Label>
          <Input id="ownerSenha" name="ownerSenha" type="password" minLength={6} required />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="planId">Plano</Label>
          <select
            id="planId"
            name="planId"
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {planos.map((plano) => (
              <option key={plano.id} value={plano.id}>
                {plano.nome} — {formatPrecoBRL(plano.preco_cents)}/mês ({plano.trial_days} dias grátis)
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full">
          Criar empresa
        </Button>
      </form>
    </div>
  )
}
