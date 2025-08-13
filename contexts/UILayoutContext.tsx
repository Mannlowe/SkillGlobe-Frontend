'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface UILayoutContextType {
  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  
  // Detail pane state
  isDetailPaneOpen: boolean;
  currentDetailId: string | null;
  currentDetailType: string | null;
  openDetailPane: (id: string, type: string) => void;
  closeDetailPane: () => void;
  
  // Mobile detection
  isMobile: boolean;
  
  // Layout preferences
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const UILayoutContext = createContext<UILayoutContextType | undefined>(undefined);

export function UILayoutProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDetailPaneOpen, setIsDetailPaneOpen] = useState(false);
  const [currentDetailId, setCurrentDetailId] = useState<string | null>(null);
  const [currentDetailType, setCurrentDetailType] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-open sidebar on desktop, auto-close on mobile
  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    setIsSidebarOpen(true);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const openDetailPane = (id: string, type: string) => {
    setCurrentDetailId(id);
    setCurrentDetailType(type);
    setIsDetailPaneOpen(true);
  };

  const closeDetailPane = () => {
    setIsDetailPaneOpen(false);
    setCurrentDetailId(null);
    setCurrentDetailType(null);
  };

  const value: UILayoutContextType = {
    isSidebarOpen,
    toggleSidebar,
    openSidebar,
    closeSidebar,
    isDetailPaneOpen,
    currentDetailId,
    currentDetailType,
    openDetailPane,
    closeDetailPane,
    isMobile,
    sidebarCollapsed,
    setSidebarCollapsed
  };

  return (
    <UILayoutContext.Provider value={value}>
      {children}
    </UILayoutContext.Provider>
  );
}

export function useUILayout() {
  const context = useContext(UILayoutContext);
  if (context === undefined) {
    throw new Error('useUILayout must be used within a UILayoutProvider');
  }
  return context;
}