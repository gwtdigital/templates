import Link from 'next/link'
import { brand } from '@/lib/brand'

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white/60">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-bold text-gray-900">{brand.name}</span>
            <p className="mt-3 text-sm text-gray-500">{brand.tagline}</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Produto</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <a href="#recursos" className="hover:text-gray-900">
                  Recursos
                </a>
              </li>
              <li>
                <a href="#como-funciona" className="hover:text-gray-900">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#planos" className="hover:text-gray-900">
                  Planos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Conta</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <Link href="/login" className="hover:text-gray-900">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-gray-900">
                  Testar grátis
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Suporte</h4>
            <ul className="mt-3 space-y-2 text-sm text-gray-500">
              <li>
                <a href="#faq" className="hover:text-gray-900">
                  Perguntas frequentes
                </a>
              </li>
              {brand.supportWhatsappUrl && (
                <li>
                  <a href={brand.supportWhatsappUrl} className="hover:text-gray-900">
                    WhatsApp: {brand.supportWhatsappDisplay}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
