import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  // 1. OBTENER MÉTRICAS
  const totalCustomers = await prisma.customer.count()
  
  const wonDeals = await prisma.deal.aggregate({
    where: { stage: 'GANADO' },
    _sum: { amount: true }
  })

  const pipelineDeals = await prisma.deal.aggregate({
    where: { stage: { in: ['NUEVO', 'PROCESO'] } },
    _sum: { amount: true }
  })

  // 2. OBTENER ÚLTIMA ACTIVIDAD
  const recentNotes = await prisma.note.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
        deal: {
            include: { customer: true }
        }
    }
  })

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
            <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
        </div>

        {/* TARJETAS DE MÉTRICAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">Ingresos Totales (Ganado)</div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                    ${wonDeals._sum.amount?.toLocaleString() || 0}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">Dinero en Pipeline</div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                    ${pipelineDeals._sum.amount?.toLocaleString() || 0}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 text-sm font-medium">Cartera de Clientes</div>
                <div className="text-3xl font-bold text-gray-800 mt-2">
                    {totalCustomers}
                </div>
                <div className="mt-2 text-xs text-blue-500 hover:underline">
                    <Link href="/customers">+ Ver clientes</Link>
                </div>
            </div>
        </div>

        {/* SECCIÓN PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: Accesos */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
                    <h3 className="font-bold text-lg mb-2">Acciones Rápidas</h3>
                    <p className="text-slate-300 text-sm mb-6">Gestiona tus relaciones comerciales.</p>
                    
                    <div className="space-y-3">
                        <Link href="/deals" className="block w-full text-center bg-white text-slate-900 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                            Ir al Tablero Kanban →
                        </Link>
                        <Link href="/customers" className="block w-full text-center border border-white/20 text-white py-3 rounded-lg hover:bg-white/10 transition">
                            Gestionar Clientes
                        </Link>
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: Feed de Actividad */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6">Última Actividad</h3>
                
                <div className="space-y-6">
                    {recentNotes.map((note) => (
                        <div key={note.id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0">
                            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                                {note.deal.customer.name.substring(0,2).toUpperCase()}
                            </div>
                            <div>
                                <div className="text-sm text-gray-800">
                                    <span className="font-bold">Nota en "{note.deal.title}"</span>
                                    <span className="text-gray-400 mx-2">•</span>
                                    <span className="text-gray-500 text-xs">{note.deal.customer.name}</span>
                                </div>
                                <p className="text-gray-600 mt-1 text-sm bg-gray-50 p-2 rounded block">
                                    "{note.text}"
                                </p>
                                <div className="text-xs text-gray-400 mt-2">
                                    {note.createdAt.toLocaleDateString()} a las {note.createdAt.toLocaleTimeString()}
                                </div>
                            </div>
                        </div>
                    ))}

                    {recentNotes.length === 0 && (
                        <p className="text-gray-400 italic">No hay actividad reciente.</p>
                    )}
                </div>
            </div>

        </div>
      </div>
    </main>
  )
}