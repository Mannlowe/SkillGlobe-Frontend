'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface VerificationStatus {
  email: {
    verified: boolean;
    email?: string;
    verifiedAt?: Date;
  };
  phone: {
    verified: boolean;
    number?: string;
    verifiedAt?: Date;
  };
  identity: {
    verified: boolean;
    documentType?: string;
    verifiedAt?: Date;
  };
  skills: {
    verified: number;
    total: number;
    lastVerified?: Date;
  };
  education: {
    verified: boolean;
    institutions: number;
    verifiedAt?: Date;
  };
  employment: {
    verified: boolean;
    companies: number;
    verifiedAt?: Date;
  };
}

interface NextVerificationStep {
  type: 'email' | 'phone' | 'identity' | 'skills' | 'education' | 'employment';
  priority: 'high' | 'medium' | 'low';
  message: string;
  weight: number;
}

interface VerificationContextType {
  verificationStatus: VerificationStatus;
  updateVerificationStatus: (type: keyof VerificationStatus, data: any) => void;
  getVerificationScore: () => number;
  getNextVerificationStep: () => NextVerificationStep | null;
  isFullyVerified: () => boolean;
  getVerificationProgress: () => { completed: number; total: number };
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

const initialVerificationStatus: VerificationStatus = {
  email: { verified: false },
  phone: { verified: false },
  identity: { verified: false },
  skills: { verified: 0, total: 0 },
  education: { verified: false, institutions: 0 },
  employment: { verified: false, companies: 0 }
};

// Verification weights for scoring
const VERIFICATION_WEIGHTS = {
  email: 15,
  phone: 15,
  identity: 25,
  skills: 20,
  education: 15,
  employment: 10
};

export function VerificationProvider({ children }: { children: React.ReactNode }) {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(initialVerificationStatus);

  const updateVerificationStatus = useCallback((type: keyof VerificationStatus, data: any) => {
    setVerificationStatus(prev => ({
      ...prev,
      [type]: { ...prev[type], ...data }
    }));
  }, []);

  const getVerificationScore = useCallback(() => {
    let score = 0;
    
    // Email verification
    if (verificationStatus.email.verified) {
      score += VERIFICATION_WEIGHTS.email;
    }
    
    // Phone verification
    if (verificationStatus.phone.verified) {
      score += VERIFICATION_WEIGHTS.phone;
    }
    
    // Identity verification
    if (verificationStatus.identity.verified) {
      score += VERIFICATION_WEIGHTS.identity;
    }
    
    // Skills verification (partial scoring)
    if (verificationStatus.skills.total > 0) {
      const skillsPercentage = Math.min(verificationStatus.skills.verified / Math.max(verificationStatus.skills.total, 3), 1);
      score += VERIFICATION_WEIGHTS.skills * skillsPercentage;
    }
    
    // Education verification
    if (verificationStatus.education.verified) {
      score += VERIFICATION_WEIGHTS.education;
    }
    
    // Employment verification
    if (verificationStatus.employment.verified) {
      score += VERIFICATION_WEIGHTS.employment;
    }
    
    return Math.round(score);
  }, [verificationStatus]);

  const getNextVerificationStep = useCallback((): NextVerificationStep | null => {
    const steps: NextVerificationStep[] = [];
    
    // Email verification - highest priority
    if (!verificationStatus.email.verified) {
      steps.push({
        type: 'email',
        priority: 'high',
        message: 'Verify your email address',
        weight: VERIFICATION_WEIGHTS.email
      });
    }
    
    // Phone verification - high priority
    if (!verificationStatus.phone.verified) {
      steps.push({
        type: 'phone',
        priority: 'high',
        message: 'Verify your phone number',
        weight: VERIFICATION_WEIGHTS.phone
      });
    }
    
    // Identity verification - highest impact
    if (!verificationStatus.identity.verified) {
      steps.push({
        type: 'identity',
        priority: 'high',
        message: 'Complete identity verification',
        weight: VERIFICATION_WEIGHTS.identity
      });
    }
    
    // Skills verification - medium priority
    if (verificationStatus.skills.verified < 3) {
      const remaining = Math.max(3 - verificationStatus.skills.verified, 0);
      steps.push({
        type: 'skills',
        priority: 'medium',
        message: `Verify ${remaining} more skill${remaining > 1 ? 's' : ''}`,
        weight: VERIFICATION_WEIGHTS.skills
      });
    }
    
    // Education verification - medium priority
    if (!verificationStatus.education.verified) {
      steps.push({
        type: 'education',
        priority: 'medium',
        message: 'Verify your education',
        weight: VERIFICATION_WEIGHTS.education
      });
    }
    
    // Employment verification - lower priority
    if (!verificationStatus.employment.verified) {
      steps.push({
        type: 'employment',
        priority: 'low',
        message: 'Verify your work experience',
        weight: VERIFICATION_WEIGHTS.employment
      });
    }
    
    // Sort by priority and weight
    steps.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return b.weight - a.weight;
    });
    
    return steps.length > 0 ? steps[0] : null;
  }, [verificationStatus]);

  const isFullyVerified = useCallback(() => {
    return (
      verificationStatus.email.verified &&
      verificationStatus.phone.verified &&
      verificationStatus.identity.verified &&
      verificationStatus.skills.verified >= 3 &&
      verificationStatus.education.verified &&
      verificationStatus.employment.verified
    );
  }, [verificationStatus]);

  const getVerificationProgress = useCallback(() => {
    let completed = 0;
    const total = 6;
    
    if (verificationStatus.email.verified) completed++;
    if (verificationStatus.phone.verified) completed++;
    if (verificationStatus.identity.verified) completed++;
    if (verificationStatus.skills.verified >= 3) completed++;
    if (verificationStatus.education.verified) completed++;
    if (verificationStatus.employment.verified) completed++;
    
    return { completed, total };
  }, [verificationStatus]);

  const value: VerificationContextType = {
    verificationStatus,
    updateVerificationStatus,
    getVerificationScore,
    getNextVerificationStep,
    isFullyVerified,
    getVerificationProgress
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}