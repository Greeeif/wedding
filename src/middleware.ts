import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {

  
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === '/login';
  
  // Allow access to login page
  if (isOnLoginPage) {
    console.log('Allowing access to login page');
    return NextResponse.next();
  }
  
  // Protect all other routes - redirect to login if not authenticated
  if (!isLoggedIn) {
    console.log('NOT LOGGED IN - Redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  console.log('User is authenticated - allowing access');
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};