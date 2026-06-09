import { Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Contact } from '@/types/database'

export default async function ContatosPage() {
  const supabase = await createClient()

  const { data: contatos } = await supabase
    .from('contacts')
    .select('*')
    .order('name', { ascending: true })

  const lista = (contatos as Contact[]) ?? []

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-14 items-center border-b border-gray-200 px-6">
        <h2 className="font-semibold text-gray-900">Contatos</h2>
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <Users className="h-10 w-10 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">Nenhum contato ainda</p>
          <p className="text-xs text-gray-400">
            Os contatos aparecerão aqui quando chegarem conversas
          </p>
        </div>
      ) : (
        <div className="overflow-auto p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
                <th className="pb-3 font-medium">Nome</th>
                <th className="pb-3 font-medium">E-mail</th>
                <th className="pb-3 font-medium">Telefone</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((contato) => (
                <tr
                  key={contato.id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-3 font-medium text-gray-900">{contato.name}</td>
                  <td className="py-3 text-gray-500">{contato.email ?? '—'}</td>
                  <td className="py-3 text-gray-500">{contato.phone ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
