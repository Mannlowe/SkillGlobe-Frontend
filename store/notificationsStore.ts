'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import { dataService } from '@/lib/dataService';

interface Notification {
  id: string;
  type: 'opportunity' | 'message' | 'verification' | 'endorsement' | 'system';
  title: string;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  readAt?: string;
  metadata?: {
    opportunityId?: string;
    senderId?: string;
    skillId?: string;
    [key: string]: any;
  };
}

interface NotificationGroup {
  type: Notification['type'];
  count: number;
  unreadCount: number;
  latestNotification: Notification;
}

interface NotificationsState {
  // Data
  notifications: Notification[];
  unreadCount: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  isDrawerOpen: boolean;
  selectedFilter: 'all' | Notification['type'];
  
  // Pagination
  hasNextPage: boolean;
  currentPage: number;
  
  // Actions
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAllNotifications: () => Promise<void>;
  
  // Real-time updates
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  
  // UI actions
  openDrawer: () => void;
  closeDrawer: () => void;
  setFilter: (filter: 'all' | Notification['type']) => void;
  
  // Computed getters
  getFilteredNotifications: () => Notification[];
  getUnreadNotifications: () => Notification[];
  getNotificationGroups: () => NotificationGroup[];
  getHighPriorityNotifications: () => Notification[];

}

export const useNotificationsStore = create<NotificationsState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      
      isLoading: false,
      error: null,
      isDrawerOpen: false,
      selectedFilter: 'all',
      
      hasNextPage: true,
      currentPage: 1,
      
      // Actions
      fetchNotifications: async (page = 1) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        
        try {
          const params = {
            page,
            limit: 20,
            ...(get().selectedFilter !== 'all' && { type: get().selectedFilter })
          };
          
          const notifications = await dataService.getNotifications(params);
          
          set((state) => {
            if (page === 1) {
              state.notifications = notifications;
            } else {
              state.notifications.push(...notifications);
            }
            
            state.unreadCount = notifications.filter(n => !n.read).length;
            state.isLoading = false;
            state.currentPage = page;
            state.hasNextPage = notifications.length === 20;
          });
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
            state.error = error.message || 'Failed to fetch notifications';
          });
        }
      },
      
      markAsRead: async (id) => {
        // Optimistic update
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification && !notification.read) {
            notification.read = true;
            notification.readAt = new Date().toISOString();
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        });
        
        try {
          // TODO: Call real API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error: any) {
          // Revert on error
          set((state) => {
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
              notification.read = false;
              notification.readAt = undefined;
              state.unreadCount += 1;
            }
          });
          throw error;
        }
      },
      
      markAllAsRead: async () => {
        const unreadIds = get().notifications
          .filter(n => !n.read)
          .map(n => n.id);
        
        // Optimistic update
        set((state) => {
          state.notifications.forEach(notification => {
            if (!notification.read) {
              notification.read = true;
              notification.readAt = new Date().toISOString();
            }
          });
          state.unreadCount = 0;
        });
        
        try {
          // TODO: Call real API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
          // Revert on error
          set((state) => {
            unreadIds.forEach(id => {
              const notification = state.notifications.find(n => n.id === id);
              if (notification) {
                notification.read = false;
                notification.readAt = undefined;
              }
            });
            state.unreadCount = unreadIds.length;
          });
          throw error;
        }
      },
      
      deleteNotification: async (id) => {
        const notification = get().notifications.find(n => n.id === id);
        
        // Optimistic update
        set((state) => {
          state.notifications = state.notifications.filter(n => n.id !== id);
          if (notification && !notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        });
        
        try {
          // TODO: Call real API
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error: any) {
          // Revert on error
          if (notification) {
            set((state) => {
              state.notifications.push(notification);
              if (!notification.read) {
                state.unreadCount += 1;
              }
            });
          }
          throw error;
        }
      },
      
      clearAllNotifications: async () => {
        const allNotifications = [...get().notifications];
        
        // Optimistic update
        set((state) => {
          state.notifications = [];
          state.unreadCount = 0;
        });
        
        try {
          // TODO: Call real API
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
          // Revert on error
          set((state) => {
            state.notifications = allNotifications;
            state.unreadCount = allNotifications.filter(n => !n.read).length;
          });
          throw error;
        }
      },
      
      // Real-time updates
      addNotification: (notificationData) => {
        const notification: Notification = {
          ...notificationData,
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => {
          state.notifications.unshift(notification);
          if (!notification.read) {
            state.unreadCount += 1;
          }
        });
        
        // Show browser notification if permission granted
        if (Notification.permission === 'granted' && notification.priority === 'high') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/icon-192x192.png',
            tag: notification.id
          });
        }
      },
      
      updateNotification: (id, updates) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id);
          if (notification) {
            const wasUnread = !notification.read;
            Object.assign(notification, updates);
            
            // Update unread count if read status changed
            if (wasUnread && notification.read) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            } else if (!wasUnread && !notification.read) {
              state.unreadCount += 1;
            }
          }
        });
      },
      
      // UI actions
      openDrawer: () => {
        set((state) => {
          state.isDrawerOpen = true;
        });
      },
      
      closeDrawer: () => {
        set((state) => {
          state.isDrawerOpen = false;
        });
      },
      
      setFilter: (filter) => {
        set((state) => {
          state.selectedFilter = filter;
          state.currentPage = 1;
        });
        
        // Refetch with new filter
        get().fetchNotifications(1);
      },
      
      // Computed getters
      getFilteredNotifications: () => {
        const { notifications, selectedFilter } = get();
        
        if (selectedFilter === 'all') {
          return notifications;
        }
        
        return notifications.filter(n => n.type === selectedFilter);
      },
      
      getUnreadNotifications: () => {
        return get().notifications.filter(n => !n.read);
      },
      
      getNotificationGroups: () => {
        const notifications = get().notifications;
        const groups: Record<string, NotificationGroup> = {};
        
        notifications.forEach(notification => {
          const type = notification.type;
          if (!groups[type]) {
            groups[type] = {
              type,
              count: 0,
              unreadCount: 0,
              latestNotification: notification
            };
          }
          
          groups[type].count += 1;
          if (!notification.read) {
            groups[type].unreadCount += 1;
          }
          
          // Update latest if this notification is newer
          if (new Date(notification.createdAt) > new Date(groups[type].latestNotification.createdAt)) {
            groups[type].latestNotification = notification;
          }
        });
        
        return Object.values(groups);
      },
      
      getHighPriorityNotifications: () => {
        return get().notifications.filter(n => n.priority === 'high' && !n.read);
      }
    }))
  )
);

// Selectors for performance
export const useNotifications = () => useNotificationsStore(state => state.notifications);
export const useUnreadCount = () => useNotificationsStore(state => state.unreadCount);
export const useNotificationDrawer = () => useNotificationsStore(state => ({
  isOpen: state.isDrawerOpen,
  open: state.openDrawer,
  close: state.closeDrawer
}));
export const useUnreadNotifications = () => useNotificationsStore(state => state.getUnreadNotifications());
export const useHighPriorityNotifications = () => useNotificationsStore(state => state.getHighPriorityNotifications());

// Initialize notifications on app start
export const initializeNotifications = () => {
  const store = useNotificationsStore.getState();
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  
  // Fetch initial notifications
  store.fetchNotifications();
  
  // Set up periodic refresh (every 5 minutes)
  setInterval(() => {
    store.fetchNotifications(1);
  }, 5 * 60 * 1000);
};