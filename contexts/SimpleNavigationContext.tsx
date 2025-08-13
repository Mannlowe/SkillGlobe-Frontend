'use client';

import React, { createContext, useContext, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  badge?: number;
  description?: string;
}

interface NavigationContextType {
  currentPath: string;
  navigationItems: NavigationItem[];
  navigate: (href: string) => void;
  setNavigationItems: (items: NavigationItem[]) => void;
  updateBadge: (itemId: string, count: number) => void;
  isActive: (href: string) => boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const [navigationItems, setNavigationItemsState] = useState<NavigationItem[]>([
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/individual-dashboard',
      icon: 'home'
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      href: '/opportunities',
      icon: 'target',
      badge: 3
    },
    {
      id: 'skills',
      label: 'Skills',
      href: '/skills',
      icon: 'brain'
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      href: '/portfolio',
      icon: 'briefcase'
    },
    {
      id: 'insights',
      label: 'Insights',
      href: '/insights',
      icon: 'trending-up'
    },
    {
      id: 'profiles',
      label: 'Profiles',
      href: '/profiles',
      icon: 'users'
    }
  ]);

  const navigate = (href: string) => {
    router.push(href);
  };

  const setNavigationItems = (items: NavigationItem[]) => {
    setNavigationItemsState(items);
  };

  const updateBadge = (itemId: string, count: number) => {
    setNavigationItemsState(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, badge: count > 0 ? count : undefined }
          : item
      )
    );
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  const value: NavigationContextType = {
    currentPath: pathname,
    navigationItems,
    navigate,
    setNavigationItems,
    updateBadge,
    isActive
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}