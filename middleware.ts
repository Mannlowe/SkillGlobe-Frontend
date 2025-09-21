import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/',
  '/api', // Allow API routes
];

// Define routes that should redirect to login if not authenticated
const protectedRoutes = [
  '/business-dashboard',
  '/individual-dashboard',
  '/profiles',
  '/portfolio',
  '/settings',
  '/company-profile',
  '/job-postings',
  '/job-applied-users',
  '/closed-opportunities',
  '/business-team-member',
];

// Helper function to check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === '/') {
      return pathname === '/';
    }
    if (route === '/api') {
      return pathname.startsWith('/api/');
    }
    return pathname.startsWith(route);
  });
}

// Helper function to check if a route is protected
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

// Helper function to check authentication from cookies/headers
function isAuthenticated(request: NextRequest): boolean {
  // Check for auth token in cookies (set by AuthWrapper)
  const authToken = request.cookies.get('auth_token')?.value;
  
  // Check Zustand persist storage cookie
  const authStorage = request.cookies.get('auth-storage')?.value;
  
  if (authToken && authToken !== '') {
    return true;
  }
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authStorage));
      return parsed.state?.isAuthenticated === true && parsed.state?.token;
    } catch (error) {
      // If parsing fails, assume not authenticated
      return false;
    }
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') ||
    pathname.startsWith('/Images/') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }
  
  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Check authentication for protected routes
  if (isProtectedRoute(pathname)) {
    const authenticated = isAuthenticated(request);
    
    if (!authenticated) {
      // Store the original URL to redirect back after login
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|Images|public).*)',
  ],
};
