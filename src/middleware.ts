import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected and public routes
const protectedRoutes = ['/dashboard', '/alunos', '/professores', '/turmas', '/calendario', '/administrativo']
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value
    const { pathname } = request.nextUrl

    // 1. If trying to access a protected route without a token, redirect to login
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute && !token) {
        const response = NextResponse.redirect(new URL('/login', request.url))
        // We can also clear any stale state if needed
        return response
    }

    // 2. If trying to access auth routes (login/signup) with a valid token, redirect to dashboard
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

// Configure which routes should be processed by the middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
