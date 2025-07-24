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
          // Check if roles is an array and contains 'Individual Seller'
          let userRole = 'Unknown';
          
          // Safely check roles property
          const roles = userData.roles;
          
          if (Array.isArray(roles)) {
            // If roles is an array, check if it includes 'Individual Seller'
            if (roles.includes('Individual Seller')) {
              userRole = 'Individual Seller';
            } else {
              userRole = userData.user_type || 'Business';
            }
          } else if (typeof roles === 'string') {
            // If roles is a string, check if it contains 'Individual Seller'
            const rolesStr = roles as string;
            if (rolesStr.indexOf('Individual Seller') >= 0) {
              userRole = 'Individual Seller';
            } else {
              userRole = userData.user_type || 'Business';
            }
          } else {
            // Default to user_type if roles is not available
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
        // Clear auth data from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_expires');
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
        token: state.token,
      }),
      storage: createJSONStorage(() => localStorage)
    }
  )
);
