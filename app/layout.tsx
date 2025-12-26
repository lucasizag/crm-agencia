import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers"; // <--- Importar
import { prisma } from "@/lib/prisma"; // <--- Importar
import { logout } from "@/app/actions"; // <--- Importar logout

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi CRM Agencia",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // LOGICA PARA OBTENER USUARIO ACTUAL
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  let user = null
  
  if (userId) {
    user = await prisma.user.findUnique({
        where: { id: parseInt(userId) }
    })
  }

  return (
    <html lang="es">
      <body className={inter.className}>
        
        {/* Solo mostrar navegación si hay usuario logueado */}
        {user && (
            <nav className="bg-slate-900 text-white p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                
                <div className="flex gap-6 items-center">
                    <span className="font-bold text-xl">🚀 CRM</span>
                    <div className="space-x-4 text-sm font-medium">
                        <Link href="/" className="hover:text-blue-400 transition">Dashboard</Link>
                        <Link href="/customers" className="hover:text-blue-400 transition">Clientes</Link>
                        <Link href="/deals" className="hover:text-blue-400 transition">Ventas</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div className="text-gray-400">
                        Hola, <span className="text-white font-bold">{user.name}</span>
                    </div>
                    <form action={logout}>
                        <button className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition text-xs">
                            Salir
                        </button>
                    </form>
                </div>

            </div>
            </nav>
        )}

        {children}
      </body>
    </html>
  );
}