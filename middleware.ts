import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Leemos la cookie
  const userId = request.cookies.get('userId')?.value

  // Si NO hay cookie Y no estamos ya en el login, mandarlo al login
  if (!userId && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configuración: En qué rutas se ejecuta esto
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}