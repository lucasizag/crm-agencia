import { login } from "@/app/actions"

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">CRM Agencia</h1>
        <p className="text-center text-gray-500 mb-6">Inicia sesión para vender</p>
        
        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500">Email Corporativo</label>
            <input 
                name="email" 
                type="email" 
                placeholder="ej: jefe@crm.com" 
                className="w-full border p-3 rounded-lg text-black mt-1"
                required 
            />
          </div>

          <button className="bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Entrar
          </button>
        </form>
        
        <div className="mt-4 text-center text-xs text-gray-400">
            Prueba con: jefe@crm.com o vendedor@crm.com
        </div>
      </div>
    </main>
  )
}