'use client';

import { apiService } from './api';
import { 
  mockJobOpportunities, 
  mockEnhancedStats, 
  mockHeaderMetrics 
} from './mockDashboardData';
import { 
  mockSavedSearches, 
  mockApplications, 
  mockConversations 
} from './mockPhase2Data';
import { 
  mockProfileOptimizationHub as baseProfileOptimizationHub, 
  mockProfileAnalytics 
} from './mockPhase3Data';

// Extended mock data with skills for search functionality
interface Skill {
  name: string;
  level: string;
}

// Extend the imported mock data with skills property
const mockProfileOptimizationHub = {
  ...baseProfileOptimizationHub,
  skills: [
    { name: 'React', level: 'Advanced' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'GraphQL', level: 'Intermediate' },
    { name: 'AWS', level: 'Beginner' },
    { name: 'Next.js', level: 'Advanced' },
    { name: 'Docker', level: 'Intermediate' },
    { name: 'Kubernetes', level: 'Beginner' }
  ] as Skill[]
};

// Feature flags for gradual API migration
const API_FEATURES = {
  USE_REAL_OPPORTUNITIES: process.env.NEXT_PUBLIC_USE_REAL_OPPORTUNITIES === 'true',
  USE_REAL_SKILLS: process.env.NEXT_PUBLIC_USE_REAL_SKILLS === 'true',
  USE_REAL_PORTFOLIO: process.env.NEXT_PUBLIC_USE_REAL_PORTFOLIO === 'true',
  USE_REAL_MESSAGES: process.env.NEXT_PUBLIC_USE_REAL_MESSAGES === 'true',
  USE_REAL_NOTIFICATIONS: process.env.NEXT_PUBLIC_USE_REAL_NOTIFICATIONS === 'true',
  USE_REAL_ANALYTICS: process.env.NEXT_PUBLIC_USE_REAL_ANALYTICS === 'true',
  USE_REAL_VERIFICATION: process.env.NEXT_PUBLIC_USE_REAL_VERIFICATION === 'true',
};

// Data service that switches between mock and real data
class DataService {
  // Opportunities
  async getOpportunities(params?: any) {
    if (API_FEATURES.USE_REAL_OPPORTUNITIES) {
      try {
        const response = await apiService.getOpportunities(params);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real opportunities, falling back to mock data:', error);
      }
    }
    
    // Apply mock filtering based on params
    let filteredOpportunities = [...mockJobOpportunities];
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredOpportunities = filteredOpportunities.filter(opp => 
        opp.title.toLowerCase().includes(searchLower) ||
        opp.company.toLowerCase().includes(searchLower) ||
       
        opp.location.toLowerCase().includes(searchLower)
      );
    }
    
    if (params?.location) {
      filteredOpportunities = filteredOpportunities.filter(opp => 
        opp.location.toLowerCase().includes(params.location.toLowerCase())
      );
    }
    
