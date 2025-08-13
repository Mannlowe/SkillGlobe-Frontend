'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

interface ApiProviderState {
  isOnline: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  retryCount: number;
  lastError: string | null;
}

interface ApiProviderContextType extends ApiProviderState {
  retry: () => void;
  clearError: () => void;
  checkConnection: () => Promise<boolean>;
}

const ApiProviderContext = createContext<ApiProviderContextType | undefined>(undefined);

interface ApiProviderProps {
  children: React.ReactNode;
  maxRetries?: number;
  retryDelay?: number;
}

export function ApiProvider({ 
  children, 
  maxRetries = 3, 
  retryDelay = 1000 
}: ApiProviderProps) {
  const [state, setState] = useState<ApiProviderState>({
    isOnline: navigator.onLine,
    connectionQuality: 'excellent',
    retryCount: 0,
    lastError: null,
  });

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setState(prev => ({ 
        ...prev, 
        isOnline: true, 
        connectionQuality: 'excellent',
        retryCount: 0,
        lastError: null 
      }));
    };

    const handleOffline = () => {
      setState(prev => ({ 
        ...prev, 
        isOnline: false, 
        connectionQuality: 'offline' 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Connection quality monitoring
  useEffect(() => {
    const measureConnectionSpeed = async () => {
      if (!state.isOnline) return;

      try {
        const startTime = performance.now();
        await fetch('/api/ping', { method: 'HEAD' });
        const endTime = performance.now();
        const latency = endTime - startTime;

        let quality: ApiProviderState['connectionQuality'];
        if (latency < 100) quality = 'excellent';
        else if (latency < 300) quality = 'good';
        else quality = 'poor';

        setState(prev => ({ ...prev, connectionQuality: quality }));
      } catch {
        setState(prev => ({ ...prev, connectionQuality: 'poor' }));
      }
    };

    const interval = setInterval(measureConnectionSpeed, 30000); // Check every 30 seconds
    measureConnectionSpeed(); // Initial check

    return () => clearInterval(interval);
  }, [state.isOnline]);

  const checkConnection = async (): Promise<boolean> => {
    try {
      await apiService.getDashboardAnalytics();
      setState(prev => ({ 
        ...prev, 
        isOnline: true, 
        connectionQuality: 'excellent',
        lastError: null 
      }));
      return true;
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        lastError: error.message,
        connectionQuality: 'poor' 
      }));
      return false;
    }
  };

  const retry = async () => {
    if (state.retryCount >= maxRetries) {
      setState(prev => ({ 
        ...prev, 
        lastError: 'Maximum retry attempts reached. Please check your connection.' 
      }));
      return;
    }

    setState(prev => ({ ...prev, retryCount: prev.retryCount + 1 }));

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, retryDelay * state.retryCount));

    const isConnected = await checkConnection();
    if (isConnected) {
      setState(prev => ({ ...prev, retryCount: 0, lastError: null }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, lastError: null, retryCount: 0 }));
  };

  const value: ApiProviderContextType = {
    ...state,
    retry,
    clearError,
    checkConnection,
  };

  return (
    <ApiProviderContext.Provider value={value}>
      {children}
    </ApiProviderContext.Provider>
  );
}

export function useApiProvider() {
  const context = useContext(ApiProviderContext);
  if (context === undefined) {
    throw new Error('useApiProvider must be used within an ApiProvider');
  }
  return context;
}

// Connection status indicator component
export function ConnectionStatus() {
  const { isOnline, connectionQuality, lastError, retry, clearError } = useApiProvider();

  if (isOnline && !lastError) return null;

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    switch (connectionQuality) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (lastError) return 'Connection Error';
    switch (connectionQuality) {
      case 'excellent': return 'Excellent Connection';
      case 'good': return 'Good Connection';
      case 'poor': return 'Poor Connection';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{getStatusText()}</p>
            {lastError && (
              <p className="text-xs text-gray-600 mt-1">{lastError}</p>
            )}
          </div>
          {lastError && (
            <div className="flex space-x-2">
              <button
                onClick={retry}
                className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
              >
                Retry
              </button>
              <button
                onClick={clearError}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Error boundary for API errors
interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

export function ApiErrorBoundary({ children, fallback: Fallback }: ApiErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.code === 'NETWORK_ERROR' || event.reason?.message?.includes('fetch')) {
        setError(new Error(event.reason.message || 'Network error occurred'));
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  }, []);

  const reset = () => setError(null);

  if (error) {
    if (Fallback) {
      return <Fallback error={error} reset={reset} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={reset}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}