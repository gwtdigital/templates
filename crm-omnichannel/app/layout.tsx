import type { Metadata, Viewport } from 'next'
import './globals.css'
import { brand } from '@/lib/brand'

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: `${brand.name} centraliza atendimento, CRM e agentes de IA treinados pro seu negócio — sem perder lead, sem aumentar sua equipe.`,
}

export const viewport: Viewport = {
  themeColor: brand.primary,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full antialiased">{children}</body>
    </html>
  )
}
