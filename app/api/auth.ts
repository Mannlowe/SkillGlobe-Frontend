// Authentication API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

// Check if we should use mock authentication
const USE_MOCK_AUTH = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true';

// Interface for login request
interface LoginRequest {
  usr: string;
  pwd: string;
}

// Interface for login response
export interface LoginResponse {
  message: {
    status: string;
    message: string;
    data: Record<string, any>;
    timestamp: string;
    user: {
      name: string;
      full_name: string;
      email: string;
      user_type: string;
      roles: string[];
      user_image: string | null;
      mobile_no: string | null;
    };
    entity: {
      type: string | null;
      category: string | null;
      role: string | null;
      details: Record<string, any>;
    };
    auth: {
      token: string;
      expires_on: string;
      api_key: string;
      api_secret: string;
    };
  };
  home_page: string;
  full_name: string;
}

// Mock users for development
const MOCK_USERS = [
  {
    email: 'individual@skillglobe.com',
    password: 'demo123',
    userData: {
      name: 'Amit Verma',
      full_name: 'Amit Verma',
      email: 'individual@skillglobe.com',
      user_type: 'Individual',
      roles: ['Individual Seller'],
      user_image: null
    }
  },
  {
    email: 'business@skillglobe.com',
    password: 'demo123',
    userData: {
      name: 'TechCorp HR',
      full_name: 'TechCorp HR Manager',
      email: 'business@skillglobe.com',
      user_type: 'Business',
      roles: ['Business Buyer'],
      user_image: null
    }
  }
];

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with login response
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with:', { usr: email, pwd: password });
    
    // Use mock authentication if enabled
    if (USE_MOCK_AUTH) {
      console.log('Using mock authentication');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find matching user
      const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (!mockUser) {
        throw new Error('Invalid email or password');
      }
      
      // Return mock response
      const mockResponse: LoginResponse = {
        message: {
          status: 'success',
          message: 'Login successful',
          data: {},
          timestamp: new Date().toISOString(),
          user: mockUser.userData,
          entity: {
            type: mockUser.userData.user_type === 'Individual' ? 'individual' : 'business',
            category: mockUser.userData.user_type,
            role: mockUser.userData.roles[0],
            details: {}
          },
          auth: {
            token: `mock-token-${Date.now()}`,
            expires_on: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            api_key: 'mock-api-key',
            api_secret: 'mock-api-secret'
          }
        },
        home_page: mockUser.userData.user_type === 'Individual' ? '/individual-dashboard' : '/business-dashboard',
        full_name: mockUser.userData.full_name
      };
      
      console.log('Mock login response:', mockResponse);
      return mockResponse;
    }
    
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.auth.auth.login`,
      {
        usr: email,
        pwd: password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        withCredentials: true
      }
    );
    
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message || error);
    
    // Create a more detailed error message
    if (error.response) {
      // Server responded with an error
      const responseData = error.response.data;
      
      // Check if it's a Frappe ValidationError with traceback
      if (responseData?.exc && responseData.exc.includes('ValidationError')) {
        // Extract the actual error message from the traceback
        const match = responseData.exc.match(/ValidationError: (.+?)(?:\n|$)/);
        if (match) {
          throw new Error(match[1]);
        }
        // If we can't extract a clean message, provide a generic one
        throw new Error('Login service is currently unavailable. Please contact support.');
      }
      
      // Other server errors
      const errorMessage = responseData?.message || 
                          responseData?.error || 
                          `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection and try again.');
    } else {
      // Something else went wrong
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('auth_token');
  }
  return false;
};

/**
 * Store authentication data in localStorage
 * @param authData Authentication data from login response
 */
export const storeAuthData = (authData: LoginResponse): void => {
  if (typeof window !== 'undefined') {
    // Store basic auth data
    localStorage.setItem('auth_token', authData.message.auth.token);
    localStorage.setItem('user_data', JSON.stringify(authData.message.user));
    localStorage.setItem('entity_data', JSON.stringify(authData.message.entity));
    localStorage.setItem('auth_expires', authData.message.auth.expires_on);
    
    // Store API credentials for resume upload and other API calls
    localStorage.setItem('auth_api_key', authData.message.auth.api_key);
    localStorage.setItem('auth_api_secret', authData.message.auth.api_secret);
    
    console.log('Auth data stored in localStorage, including API credentials');
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('entity_data');
    localStorage.removeItem('auth_expires');
  }
};
