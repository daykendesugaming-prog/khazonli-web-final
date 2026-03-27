import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { locales, localePrefix, defaultLocale } from './i18n/navigation'

export default async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // 1. Configurar Supabase para leer cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. IMPORTANTE: Usar getUser() para validar la cookie
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // 3. REGLA DE SEGURIDAD ADMIN
  if (pathname.startsWith('/admin')) {
    const ADMIN_EMAIL = "leafarevalen@gmail.com";

    console.log("🛠️ Middleare Admin Check - Usuario:", user?.email || "SIN COOKIE");

    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return response;
  }

  // 4. LÓGICA DE IDIOMAS
  const handleIntl = createIntlMiddleware({ locales, defaultLocale, localePrefix });
  return handleIntl(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}