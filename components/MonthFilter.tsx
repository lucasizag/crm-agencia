'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function MonthFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()

    // 1. Leer fecha de la URL o usar la actual
    const dateParam = searchParams.get('date')
    const currentDate = dateParam ? new Date(dateParam + '-02') : new Date() // El '-02' es un truco para evitar problemas de zona horaria

    // 2. Formatear para mostrar (Ej: "Diciembre 2025")
    const label = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    
    // 3. Función para cambiar mes
    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate)
        newDate.setMonth(newDate.getMonth() + offset)
        
        // Convertir a formato YYYY-MM para la URL
        const year = newDate.getFullYear()
        const month = String(newDate.getMonth() + 1).padStart(2, '0')
        const dateString = `${year}-${month}`
        
        router.push(`/deals?date=${dateString}`)
    }

    return (
        <div className="flex items-center bg-white rounded-lg border shadow-sm px-2 py-1">
            <button 
                onClick={() => changeMonth(-1)} 
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 font-bold"
            >
                ←
            </button>
            
            <div className="px-4 font-bold text-gray-800 capitalize min-w-[140px] text-center">
                {label}
            </div>
            
            <button 
                onClick={() => changeMonth(1)} 
                className="p-2 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 font-bold"
            >
                →
            </button>

            {/* Botón para volver a "HOY" si estamos lejos */}
            {dateParam && (
                <button 
                    onClick={() => router.push('/deals')} 
                    className="ml-2 text-xs text-blue-500 hover:underline"
                >
                    Hoy
                </button>
            )}
        </div>
    )
}