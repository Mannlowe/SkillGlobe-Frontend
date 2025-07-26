'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface PrefetchConfig {
  routes: string[];
  data: { [key: string]: () => Promise<any> };
  images: string[];
  priority: 'high' | 'medium' | 'low';
  conditions?: {
    userIdle?: boolean;
    networkSpeed?: 'fast' | 'slow' | 'any';
    batteryLevel?: number;
    dataUsage?: 'conservative' | 'normal' | 'aggressive';
  };
}

interface PrefetchState {
  prefetchedRoutes: Set<string>;
  prefetchedData: Map<string, any>;
  prefetchedImages: Set<string>;
  isNetworkSlow: boolean;
  isBatteryLow: boolean;
  isUserIdle: boolean;
}

interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface BatteryInfo {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

export function useIntelligentPrefetch(config: PrefetchConfig) {
  const router = useRouter();
  const [state, setState] = useState<PrefetchState>({
    prefetchedRoutes: new Set(),
    prefetchedData: new Map(),
    prefetchedImages: new Set(),
    isNetworkSlow: false,
    isBatteryLow: false,
    isUserIdle: false
  });
  
  const idleTimerRef = useRef<NodeJS.Timeout>();
  const mouseMovementRef = useRef(0);
  const keyPressRef = useRef(0);
  const lastActivityRef = useRef(Date.now());

  // Network condition monitoring
  const checkNetworkConditions = useCallback(() => {
    const connection = (navigator as any).connection;
    if (connection) {
      const networkInfo: NetworkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };

      const isSlowNetwork = 
        networkInfo.effectiveType === '2g' || 
        networkInfo.effectiveType === 'slow-2g' ||
        (networkInfo.downlink && networkInfo.downlink < 1.5) ||
        networkInfo.saveData;

      setState(prev => ({ ...prev, isNetworkSlow: isSlowNetwork }));
      return !isSlowNetwork;
    }
    return true; // Default to allowing prefetch if network info unavailable
  }, []);

  // Battery condition monitoring
  const checkBatteryConditions = useCallback(async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery() as BatteryInfo;
        const isBatteryLow = !battery.charging && battery.level < 0.2;
        setState(prev => ({ ...prev, isBatteryLow }));
        return !isBatteryLow;
      } catch (error) {
        console.warn('Battery API not available:', error);
      }
    }
    return true; // Default to allowing prefetch if battery info unavailable
  }, []);

  // User activity monitoring
  const trackUserActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    setState(prev => ({ ...prev, isUserIdle: false }));
    
    // Clear existing idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    // Set new idle timer (30 seconds)
    idleTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isUserIdle: true }));
    }, 30000);
  }, []);

  // Route prefetching
  const prefetchRoute = useCallback(async (route: string) => {
    if (state.prefetchedRoutes.has(route)) return;
    
    try {
      router.prefetch(route);
      setState(prev => ({
        ...prev,
        prefetchedRoutes: new Set([...prev.prefetchedRoutes, route])
      }));
      console.log(`Prefetched route: ${route}`);
    } catch (error) {
      console.warn(`Failed to prefetch route ${route}:`, error);
    }
  }, [router, state.prefetchedRoutes]);

  // Data prefetching
  const prefetchData = useCallback(async (key: string, fetchFn: () => Promise<any>) => {
    if (state.prefetchedData.has(key)) return;
    
    try {
      const data = await fetchFn();
      setState(prev => ({
        ...prev,
        prefetchedData: new Map([...prev.prefetchedData, [key, data]])
      }));
      console.log(`Prefetched data: ${key}`);
    } catch (error) {
      console.warn(`Failed to prefetch data ${key}:`, error);
    }
  }, [state.prefetchedData]);

  // Image prefetching
  const prefetchImage = useCallback((src: string) => {
    if (state.prefetchedImages.has(src)) return;
    
    const img = new Image();
    img.onload = () => {
      setState(prev => ({
        ...prev,
        prefetchedImages: new Set([...prev.prefetchedImages, src])
      }));
      console.log(`Prefetched image: ${src}`);
    };
    img.onerror = () => {
      console.warn(`Failed to prefetch image: ${src}`);
    };
    img.src = src;
  }, [state.prefetchedImages]);

  // Main prefetch logic
  const executePrefetch = useCallback(async () => {
    const conditions = config.conditions || {};
    
    // Check network conditions
    if (conditions.networkSpeed && conditions.networkSpeed !== 'any') {
      const networkOk = checkNetworkConditions();
      if (!networkOk && conditions.networkSpeed === 'fast') return;
    }
    
    // Check battery conditions
    if (conditions.batteryLevel) {
      const batteryOk = await checkBatteryConditions();
      if (!batteryOk && conditions.batteryLevel > 0.2) return;
    }
    
    // Check user idle condition
    if (conditions.userIdle && !state.isUserIdle) return;
    
    // Check data usage preferences
    if (conditions.dataUsage === 'conservative' && state.isNetworkSlow) return;
    
    // Execute prefetching based on priority
    const delay = config.priority === 'high' ? 0 : config.priority === 'medium' ? 1000 : 3000;
    
    setTimeout(async () => {
      // Prefetch routes
      for (const route of config.routes) {
        await prefetchRoute(route);
        // Small delay between route prefetches to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Prefetch data
      for (const [key, fetchFn] of Object.entries(config.data)) {
        await prefetchData(key, fetchFn);
        // Small delay between data prefetches
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Prefetch images
      for (const imageSrc of config.images) {
        prefetchImage(imageSrc);
        // Small delay between image prefetches
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }, delay);
  }, [config, state.isUserIdle, state.isNetworkSlow, checkNetworkConditions, checkBatteryConditions, prefetchRoute, prefetchData, prefetchImage]);

  // Set up activity listeners
  useEffect(() => {
    const handleMouseMove = () => {
      mouseMovementRef.current++;
      trackUserActivity();
    };
    
    const handleKeyPress = () => {
      keyPressRef.current++;
      trackUserActivity();
    };
    
    const handleScroll = trackUserActivity;
    const handleClick = trackUserActivity;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClick);
    
    // Initial activity tracking
    trackUserActivity();
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
      
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [trackUserActivity]);

  // Execute prefetch on mount and when conditions change
  useEffect(() => {
    executePrefetch();
  }, [executePrefetch]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  return {
    prefetchedData: state.prefetchedData,
    isPrefetched: {
      route: (route: string) => state.prefetchedRoutes.has(route),
      data: (key: string) => state.prefetchedData.has(key),
      image: (src: string) => state.prefetchedImages.has(src)
    },
    networkConditions: {
      isNetworkSlow: state.isNetworkSlow,
      isBatteryLow: state.isBatteryLow,
      isUserIdle: state.isUserIdle
    },
    manualPrefetch: {
      route: prefetchRoute,
      data: prefetchData,
      image: prefetchImage
    }
  };
}

// Hook for route-specific prefetching
export function useRoutePrefetch(routes: string[], priority: 'high' | 'medium' | 'low' = 'medium') {
  return useIntelligentPrefetch({
    routes,
    data: {},
    images: [],
    priority,
    conditions: {
      networkSpeed: 'any',
      dataUsage: 'normal'
    }
  });
}

// Hook for data prefetching
export function useDataPrefetch(
  dataFetchers: { [key: string]: () => Promise<any> },
  priority: 'high' | 'medium' | 'low' = 'medium'
) {
  return useIntelligentPrefetch({
    routes: [],
    data: dataFetchers,
    images: [],
    priority,
    conditions: {
      userIdle: priority === 'low',
      networkSpeed: 'any',
      dataUsage: 'normal'
    }
  });
}

// Hook for image prefetching
export function useImagePrefetch(
  images: string[],
  priority: 'high' | 'medium' | 'low' = 'low'
) {
  return useIntelligentPrefetch({
    routes: [],
    data: {},
    images,
    priority,
    conditions: {
      userIdle: true,
      networkSpeed: 'any',
      dataUsage: 'conservative'
    }
  });
}

// Advanced prefetch hook with user behavior prediction
export function usePredictivePrefetch() {
  const [userPatterns, setUserPatterns] = useState<{
    mostVisitedRoutes: string[];
    timeBasedPreferences: { [hour: string]: string[] };
    sequentialPatterns: { [route: string]: string[] };
  }>({
    mostVisitedRoutes: [],
    timeBasedPreferences: {},
    sequentialPatterns: {}
  });

  const router = useRouter();

  // Track user navigation patterns
  const trackNavigation = useCallback((from: string, to: string) => {
    const hour = new Date().getHours().toString();
    
    setUserPatterns(prev => {
      const updated = { ...prev };
      
      // Update most visited routes
      if (!updated.mostVisitedRoutes.includes(to)) {
        updated.mostVisitedRoutes.push(to);
      }
      
      // Update time-based preferences
      if (!updated.timeBasedPreferences[hour]) {
        updated.timeBasedPreferences[hour] = [];
      }
      if (!updated.timeBasedPreferences[hour].includes(to)) {
        updated.timeBasedPreferences[hour].push(to);
      }
      
      // Update sequential patterns
      if (!updated.sequentialPatterns[from]) {
        updated.sequentialPatterns[from] = [];
      }
      if (!updated.sequentialPatterns[from].includes(to)) {
        updated.sequentialPatterns[from].push(to);
      }
      
      return updated;
    });
    
    // Store patterns in localStorage for persistence
    localStorage.setItem('sg_nav_patterns', JSON.stringify(userPatterns));
  }, [userPatterns]);

  // Load patterns from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('sg_nav_patterns');
    if (stored) {
      try {
        setUserPatterns(JSON.parse(stored));
      } catch (error) {
        console.warn('Failed to load navigation patterns:', error);
      }
    }
  }, []);

  // Predict and prefetch likely next routes
  const predictiveRoutePrefetch = useCallback((currentRoute: string) => {
    const hour = new Date().getHours().toString();
    const predictedRoutes: string[] = [];
    
    // Add routes from sequential patterns
    if (userPatterns.sequentialPatterns[currentRoute]) {
      predictedRoutes.push(...userPatterns.sequentialPatterns[currentRoute]);
    }
    
    // Add routes from time-based preferences
    if (userPatterns.timeBasedPreferences[hour]) {
      predictedRoutes.push(...userPatterns.timeBasedPreferences[hour]);
    }
    
    // Add most visited routes
    predictedRoutes.push(...userPatterns.mostVisitedRoutes.slice(0, 3));
    
    // Remove duplicates and current route
    const uniqueRoutes = [...new Set(predictedRoutes)].filter(route => route !== currentRoute);
    
    // Prefetch predicted routes
    return useIntelligentPrefetch({
      routes: uniqueRoutes.slice(0, 5), // Limit to top 5 predictions
      data: {},
      images: [],
      priority: 'low',
      conditions: {
        userIdle: true,
        networkSpeed: 'fast',
        dataUsage: 'normal'
      }
    });
  }, [userPatterns]);

  return {
    trackNavigation,
    predictiveRoutePrefetch,
    userPatterns
  };
}