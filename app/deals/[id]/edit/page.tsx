import { prisma } from "@/lib/prisma"
import { editDeal, addNote } from "@/app/actions"
import Link from "next/link"

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dealId = parseInt(id)
  
  // 1. Buscamos la venta, el cliente Y EL USUARIO dueño del cliente
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { 
        customer: {
            include: { user: true } // <--- Traemos al dueño (User)
        },
        notes: { orderBy: { createdAt: 'desc' } } 
    }
  })

  if (!deal) return <div>Venta no encontrada</div>

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="flex items-center gap-4 mb-6">
            <Link href="/deals" className="text-gray-500 hover:text-gray-800">← Volver al Tablero</Link>
            <h1 className="text-2xl font-bold text-gray-800">Gestionar Venta</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* COLUMNA IZQUIERDA: DATOS DUROS */}
            <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
                
                {/* --- NUEVO: Tarjeta del Responsable --- */}
                <div className="mb-6 bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center gap-3">
                    <div className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                         {deal.customer.user?.name ? deal.customer.user.name.substring(0,2).toUpperCase() : '?'}
                    </div>
                    <div>
                        <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Vendedor a Cargo</div>
                        <div className="text-sm font-bold text-slate-800">
                            {deal.customer.user?.name || 'Desconocido'}
                        </div>
                    </div>
                </div>
                {/* ------------------------------------- */}

                <h2 className="font-bold text-lg mb-4 text-blue-600">Editar Datos</h2>
                
                <form action={editDeal} className="flex flex-col gap-4">
                    <input type="hidden" name="id" value={deal.id} />

                    <div>
                        <label className="text-xs font-bold text-gray-500">Cliente</label>
                        <div className="text-gray-800 font-medium text-lg">{deal.customer.name}</div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500">Título de la Oportunidad</label>
                        <input name="title" defaultValue={deal.title} type="text" className="w-full border p-2 rounded text-black mt-1" />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500">Monto</label>
                        <input name="amount" defaultValue={deal.amount} type="text" className="w-full border p-2 rounded text-black mt-1" />
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold mt-2">
                        Guardar Cambios
                    </button>
                </form>
            </div>

            {/* COLUMNA DERECHA: HISTORIAL / NOTAS */}
            <div className="md:col-span-2 space-y-4">
                
                {/* CAJA PARA ESCRIBIR NOTA */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-700 mb-2">Agregar Nota / Actividad</h3>
                    <form action={addNote} className="flex gap-2">
                        <input type="hidden" name="dealId" value={deal.id} />
                        <input 
                            name="text" 
                            type="text" 
                            placeholder="Ej: Llamé al cliente, quedamos en hablar el lunes..." 
                            className="flex-1 border p-2 rounded text-black"
                            autoComplete="off"
                            required
                        />
                        <button type="submit" className="bg-gray-800 text-white px-4 rounded font-bold hover:bg-black">
                            Enviar
                        </button>
                    </form>
                </div>

                {/* LISTA DE ACTIVIDAD */}
                <div className="bg-white p-6 rounded-xl shadow-sm min-h-[400px]">
                    <h3 className="font-bold text-gray-500 mb-4 border-b pb-2">Historial de Actividad</h3>
                    
                    <div className="space-y-6">
                        {deal.notes.map((note) => (
                            <div key={note.id} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                    <div className="w-0.5 h-full bg-gray-100 mt-1"></div>
                                </div>
                                
                                <div className="pb-2">
                                    <div className="text-gray-800 text-sm">{note.text}</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {new Date(note.createdAt).toLocaleString('es-AR', { 
                                            day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' 
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {deal.notes.length === 0 && (
                            <div className="text-center text-gray-400 italic py-10">
                                No hay notas. Escribe la primera arriba.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </main>
  )
}