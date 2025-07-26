// Mock user data for development and demo purposes
export const mockUserData = {
  name: 'Amit Verma',
  full_name: 'Amit Verma',
  email: 'amit.verma@skillglobe.com',
  user_type: 'Individual',
  roles: ['Individual Seller'],
  user_image: null
};

export const mockAuthResponse = {
  message: {
    auth: {
      token: 'demo-token-12345'
    },
    user: mockUserData
  }
};

// Function to initialize auth store with mock data for demo
export const initializeMockAuth = () => {
  if (typeof window !== 'undefined') {
    // Store mock auth data in localStorage for demo
    localStorage.setItem('auth_token', mockAuthResponse.message.auth.token);
    localStorage.setItem('user_data', JSON.stringify(mockUserData));
    localStorage.setItem('auth_expires', (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
    
    // Set auth storage for Zustand
    localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: mockUserData,
        token: mockAuthResponse.message.auth.token
      },
      version: 0
    }));
  }
};

// Initialize mock auth ONLY in development for demo/testing purposes
// In production, real user data comes from actual login API
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Only initialize if no real auth data exists
  const existingAuth = localStorage.getItem('auth-storage');
  if (!existingAuth || existingAuth === 'null') {
    console.log('[DEV ONLY] Initializing mock user data for demo purposes');
    initializeMockAuth();
  }
}