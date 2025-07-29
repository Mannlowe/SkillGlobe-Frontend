import { create } from 'zustand';
import { uploadResume, getAuthData, ResumeUploadResponse } from '../../app/api/portfolio/resumeUpload';

interface ResumeState {
  isUploading: boolean;
  isUploaded: boolean;
  resumeFile: File | null;
  resumeUrl: string | null;
  error: string | null;
  uploadProgress: number;
  uploadResume: (file: File) => Promise<{ success: boolean; data?: any }>;
  resetState: () => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  isUploading: false,
  isUploaded: false,
  resumeFile: null,
  resumeUrl: null,
  error: null,
  uploadProgress: 0,
  
  uploadResume: async (file: File) => {
    set({ 
      isUploading: true, 
      error: null, 
      resumeFile: file,
      uploadProgress: 0 
    });
    
    try {
      // Get authentication data from localStorage
      const authData = getAuthData();
      
      if (!authData || !authData.entityId || !authData.apiKey || !authData.apiSecret) {
        throw new Error('Authentication data not found. Please log in again.');
      }
      
      // Simulate upload progress (for UX purposes)
      const progressInterval = setInterval(() => {
        const currentProgress = get().uploadProgress;
        if (currentProgress < 90) {
          set({ uploadProgress: currentProgress + 10 });
        }
      }, 300);
      
      // Upload the resume
      const response = await uploadResume(
        file,
        authData.entityId,
        authData.apiKey,
        authData.apiSecret
      );
      
      // Clear the progress interval
      clearInterval(progressInterval);
      
      // Update state with success
      set({
        isUploading: false,
        isUploaded: true,
        resumeUrl: response.message.data.file_url || null,
        uploadProgress: 100
      });
      
      // Store upload status in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('portfolioResumeUploaded', 'true');
        if (response.message.data.file_url) {
          localStorage.setItem('portfolioResumeUrl', response.message.data.file_url);
        }
      }
      
      return { 
        success: true, 
        data: response.message.data 
      };
    } catch (error: any) {
      console.error('Resume upload failed:', error);
      
      // Update state with error
      set({
        isUploading: false,
        isUploaded: false,
        error: error.message || 'Failed to upload resume',
        uploadProgress: 0
      });
      
      return { 
        success: false 
      };
    }
  },
  
  resetState: () => {
    set({
      isUploading: false,
      isUploaded: false,
      resumeFile: null,
      resumeUrl: null,
      error: null,
      uploadProgress: 0
    });
    
    // Clear from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolioResumeUploaded');
      localStorage.removeItem('portfolioResumeUrl');
    }
  }
}));
