import Link from 'next/link'
import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Props = {
  searchParams: Promise<{ erro?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { erro } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Entrar</h1>
          <p className="text-sm text-gray-500">
            Acesse sua conta para continuar
          </p>
        </div>

        {erro && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {decodeURIComponent(erro)}
          </div>
        )}

        <form action={login} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="voce@exemplo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Não tem conta?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}
