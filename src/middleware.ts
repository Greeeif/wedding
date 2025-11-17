import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the session token from cookies
  const sessionToken = request.cookies.get('authjs.session-token')?.value || 
                      request.cookies.get('__Secure-authjs.session-token')?.value;
  
  const isLoggedIn = !!sessionToken;
  const isOnLoginPage = request.nextUrl.pathname === '/login';
  
  // Allow access to login page
  if (isOnLoginPage) {
    // If already logged in, redirect to home
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
  
  // Protect all other routes - redirect to login if not authenticated
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (API routes handle their own auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};