'use client';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { dataService } from '@/lib/dataService';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  title?: string;
  location?: string;
  bio?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

interface VerificationStatus {
  email: { verified: boolean; email?: string; verifiedAt?: Date };
  phone: { verified: boolean; number?: string; verifiedAt?: Date };
  identity: { verified: boolean; documentType?: string; verifiedAt?: Date };
  skills: { verified: number; total: number; lastVerified?: Date };
  education: { verified: boolean; institutions: number; verifiedAt?: Date };
  employment: { verified: boolean; companies: number; verifiedAt?: Date };
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: string;
  endorsed: boolean;
  verified: boolean;
  endorsements: number;
  yearsOfExperience?: number;
  lastUsed?: string;
  certifications?: string[];
}

interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    opportunities: boolean;
    messages: boolean;
    endorsements: boolean;
    weeklyDigest: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'verified-only';
    showSalaryExpectations: boolean;
    showLocation: boolean;
    allowMessages: boolean;
  };
  jobPreferences: {
    jobTypes: string[];
    locations: string[];
    remote: boolean;
    salaryMin?: number;
    salaryMax?: number;
    industries: string[];
  };
}

interface UserState {
  // Authentication
  isAuthenticated: boolean;
  token: string | null;
  
  // User data
  profile: UserProfile | null;
  skills: Skill[];
  verificationStatus: VerificationStatus | null;
  preferences: UserPreferences | null;
  
  // UI state
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  
  // Profile management
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  
  // Skills management
  fetchSkills: () => Promise<void>;
  addSkill: (skill: Omit<Skill, 'id' | 'endorsed' | 'verified' | 'endorsements'>) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
  removeSkill: (id: string) => Promise<void>;
  endorseSkill: (id: string) => Promise<void>;
  reorderSkills: (skillIds: string[]) => Promise<void>;
  
  // Verification
  fetchVerificationStatus: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  verifyPhone: (code: string) => Promise<void>;
  uploadIdentityDocument: (file: File, documentType: string) => Promise<void>;
  
  // Preferences
  fetchPreferences: () => Promise<void>;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  
  // Computed getters
  getVerificationScore: () => number;
  getSkillsByCategory: () => Record<string, Skill[]>;
  getEndorsedSkills: () => Skill[];
  getVerifiedSkills: () => Skill[];
}

