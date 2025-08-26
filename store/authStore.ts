import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login as apiLogin, LoginResponse, storeAuthData } from '../app/api/auth';

interface UserData {
  name: string;
  full_name: string;
  email: string;
  user_type: string;
  roles: string[] | string | unknown;
  user_image: string | null;
  mobile_no: string | null;
}

interface EntityData {
  type: string | null;
  category: string | null;
  role: string | null;
  details: {
    name?: string;
    entity_id?: string;
    business_users?: Array<{
      email: string;
      name: string;
      role: string;
    }>;
    [key: string]: any;
  };
  current_profile?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserData | null;
  entity: EntityData | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; userRole?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      entity: null,
      token: null,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiLogin(email, password);
          
          console.log('Auth store received response:', response);
          
          // Check if the response has the expected structure
          if (!response.message || !response.message.auth || !response.message.user) {
            throw new Error('Invalid response format from server');
          }
          
          // Store auth data in localStorage
          storeAuthData(response);
          
          // Extract user and entity data from response
          const userData = response.message.user;
          const entityData = response.message.entity;
          console.log('User data extracted:', userData);
          console.log('Entity data extracted:', entityData);
          
          // Update state with user data, entity data and token
          set({
            isAuthenticated: true,
            user: userData,
            entity: entityData,
            token: response.message.auth.token,
            isLoading: false,
            error: null
          });
          
          // Determine user role from response
          let userRole = 'Unknown';
          
          // Safely check roles property
          const roles = userData.roles;
          
          // First check if user is Individual Seller
          if (Array.isArray(roles)) {
            if (roles.includes('Individual Seller')) {
              userRole = 'Individual Seller';
            }
          } else if (typeof roles === 'string') {
            const rolesStr = roles as string;
            if (rolesStr.indexOf('Individual Seller') >= 0) {
              userRole = 'Individual Seller';
            }
          }
          
          // If not Individual Seller, check business_users array for specific role
          if (userRole === 'Unknown' && entityData?.details?.business_users) {
            const currentUser = entityData.details.business_users.find(
              (user: any) => user.email === userData.email
            );
            if (currentUser) {
              userRole = currentUser.role; // This will be "Business User" or "Business Admin"
            } else {
              userRole = userData.user_type || 'Business';
            }
          } else if (userRole === 'Unknown') {
            // Default fallback
            userRole = userData.user_type || 'Business';
          }
          
          console.log('Determined user role:', userRole);
          
          return { success: true, userRole };
        } catch (error: any) {
          console.error('Login error in auth store:', error);
          set({
            isAuthenticated: false,
            user: null,
            entity: null,
            token: null,
            isLoading: false,
            error: error.message || 'Login failed'
          });
          
          throw error; // Re-throw to allow component to handle it
        }
      },
      
      logout: () => {
        // Clear all user-specific data from localStorage
        if (typeof window !== 'undefined') {
          // Clear all items shown in the screenshot
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_expires');
          
          // Use localStorage.clear() as a fallback to ensure everything is cleared
          // Uncomment if you want to clear ALL localStorage items (including non-user data)
          // localStorage.clear();
        }
        
        // Reset state
        set({
          isAuthenticated: false,
          user: null,
          entity: null,
          token: null,
          error: null
        });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage
      partialize: (state: AuthState) => ({ 
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        entity: state.entity,
        token: state.token,
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
);
