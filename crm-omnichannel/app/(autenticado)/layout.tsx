import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/sidebar'

export default async function LayoutAutenticado({
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

  return (
    <div className="flex h-full">
      <Sidebar userEmail={user.email ?? ''} />
      <main className="flex flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
