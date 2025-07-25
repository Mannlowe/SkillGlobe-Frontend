'use client';

// Export all stores
export * from './userStore';
export * from './opportunitiesStore';
export * from './notificationsStore';
export * from './uiStore';

// Store initialization
export { initializeNotifications } from './notificationsStore';
export { initializeUIStore } from './uiStore';

// Re-export the existing auth store for compatibility
export * from './authStore';