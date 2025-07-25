'use client';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const API_VERSION = 'v1';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  };
}

interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

class ApiClient {
  private baseURL: string;
  private headers: HeadersInit;

  constructor() {
    this.baseURL = `${API_BASE_URL}/${API_VERSION}`;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('authToken');
    
    const config: RequestInit = {
      headers: {
        ...this.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          code: errorData.code || response.status.toString(),
          details: errorData
        } as ApiError;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          message: 'Network error - please check your connection',
          code: 'NETWORK_ERROR'
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const token = localStorage.getItem('authToken');
    
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
  }
}

// Create singleton instance
export const api = new ApiClient();

// API Endpoints
export const endpoints = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },

  // User Profile
  user: {
    profile: '/user/profile',
    updateProfile: '/user/profile',
    avatar: '/user/avatar',
    preferences: '/user/preferences',
    verification: '/user/verification',
  },

  // Skills
  skills: {
    list: '/skills',
    create: '/skills',
    update: (id: string) => `/skills/${id}`,
    delete: (id: string) => `/skills/${id}`,
    endorse: (id: string) => `/skills/${id}/endorse`,
    verify: (id: string) => `/skills/${id}/verify`,
    trending: '/skills/trending',
    search: '/skills/search',
  },

  // Opportunities
  opportunities: {
    list: '/opportunities',
    details: (id: string) => `/opportunities/${id}`,
    apply: (id: string) => `/opportunities/${id}/apply`,
    save: (id: string) => `/opportunities/${id}/save`,
    search: '/opportunities/search',
    recommendations: '/opportunities/recommendations',
    applications: '/opportunities/applications',
  },

  // Portfolio
  portfolio: {
    list: '/portfolio',
    create: '/portfolio',
    update: (id: string) => `/portfolio/${id}`,
    delete: (id: string) => `/portfolio/${id}`,
    upload: '/portfolio/upload',
    reorder: '/portfolio/reorder',
  },

  // Messages
  messages: {
    conversations: '/messages/conversations',
    conversation: (id: string) => `/messages/conversations/${id}`,
    send: '/messages/send',
    markRead: (id: string) => `/messages/conversations/${id}/read`,
    archive: (id: string) => `/messages/conversations/${id}/archive`,
  },

  // Notifications
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    markAllRead: '/notifications/read-all',
    preferences: '/notifications/preferences',
  },

  // Analytics
  analytics: {
    dashboard: '/analytics/dashboard',
    profile: '/analytics/profile',
    opportunities: '/analytics/opportunities',
    skills: '/analytics/skills',
    market: '/analytics/market',
  },

  // Verification
  verification: {
    status: '/verification/status',
    email: '/verification/email',
    phone: '/verification/phone',
    identity: '/verification/identity',
    skills: '/verification/skills',
    education: '/verification/education',
    employment: '/verification/employment',
  },

  // Search
  search: {
    global: '/search',
    opportunities: '/search/opportunities',
    people: '/search/people',
    skills: '/search/skills',
  },
};

// Type-safe API functions
export const apiService = {
  // Authentication
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: any }>(endpoints.auth.login, credentials),
  
  register: (userData: { email: string; password: string; name: string }) =>
    api.post<{ token: string; user: any }>(endpoints.auth.register, userData),
  
  getProfile: () =>
    api.get<any>(endpoints.auth.profile),

  // Skills
  getSkills: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<any[]>(endpoints.skills.list, params),
  
  createSkill: (skill: { name: string; level: string; category?: string }) =>
    api.post<any>(endpoints.skills.create, skill),
  
  endorseSkill: (skillId: string) =>
    api.post<any>(endpoints.skills.endorse(skillId)),

  // Opportunities
  getOpportunities: (params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    location?: string;
    salary_min?: number;
    salary_max?: number;
  }) =>
    api.get<any[]>(endpoints.opportunities.list, params),
  
  getOpportunityDetails: (id: string) =>
    api.get<any>(endpoints.opportunities.details(id)),
  
  applyToOpportunity: (id: string, application: { coverLetter?: string; resume?: File }) =>
    api.post<any>(endpoints.opportunities.apply(id), application),

  // Portfolio
  getPortfolioItems: () =>
    api.get<any[]>(endpoints.portfolio.list),
  
  createPortfolioItem: (item: { title: string; type: string; description: string }) =>
    api.post<any>(endpoints.portfolio.create, item),
  
  uploadPortfolioFile: (file: File, metadata?: Record<string, any>) =>
    api.upload<any>(endpoints.portfolio.upload, file, metadata),

  // Messages
  getConversations: () =>
    api.get<any[]>(endpoints.messages.conversations),
  
  getConversation: (id: string) =>
    api.get<any>(endpoints.messages.conversation(id)),
  
  sendMessage: (conversationId: string, message: { content: string; attachments?: File[] }) =>
    api.post<any>(endpoints.messages.send, { conversationId, ...message }),

  // Notifications
  getNotifications: (params?: { page?: number; limit?: number; unread?: boolean }) =>
    api.get<any[]>(endpoints.notifications.list, params),
  
  markNotificationRead: (id: string) =>
    api.post<any>(endpoints.notifications.markRead(id)),

  // Analytics
  getDashboardAnalytics: () =>
    api.get<any>(endpoints.analytics.dashboard),
  
  getProfileAnalytics: () =>
    api.get<any>(endpoints.analytics.profile),

  // Verification
  getVerificationStatus: () =>
    api.get<any>(endpoints.verification.status),
  
  verifyEmail: (code: string) =>
    api.post<any>(endpoints.verification.email, { code }),
  
  uploadIdentityDocument: (file: File, documentType: string) =>
    api.upload<any>(endpoints.verification.identity, file, { documentType }),

  // Search
  globalSearch: (query: string, filters?: Record<string, any>) =>
    api.get<any>(endpoints.search.global, { query, ...filters }),
};

export default api;