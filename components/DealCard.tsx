"use client"

import { updateDealStatus } from "@/app/actions"
import Link from "next/link"

type DealCardProps = {
    id: number
    title: string
    amount: number
    customerName: string
    ownerName?: string | null // <--- NUEVO CAMPO (Puede venir vacío)
    stage: string
}

export default function DealCard({ id, title, amount, customerName, ownerName, stage }: DealCardProps) {
    
    const move = (newStage: string) => {
        updateDealStatus(id, newStage)
    }

    // Obtener iniciales (Ej: "Carlos Jefe" -> "CJ")
    const initials = ownerName 
        ? ownerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        : '??'

    return (
        <div className="bg-white p-3 rounded shadow-sm border border-gray-200 mb-3 hover:shadow-md transition relative group">
            
            <div className="flex justify-between items-start mb-1 gap-2">
                <div className="font-bold text-gray-800 break-words leading-tight">{title}</div>
                <Link 
                    href={`/deals/${id}/edit`} 
                    className="text-gray-400 hover:text-blue-600 px-1 shrink-0"
                    title="Editar"
                >
                    ✏️
                </Link>
            </div>

            <div className="flex justify-between items-end mb-3">
                <div className="text-xs text-gray-500">{customerName}</div>
                
                {/* INSIGNIA DEL DUEÑO */}
                {ownerName && (
                    <div className="text-[10px] font-bold bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center title-owner" title={`Account Manager: ${ownerName}`}>
                        {initials}
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center mb-3 border-t pt-2 border-gray-50">
                <span className="font-bold text-green-700">${amount.toLocaleString()}</span>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-1 text-xs">
                {stage === "NUEVO" && (
                    <button onClick={() => move("PROCESO")} className="bg-blue-50 text-blue-600 px-2 py-1 rounded w-full hover:bg-blue-100 border border-blue-100">
                        → Avanzar
                    </button>
                )}
                
                {stage === "PROCESO" && (
                    <>
                        <button onClick={() => move("GANADO")} className="bg-green-50 text-green-600 px-2 py-1 rounded w-1/2 hover:bg-green-100 border border-green-100">
                            ✔ Ganar
                        </button>
                        <button onClick={() => move("PERDIDO")} className="bg-red-50 text-red-600 px-2 py-1 rounded w-1/2 hover:bg-red-100 border border-red-100">
                            X
                        </button>
                    </>
                )}

                {(stage === "GANADO" || stage === "PERDIDO") && (
                     <button onClick={() => move("NUEVO")} className="bg-gray-50 text-gray-500 px-2 py-1 rounded w-full hover:bg-gray-100 border border-gray-200">
                        ↺ Reiniciar
                    </button>
                )}
            </div>
        </div>
    )
}