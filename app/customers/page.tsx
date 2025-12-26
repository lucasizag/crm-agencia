import { prisma } from "@/lib/prisma"
import { createCustomer } from "@/app/actions"
import Search from "@/components/Search"
import Link from "next/link" // <--- IMPORTANTE: Esto lo necesitábamos para el botón

export default async function CustomersPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  
  const params = await searchParams;
  const query = params?.query || '';

  const customers = await prisma.customer.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { email: { contains: query } },
        { company: { contains: query } },
        { phone: { contains: query } }
      ]
    },
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { deals: true } } }
  })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Cartera de Clientes</h1>
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-6 w-full md:w-1/2">
            <Search placeholder="Buscar por nombre, email o teléfono..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* FORMULARIO DE REGISTRO */}
          <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4 text-blue-600">Registrar Nuevo</h2>
            <form action={createCustomer} className="flex flex-col gap-3">
              
              <div>
                <label className="text-xs font-bold text-gray-500">Nombre y Apellido *</label>
                <input name="name" type="text" className="w-full border p-2 rounded text-black" required />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                    <label className="text-xs font-bold text-gray-500">Email</label>
                    <input name="email" type="email" className="w-full border p-2 rounded text-black" />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500">Teléfono</label>
                    <input name="phone" type="text" className="w-full border p-2 rounded text-black" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500">Dirección</label>
                <input name="address" type="text" placeholder="Calle 123, Ciudad" className="w-full border p-2 rounded text-black" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500">Redes Sociales / Link</label>
                <input name="socialMedia" type="text" placeholder="@instagram" className="w-full border p-2 rounded text-black" />
              </div>
              
              <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold mt-2">
                Guardar Cliente
              </button>
            </form>
          </div>

          {/* LISTA DE CLIENTES (AQUÍ ESTÁ EL CAMBIO) */}
          <div className="md:col-span-2 space-y-4">
            {customers.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition flex flex-col md:flex-row justify-between md:items-center gap-4 group">
                <div>
                    <div className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        {c.name}
                        
                        {/* --- AQUÍ ESTÁ EL LÁPIZ --- */}
                        <Link 
                            href={`/customers/${c.id}/edit`} 
                            className="opacity-100 md:opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-blue-600 ml-2"
                            title="Editar Cliente"
                        >
                            ✏️
                        </Link>
                        {/* ------------------------- */}

                        {c.socialMedia && (
                            <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full border border-pink-200">
                                {c.socialMedia}
                            </span>
                        )}
                    </div>
                    
                    <div className="text-gray-500 text-sm mt-1 space-y-1">
                        <div>📧 {c.email || '-'} &nbsp; • &nbsp; 📞 {c.phone || '-'}</div>
                        {c.address && <div className="text-xs text-gray-400">📍 {c.address}</div>}
                    </div>
                </div>

                <div className="text-right shrink-0">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">
                        {c._count.deals} Negocios
                    </span>
                </div>
              </div>
            ))}
            
            {customers.length === 0 && (
                <div className="p-10 text-center text-gray-500 bg-white rounded-lg border border-dashed">
                    No se encontraron clientes.
                </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}