export const useUserStore = create<UserState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      isAuthenticated: false,
      token: null,
      
      profile: null,
      skills: [],
      verificationStatus: null,
      preferences: null,
      
      isLoading: false,
      isUpdating: false,
      error: null,
      
      // Authentication actions
      login: async (email, password) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        
        try {
          // TODO: Replace with real API call
          const response = await new Promise<{token: string; user: UserProfile}>((resolve) => {
            setTimeout(() => resolve({
              token: 'mock-jwt-token',
              user: {
                id: '1',
                email,
                name: 'John Doe',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }), 1000);
          });
          
          set((state) => {
            state.isAuthenticated = true;
            state.token = response.token;
            state.profile = response.user;
            state.isLoading = false;
          });
          
          // Store token in localStorage
          localStorage.setItem('authToken', response.token);
          
          // Fetch additional data
          await Promise.all([
            get().fetchSkills(),
            get().fetchVerificationStatus(),
            get().fetchPreferences()
          ]);
          
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
            state.error = error.message || 'Login failed';
          });
          throw error;
        }
      },
      
      logout: () => {
        set((state) => {
          state.isAuthenticated = false;
          state.token = null;
          state.profile = null;
          state.skills = [];
          state.verificationStatus = null;
          state.preferences = null;
        });
        
        localStorage.removeItem('authToken');
      },
      
      register: async (userData) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        
        try {
          // TODO: Replace with real API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Auto-login after registration
          await get().login(userData.email, userData.password);
          
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
            state.error = error.message || 'Registration failed';
          });
          throw error;
        }
      },
      
      // Profile management
      fetchProfile: async () => {
        if (!get().isAuthenticated) return;
        
        set((state) => {
          state.isLoading = true;
        });
        
        try {
          // TODO: Replace with real API call
          const profile = await new Promise<UserProfile>(resolve => 
            setTimeout(() => resolve({
              id: '1',
              email: 'john@example.com',
              name: 'John Doe',
              title: 'Senior Frontend Developer',
              location: 'San Francisco, CA',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }), 500)
          );
          
          set((state) => {
            state.profile = profile;
            state.isLoading = false;
          });
        } catch (error: any) {
          set((state) => {
            state.isLoading = false;
            state.error = error.message || 'Failed to fetch profile';
          });
        }
      },
      
      updateProfile: async (updates) => {
        set((state) => {
          state.isUpdating = true;
          state.error = null;
        });
        
        try {
          // TODO: Replace with real API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => {
            if (state.profile) {
              Object.assign(state.profile, updates);
              state.profile.updated_at = new Date().toISOString();
            }
            state.isUpdating = false;
          });
        } catch (error: any) {
          set((state) => {
            state.isUpdating = false;
            state.error = error.message || 'Failed to update profile';
          });
          throw error;
        }
      },
      
      uploadAvatar: async (file) => {
        set((state) => {
          state.isUpdating = true;
        });
        
        try {
          // TODO: Replace with real API call
          const avatarUrl = URL.createObjectURL(file); // Mock URL
          
          set((state) => {
            if (state.profile) {
              state.profile.avatar = avatarUrl;
            }
            state.isUpdating = false;
          });
        } catch (error: any) {
          set((state) => {
            state.isUpdating = false;
            state.error = error.message || 'Failed to upload avatar';
          });
          throw error;
        }
      },
      
      // Skills management
      fetchSkills: async () => {
        try {
          const skills = await dataService.getSkills();
          
          set((state) => {
            state.skills = skills;
          });
        } catch (error: any) {
          console.error('Failed to fetch skills:', error);
        }
      },
      
      addSkill: async (skillData) => {
        set((state) => {
          state.isUpdating = true;
        });
        
        try {
          const newSkill = await dataService.createSkill(skillData);
          
          set((state) => {
            state.skills.push(newSkill);
            state.isUpdating = false;
          });
        } catch (error: any) {
          set((state) => {
            state.isUpdating = false;
            state.error = error.message || 'Failed to add skill';
          });
          throw error;
        }
      },
      
      updateSkill: async (id, updates) => {
        set((state) => {
          const skill = state.skills.find(s => s.id === id);
          if (skill) {
            Object.assign(skill, updates);
          }
        });
        
        // TODO: Call API to update skill
      },
      
      removeSkill: async (id) => {
        set((state) => {
          state.skills = state.skills.filter(s => s.id !== id);
        });
        
        // TODO: Call API to remove skill
      },
      
      endorseSkill: async (id) => {
        set((state) => {
          const skill = state.skills.find(s => s.id === id);
          if (skill && !skill.endorsed) {
            skill.endorsed = true;
            skill.endorsements += 1;
          }
        });
        
        // TODO: Call API to endorse skill
      },
      
      reorderSkills: async (skillIds) => {
        const currentSkills = get().skills;
        const reorderedSkills = skillIds.map(id => 
          currentSkills.find(skill => skill.id === id)!
        ).filter(Boolean);
        
        set((state) => {
          state.skills = reorderedSkills;
        });
        
        // TODO: Call API to save skill order
      },
      
      // Verification
      fetchVerificationStatus: async () => {
        try {
          const status = await dataService.getVerificationStatus();
          
          set((state) => {
            state.verificationStatus = status;
          });
        } catch (error: any) {
          console.error('Failed to fetch verification status:', error);
        }
      },
      
      verifyEmail: async (code) => {
        // TODO: Implement email verification
        set((state) => {
          if (state.verificationStatus) {
            state.verificationStatus.email.verified = true;
            state.verificationStatus.email.verifiedAt = new Date();
          }
        });
      },
      
      verifyPhone: async (code) => {
        // TODO: Implement phone verification
        set((state) => {
          if (state.verificationStatus) {
            state.verificationStatus.phone.verified = true;
            state.verificationStatus.phone.verifiedAt = new Date();
          }
        });
      },
      
      uploadIdentityDocument: async (file, documentType) => {
        try {
          await dataService.uploadIdentityDocument(file, documentType);
          
          set((state) => {
            if (state.verificationStatus) {
              state.verificationStatus.identity.verified = true;
              state.verificationStatus.identity.documentType = documentType;
              state.verificationStatus.identity.verifiedAt = new Date();
            }
          });
        } catch (error: any) {
          throw error;
        }
      },
      
      // Preferences
      fetchPreferences: async () => {
        // TODO: Fetch real preferences
        const mockPreferences: UserPreferences = {
          notifications: {
            email: true,
            push: true,
            sms: false,
            opportunities: true,
            messages: true,
            endorsements: true,
            weeklyDigest: true
          },
          privacy: {
            profileVisibility: 'public',
            showSalaryExpectations: true,
            showLocation: true,
            allowMessages: true
          },
          jobPreferences: {
            jobTypes: ['full-time', 'contract'],
            locations: ['San Francisco', 'Remote'],
            remote: true,
            industries: ['Technology', 'Startups']
          }
        };
        
        set((state) => {
          state.preferences = mockPreferences;
        });
      },
      
      updatePreferences: async (updates) => {
        set((state) => {
          if (state.preferences) {
            Object.assign(state.preferences, updates);
          }
        });
        
        // TODO: Call API to update preferences
      },
      
      // Computed getters
      getVerificationScore: () => {
        const status = get().verificationStatus;
        if (!status) return 0;
        
        const weights = {
          email: 15,
          phone: 15,
          identity: 25,
          skills: 20,
          education: 15,
          employment: 10
        };
        
        let score = 0;
        if (status.email.verified) score += weights.email;
        if (status.phone.verified) score += weights.phone;
        if (status.identity.verified) score += weights.identity;
        if (status.skills.verified > 0) score += weights.skills * (status.skills.verified / status.skills.total);
        if (status.education.verified) score += weights.education;
        if (status.employment.verified) score += weights.employment;
        
        return Math.round(score);
      },
      
      getSkillsByCategory: () => {
        const skills = get().skills;
        return skills.reduce((acc, skill) => {
          const category = skill.category || 'Other';
          if (!acc[category]) acc[category] = [];
          acc[category].push(skill);
          return acc;
        }, {} as Record<string, Skill[]>);
      },
      
      getEndorsedSkills: () => {
        return get().skills.filter(skill => skill.endorsed);
      },
      
      getVerifiedSkills: () => {
        return get().skills.filter(skill => skill.verified);
      }
    })),
    {
      name: 'user-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        profile: state.profile
      })
    }
  )
);

// Selectors
export const useAuth = () => useUserStore(state => ({ 
  isAuthenticated: state.isAuthenticated, 
  token: state.token 
}));
export const useProfile = () => useUserStore(state => state.profile);
export const useSkills = () => useUserStore(state => state.skills);
export const useVerificationStatus = () => useUserStore(state => state.verificationStatus);
export const useVerificationScore = () => useUserStore(state => state.getVerificationScore());
export const useUserPreferences = () => useUserStore(state => state.preferences);