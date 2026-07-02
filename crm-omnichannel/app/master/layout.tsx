import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { brand } from '@/lib/brand'

export default async function LayoutMaster({
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
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'master') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-6">
          <span className="font-semibold text-gray-900">{brand.name} · Master</span>
          <nav className="flex gap-4 text-sm">
            <Link href="/master/planos" className="text-gray-600 hover:text-gray-900">
              Planos
            </Link>
            <Link href="/master/nova-empresa" className="text-gray-600 hover:text-gray-900">
              Nova empresa
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  )
}
