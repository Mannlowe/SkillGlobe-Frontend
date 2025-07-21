// Authentication API functions
import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://skillglobedev.m.frappe.cloud';

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

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @returns Promise with login response
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('Attempting login with:', { usr: email, pwd: password });
    
    const response = await axios.post<LoginResponse>(
      `${API_BASE_URL}/api/method/skillglobe_be.api.auth.login`,
      {
        usr: email,
        pwd: password
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error.message || error);
    throw error;
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
    localStorage.setItem('auth_token', authData.message.auth.token);
    localStorage.setItem('user_data', JSON.stringify(authData.message.user));
    localStorage.setItem('auth_expires', authData.message.auth.expires_on);
  }
};

/**
 * Clear authentication data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('auth_expires');
  }
};
