import { prisma } from "@/lib/prisma"
import { createDeal } from "../actions"
import DealCard from "@/components/DealCard"
import MonthFilter from "@/components/MonthFilter" // <--- Importamos el filtro

export default async function DealsPage({
    searchParams,
  }: {
    searchParams?: Promise<{ date?: string }>;
  }) {
    
  // 1. LÓGICA DE FECHAS
  const params = await searchParams;
  const dateParam = params?.date // Formato "2024-05"
  
  // Calcular inicio y fin del mes seleccionado
  const now = new Date()
  let year = now.getFullYear()
  let month = now.getMonth() // 0 = Enero

  if (dateParam) {
      const parts = dateParam.split('-')
      year = parseInt(parts[0])
      month = parseInt(parts[1]) - 1
  }

  const startDate = new Date(year, month, 1)      // Día 1 del mes
  const endDate = new Date(year, month + 1, 0)    // Último día del mes (truco de JS)

  // 2. CONSULTA FILTRADA
  const deals = await prisma.deal.findMany({
    where: { /* ... tu lógica de fechas que ya tenías ... */ },
    
    // CAMBIAR ESTA PARTE:
    include: { 
        customer: {
            include: { user: true } // <--- Traemos al usuario dueño del cliente
        } 
    },
    
    orderBy: { createdAt: 'desc' }
})

  const customers = await prisma.customer.findMany()

  // 3. CLASIFICACIÓN (Igual que antes)
  const dealsNew = deals.filter(d => d.stage === "NUEVO")
  const dealsProcess = deals.filter(d => d.stage === "PROCESO")
  const dealsWon = deals.filter(d => d.stage === "GANADO")
  const dealsLost = deals.filter(d => d.stage === "PERDIDO")

  // Totales
  const totalPipeline = dealsNew.reduce((sum, d) => sum + d.amount, 0) + 
                        dealsProcess.reduce((sum, d) => sum + d.amount, 0)
  const totalWon = dealsWon.reduce((sum, d) => sum + d.amount, 0)
  const totalLost = dealsLost.reduce((sum, d) => sum + d.amount, 0)

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO CON FILTRO Y KPI */}
        <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Tablero de Ventas</h1>
                
                {/* AQUÍ VA EL FILTRO DE MES */}
                <MonthFilter />
            </div>
            
            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-600 text-white p-4 rounded-lg shadow">
                    <div className="text-sm opacity-80">Pipeline (Este mes)</div>
                    <div className="text-2xl font-bold">${totalPipeline.toLocaleString()}</div>
                </div>
                <div className="bg-green-600 text-white p-4 rounded-lg shadow">
                    <div className="text-sm opacity-80">Ganado (Este mes)</div>
                    <div className="text-2xl font-bold">${totalWon.toLocaleString()}</div>
                </div>
                <div className="bg-red-500 text-white p-4 rounded-lg shadow opacity-80">
                    <div className="text-sm opacity-80">Perdido (Este mes)</div>
                    <div className="text-2xl font-bold">${totalLost.toLocaleString()}</div>
                </div>
            </div>

            {/* FORMULARIO RÁPIDO (Solo aparece si estamos en el mes actual o futuro) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <form action={createDeal} className="flex flex-col md:flex-row gap-2 w-full items-end">
                    <div className="flex flex-col gap-1 w-full md:w-1/4">
                        <label className="text-xs font-bold text-gray-500">Cliente</label>
                        <select name="customerId" className="border p-2 rounded text-sm bg-gray-50 text-black h-10" required>
                            <option value="">Seleccionar...</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1 w-full md:w-1/3">
                        <label className="text-xs font-bold text-gray-500">Oportunidad</label>
                        <input name="title" type="text" placeholder="Ej: Rediseño Web" className="border p-2 rounded text-sm text-black h-10" required />
                    </div>
                    <div className="flex flex-col gap-1 w-full md:w-1/6">
                        <label className="text-xs font-bold text-gray-500">Monto</label>
                        <input name="amount" type="text" placeholder="$0" className="border p-2 rounded text-sm text-black h-10" required />
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 h-10 w-full md:w-auto">
                        + Agregar
                    </button>
                </form>
            </div>
        </div>

        {/* EL TABLERO KANBAN */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
            {/* COLUMNA 1: NUEVO */}
            <div className="bg-gray-100 p-3 rounded-lg min-h-[500px]">
                <h3 className="font-bold text-gray-500 mb-3 flex justify-between">
                    NUEVOS <span className="bg-gray-200 px-2 rounded-full text-xs py-1">{dealsNew.length}</span>
                </h3>
                {dealsNew.map(deal => (
                    <DealCard key={deal.id} id={deal.id} title={deal.title} amount={deal.amount} customerName={deal.customer.name} ownerName={deal.customer.user?.name} stage={deal.stage} />
                ))}
            </div>

            {/* COLUMNA 2: EN PROCESO */}
            <div className="bg-blue-50 p-3 rounded-lg min-h-[500px]">
                <h3 className="font-bold text-blue-800 mb-3 flex justify-between">
                    EN PROCESO <span className="bg-blue-100 px-2 rounded-full text-xs py-1">{dealsProcess.length}</span>
                </h3>
                {dealsProcess.map(deal => (
                    <DealCard key={deal.id} id={deal.id} title={deal.title} amount={deal.amount} customerName={deal.customer.name} ownerName={deal.customer.user?.name} stage={deal.stage} />
                ))}
            </div>

            {/* COLUMNA 3: GANADOS */}
            <div className="bg-green-50 p-3 rounded-lg min-h-[500px]">
                <h3 className="font-bold text-green-800 mb-3 flex justify-between">
                    GANADOS <span className="bg-green-100 px-2 rounded-full text-xs py-1">{dealsWon.length}</span>
                </h3>
                {dealsWon.map(deal => (
                    <DealCard key={deal.id} id={deal.id} title={deal.title} amount={deal.amount} customerName={deal.customer.name} ownerName={deal.customer.user?.name} stage={deal.stage} />
                ))}
            </div>

            {/* COLUMNA 4: PERDIDOS */}
            <div className="bg-red-50 p-3 rounded-lg min-h-[500px]">
                <h3 className="font-bold text-red-800 mb-3 flex justify-between">
                    PERDIDOS <span className="bg-red-100 px-2 rounded-full text-xs py-1">{dealsLost.length}</span>
                </h3>
                {dealsLost.map(deal => (
                    <DealCard key={deal.id} id={deal.id} title={deal.title} amount={deal.amount} customerName={deal.customer.name} ownerName={deal.customer.user?.name} stage={deal.stage} />
                ))}
            </div>
        </div>
      </div>
    </main>
  )
}