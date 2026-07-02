'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Inbox, Users, Kanban, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { brand } from '@/lib/brand'

const itensNavegacao = [
  { href: '/dashboard', label: 'Dashboard', icone: LayoutDashboard },
  { href: '/inbox', label: 'Inbox', icone: Inbox },
  { href: '/contatos', label: 'Contatos', icone: Users },
  { href: '/pipeline', label: 'Pipeline', icone: Kanban },
]

type Props = {
  userEmail: string
}

export function Sidebar({ userEmail }: Props) {
  const pathname = usePathname()

  return (
    <aside className="flex w-60 flex-col border-r border-gray-200 bg-white">
      <div className="flex h-14 items-center border-b border-gray-200 px-4">
        <span className="font-semibold text-gray-900">{brand.name}</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {itensNavegacao.map(({ href, label, icone: Icone }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <Icone className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <div className="mb-2 px-2 text-xs text-gray-400 truncate">{userEmail}</div>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
