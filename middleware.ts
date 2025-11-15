import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  console.log('Middleware running for:', req.nextUrl.pathname);
  console.log('Is logged in:', !!req.auth);
  
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === '/login';
  
  // If not logged in and not on login page, redirect to login
  if (!isLoggedIn && !isOnLoginPage) {
    console.log('Redirecting to login...');
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // If logged in and on login page, redirect to main site
  if (isLoggedIn && isOnLoginPage) {
    console.log('Redirecting to home...');
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};