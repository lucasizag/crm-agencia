import { prisma } from "@/lib/prisma"
import { editCustomer } from "@/app/actions"
import Link from "next/link"

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Desempaquetamos el ID de la URL
  const { id } = await params
  const customerId = parseInt(id)
  
  // 2. Buscamos los datos actuales del cliente para pre-llenar el formulario
  const customer = await prisma.customer.findUnique({
    where: { id: customerId }
  })

  if (!customer) return <div>Cliente no encontrado</div>

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Cliente</h1>
        
        <form action={editCustomer} className="flex flex-col gap-4">
          
          {/* INPUT OCULTO CON EL ID */}
          <input type="hidden" name="id" value={customer.id} />

          <div>
            <label className="text-xs font-bold text-gray-500">Nombre y Apellido</label>
            <input name="name" defaultValue={customer.name} type="text" className="w-full border p-2 rounded text-black" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-500">Email</label>
                <input name="email" defaultValue={customer.email || ''} type="email" className="w-full border p-2 rounded text-black" />
            </div>
            <div>
                <label className="text-xs font-bold text-gray-500">Teléfono</label>
                <input name="phone" defaultValue={customer.phone || ''} type="text" className="w-full border p-2 rounded text-black" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Dirección</label>
            <input name="address" defaultValue={customer.address || ''} type="text" className="w-full border p-2 rounded text-black" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500">Redes Sociales</label>
            <input name="socialMedia" defaultValue={customer.socialMedia || ''} type="text" className="w-full border p-2 rounded text-black" />
          </div>
          
          <div className="flex gap-3 mt-4">
            <Link href="/customers" className="w-1/2 text-center py-2 border rounded text-gray-600 hover:bg-gray-100 font-medium">
                Cancelar
            </Link>
            <button 
                type="submit" 
                className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
            >
                Guardar Cambios
            </button>
          </div>

        </form>
      </div>
    </main>
  )
}