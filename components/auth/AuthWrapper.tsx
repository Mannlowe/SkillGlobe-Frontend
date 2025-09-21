'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Define public routes that don't require authentication
const publicRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/',
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
    return pathname.startsWith(route);
  });
}

// Helper function to check if a route is protected
function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route));
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isAuthenticated, token, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Set auth token as cookie for middleware to access
    if (token && isAuthenticated) {
      document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Strict`;
      
      // Also set the auth storage as cookie for middleware
      const authStorageData = localStorage.getItem('auth-storage');
      if (authStorageData) {
        document.cookie = `auth-storage=${encodeURIComponent(authStorageData)}; path=/; max-age=86400; SameSite=Strict`;
      }
    } else {
      // Clear auth cookies if not authenticated
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    const checkAuth = () => {
      // Allow public routes
      if (isPublicRoute(pathname)) {
        setShouldRender(true);
        setIsLoading(false);
        return;
      }

      // Check authentication for protected routes
      if (isProtectedRoute(pathname)) {
        if (!isAuthenticated || !token) {
          // Store the current URL to redirect back after login
          const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
          const loginUrl = `/auth/login?redirect=${encodeURIComponent(currentUrl)}`;
          
          router.replace(loginUrl);
          return;
        }
      }

      setShouldRender(true);
      setIsLoading(false);
    };

    // Small delay to allow Zustand to hydrate from localStorage
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams, isAuthenticated, token, router]);

  // Handle redirect after successful login
  useEffect(() => {
    if (isAuthenticated && pathname === '/auth/login') {
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        // Default redirect based on user type
        const roles = user?.roles;
        let isBusinessUser = false;
        
        if (Array.isArray(roles)) {
          isBusinessUser = roles.includes('Business Admin') || roles.includes('Business User');
        } else if (typeof roles === 'string') {
          isBusinessUser = roles.includes('Business Admin') || roles.includes('Business User');
        }
        
        if (user?.user_type === 'Business' || isBusinessUser) {
          router.replace('/business-dashboard');
        } else {
          router.replace('/individual-dashboard');
        }
      }
    }
  }, [isAuthenticated, pathname, searchParams, router, user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Only render children if authentication check passed
  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
