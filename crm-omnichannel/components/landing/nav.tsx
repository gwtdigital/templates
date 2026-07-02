import Link from 'next/link'
import { brand } from '@/lib/brand'

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-[var(--color-background)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-bold text-gray-900">{brand.name}</span>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <a href="#recursos" className="hover:text-gray-900">
            Recursos
          </a>
          <a href="#como-funciona" className="hover:text-gray-900">
            Como funciona
          </a>
          <a href="#planos" className="hover:text-gray-900">
            Planos
          </a>
          <a href="#faq" className="hover:text-gray-900">
            Perguntas frequentes
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Entrar
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
          >
            Testar grátis por 3 dias
          </Link>
        </div>
      </div>
    </header>
  )
}