    return filteredOpportunities;
  }

  async getOpportunityDetails(id: string) {
    if (API_FEATURES.USE_REAL_OPPORTUNITIES) {
      try {
        const response = await apiService.getOpportunityDetails(id);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real opportunity details, falling back to mock data:', error);
      }
    }
    
    return mockJobOpportunities.find(opp => opp.id === id);
  }

  async applyToOpportunity(id: string, application: any) {
    if (API_FEATURES.USE_REAL_OPPORTUNITIES) {
      try {
        const response = await apiService.applyToOpportunity(id, application);
        return response.data;
      } catch (error) {
        console.warn('Failed to apply to real opportunity, using mock response:', error);
      }
    }
    
    // Mock successful application
    return {
      success: true,
      applicationId: `mock-app-${Date.now()}`,
      message: 'Application submitted successfully'
    };
  }

  // Skills
  async getSkills(params?: any) {
    if (API_FEATURES.USE_REAL_SKILLS) {
      try {
        const response = await apiService.getSkills(params);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real skills, falling back to mock data:', error);
      }
    }
    
    // Return mock skills from profile optimization hub
    return mockProfileOptimizationHub.skills.map(skill => ({
      id: skill.name.toLowerCase().replace(/\s+/g, '-'),
      name: skill.name,
      level: skill.level,
      endorsed: Math.random() > 0.5,
      verified: Math.random() > 0.7,
      endorsements: Math.floor(Math.random() * 20),
      lastUpdated: new Date().toISOString()
    }));
  }

  async createSkill(skillData: any) {
    if (API_FEATURES.USE_REAL_SKILLS) {
      try {
        const response = await apiService.createSkill(skillData);
        return response.data;
      } catch (error) {
        console.warn('Failed to create real skill, using mock response:', error);
      }
    }
    
    return {
      id: `mock-skill-${Date.now()}`,
      ...skillData,
      endorsed: false,
      verified: false,
      endorsements: 0,
      createdAt: new Date().toISOString()
    };
  }

  // Portfolio
  async getPortfolioItems() {
    if (API_FEATURES.USE_REAL_PORTFOLIO) {
      try {
        const response = await apiService.getPortfolioItems();
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real portfolio, falling back to mock data:', error);
      }
    }
    
    // Generate mock portfolio items
    return [
      {
        id: '1',
        title: 'E-commerce Dashboard',
        type: 'Web Application',
        description: 'React-based admin dashboard with real-time analytics',
        thumbnail: '/images/portfolio/dashboard.jpg',
        status: 'published',
        technologies: ['React', 'TypeScript', 'Tailwind'],
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Mobile Banking App',
        type: 'Mobile Application',
        description: 'Secure banking app with biometric authentication',
        thumbnail: '/images/portfolio/mobile-app.jpg',
        status: 'published',
        technologies: ['React Native', 'Node.js', 'MongoDB'],
        createdAt: '2024-02-20'
      }
    ];
  }

  // Messages
  async getConversations() {
    if (API_FEATURES.USE_REAL_MESSAGES) {
      try {
        const response = await apiService.getConversations();
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real conversations, falling back to mock data:', error);
      }
    }
    
    return mockConversations;
  }

  async getConversation(id: string) {
    if (API_FEATURES.USE_REAL_MESSAGES) {
      try {
        const response = await apiService.getConversation(id);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real conversation, falling back to mock data:', error);
      }
    }
    
    return mockConversations.find(conv => conv.id === id);
  }

  // Notifications
  async getNotifications(params?: any) {
    if (API_FEATURES.USE_REAL_NOTIFICATIONS) {
      try {
        const response = await apiService.getNotifications(params);
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real notifications, falling back to mock data:', error);
      }
    }
    
    // Generate mock notifications
    return [
      {
        id: '1',
        type: 'opportunity',
        title: 'New job match found',
        message: 'A Senior React Developer position at TechCorp matches your skills',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        priority: 'high'
      },
      {
        id: '2',
        type: 'message',
        title: 'New message from Sarah Johnson',
        message: 'Hi! I saw your portfolio and would like to discuss an opportunity...',
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        priority: 'medium'
      },
      {
        id: '3',
        type: 'verification',
        title: 'Skill verification completed',
        message: 'Your React.js skill has been verified by TechCorp',
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        priority: 'low'
      }
    ];
  }

  // Analytics
  async getDashboardAnalytics() {
    if (API_FEATURES.USE_REAL_ANALYTICS) {
      try {
        const response = await apiService.getDashboardAnalytics();
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real analytics, falling back to mock data:', error);
      }
    }
    
    return {
      stats: mockEnhancedStats,
      metrics: mockHeaderMetrics,
      profileAnalytics: mockProfileAnalytics
    };
  }

  async getProfileAnalytics() {
    if (API_FEATURES.USE_REAL_ANALYTICS) {
      try {
        const response = await apiService.getProfileAnalytics();
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real profile analytics, falling back to mock data:', error);
      }
    }
    
    return mockProfileAnalytics;
  }

  // Verification
  async getVerificationStatus() {
    if (API_FEATURES.USE_REAL_VERIFICATION) {
      try {
        const response = await apiService.getVerificationStatus();
        return response.data;
      } catch (error) {
        console.warn('Failed to fetch real verification status, falling back to mock data:', error);
      }
    }
    
    return {
      email: { verified: true, email: 'user@example.com', verifiedAt: new Date() },
      phone: { verified: false, number: '+1234567890' },
      identity: { verified: false, documentType: null },
      skills: { verified: 3, total: 8, lastVerified: new Date() },
      education: { verified: true, institutions: 1, verifiedAt: new Date() },
      employment: { verified: false, companies: 0 }
    };
  }

  // Search
  async globalSearch(query: string, filters?: any) {
    // Define result types
    interface SearchResult {
      opportunities: typeof mockJobOpportunities;
      people: Array<{ id: string; name: string; title: string; avatar?: string }>;
      skills: Array<{ id: string; name: string; level: string }>;
      pages: Array<{ name: string; path: string }>;
    }
    
    // For now, search across mock data
    const results: SearchResult = {
      opportunities: [],
      people: [],
      skills: [],
      pages: []
    };

    const queryLower = query.toLowerCase();

    // Search opportunities
    results.opportunities = mockJobOpportunities
      .filter(opp => 
        opp.title.toLowerCase().includes(queryLower) ||
        opp.company.toLowerCase().includes(queryLower) ||
        opp.location.toLowerCase().includes(queryLower)
      )
      .slice(0, 5);

    // Search skills
    const mockSkills = mockProfileOptimizationHub.skills;
    results.skills = mockSkills
      .filter(skill => skill.name.toLowerCase().includes(queryLower))
      .map(skill => ({
        id: skill.name.toLowerCase().replace(/\s+/g, '-'),
        name: skill.name,
        level: skill.level
      }))
      .slice(0, 5);

    // Search pages (navigation items)
    const pages = [
      { name: 'Dashboard', path: '/individual-dashboard' },
      { name: 'Opportunities', path: '/opportunities' },
      { name: 'Skills', path: '/skills' },
      { name: 'Portfolio', path: '/portfolio' },
      { name: 'Messages', path: '/messages' },
      { name: 'Verification', path: '/verification' },
      { name: 'Insights', path: '/insights' }
    ];
    
    results.pages = pages
      .filter(page => page.name.toLowerCase().includes(queryLower))
      .slice(0, 3);

    return results;
  }
}

// Create singleton instance
export const dataService = new DataService();

// Export feature flags for components to check
export { API_FEATURES };

export default dataService;