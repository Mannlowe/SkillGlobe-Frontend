'use client';

import React from 'react';
import ModernLayout from './ModernLayout';
import { UILayoutProvider } from '@/contexts/UILayoutContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { NavigationProvider } from '@/contexts/SimpleNavigationContext';
import { VerificationProvider } from '@/contexts/VerificationContext';
import { UIPreferencesProvider } from '@/contexts/UIPreferencesContext';

interface ModernLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function ModernLayoutWrapper({ children, className }: ModernLayoutWrapperProps) {
  return (
    <UIPreferencesProvider>
      <UILayoutProvider>
        <NotificationProvider>
          <NavigationProvider>
            <VerificationProvider>
              <ModernLayout className={className}>
                {children}
              </ModernLayout>
            </VerificationProvider>
          </NavigationProvider>
        </NotificationProvider>
      </UILayoutProvider>
    </UIPreferencesProvider>
  );
}