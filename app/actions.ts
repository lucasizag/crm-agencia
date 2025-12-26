'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers" // <--- NUEVO IMPORT

// ----------------------------------------------------
// AUTENTICACIÓN
// ----------------------------------------------------

export async function login(formData: FormData) {
    const email = formData.get("email") as string

    // TRUCO: Usamos 'upsert'.
    // Le dice a la base de datos: "Busca este email. 
    // Si existe, no hagas nada (update vacío). 
    // Si NO existe, créalo con este nombre por defecto".
    const user = await prisma.user.upsert({
        where: { email: email },
        update: {}, 
        create: {
            email: email,
            name: email.split('@')[0], // Usamos la parte antes del @ como nombre (ej: "jefe")
        }
    })

    // Ahora SÍ tenemos usuario seguro. Guardamos la cookie.
    const cookieStore = await cookies()
    cookieStore.set('userId', user.id.toString())

    redirect("/")
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    redirect("/login")
}

// Helper para obtener el usuario actual en cualquier función
async function getCurrentUser() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    
    if (!userId) return null
    return parseInt(userId)
}

// ----------------------------------------------------
// MODIFICACIONES A TUS FUNCIONES EXISTENTES
// ----------------------------------------------------

export async function createCustomer(formData: FormData) {
    const userId = await getCurrentUser()
    if (!userId) return // Seguridad básica

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const socialMedia = formData.get("socialMedia") as string

    await prisma.customer.create({
        data: {
            name, email, phone, address, socialMedia,
            userId: userId // <--- ¡AHORA USAMOS EL USUARIO LOGUEADO!
        }
    })
    revalidatePath("/customers")
}

export async function createDeal(formData: FormData) {
    const userId = await getCurrentUser() // (Opcional: si quisieras guardar quién creó la venta)
    
    // ... resto de tu código igual ...
    const title = formData.get("title") as string
    const amountRaw = formData.get("amount") as string
    const amount = parseMoney(amountRaw) 
    const customerId = parseInt(formData.get("customerId") as string)

    await prisma.deal.create({
        data: {
            title, amount, stage: "NUEVO", customerId
        }
    })
    revalidatePath("/deals")
}

// ... mantén editCustomer, editDeal, updateDealStatus, addNote igual ...
// (Asegúrate de copiar también la función parseMoney que hicimos antes)
function parseMoney(amountString: string): number {
    if (!amountString) return 0
    let clean = amountString.toString().replace('$', '').trim()
    clean = clean.replace(/\./g, '')
    clean = clean.replace(',', '.')
    return parseFloat(clean)
}

// ... Resto de funciones edit/update ...
// IMPORTANTE: Asegúrate de que las funciones editCustomer y editDeal sigan existiendo.
// Si las borraste al pegar esto, vuélvelas a agregar.
export async function editCustomer(formData: FormData) {
    const id = parseInt(formData.get("id") as string)
    await prisma.customer.update({
        where: { id },
        data: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            address: formData.get("address") as string,
            socialMedia: formData.get("socialMedia") as string
        }
    })
    redirect("/customers")
}

export async function updateDealStatus(dealId: number, newStage: string) {
    await prisma.deal.update({ where: { id: dealId }, data: { stage: newStage } })
    revalidatePath("/deals")
}

export async function editDeal(formData: FormData) {
    const id = parseInt(formData.get("id") as string)
    const amount = parseMoney(formData.get("amount") as string)
    await prisma.deal.update({
        where: { id },
        data: { title: formData.get("title") as string, amount }
    })
    redirect("/deals")
}

export async function addNote(formData: FormData) {
    const text = formData.get("text") as string
    const dealId = parseInt(formData.get("dealId") as string)
    if (!text) return
    await prisma.note.create({ data: { text, dealId } })
    revalidatePath(`/deals/${dealId}/edit`)
}