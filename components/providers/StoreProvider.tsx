'use client';

import React, { useEffect } from 'react';
import { initializeNotifications, initializeUIStore } from '@/store';
import { useToasts } from '@/store/uiStore';
import { Toast } from '@/components/ui/toast';
import { ModalContainer } from '@/components/ui/ModalContainer';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { toasts } = useToasts();

  useEffect(() => {
    // Initialize stores
    const cleanupUI = initializeUIStore();
    initializeNotifications();

    // Cleanup function
    return () => {
      if (cleanupUI) cleanupUI();
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Global toast notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast}  type="foreground" />
        ))}
      </div>
      
      {/* Global modal container */}
      <ModalContainer />
    </>
  );
}

// Store persistence hydration component
export function StoreHydration({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SkillGlobe...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}