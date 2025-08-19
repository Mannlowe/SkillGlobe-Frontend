'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import IdentityVerification from '@/components/verification/IdentityVerification';

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState('identity');

  useEffect(() => {
    const step = searchParams.get('step');
    if (step && ['email', 'phone', 'identity'].includes(step)) {
      setCurrentStep(step);
    }
  }, [searchParams]);

  const handleVerificationComplete = () => {
    // Navigate to dashboard or another page after verification
    router.push('/individual-dashboard');
  };

  const handleSkip = () => {
    // Navigate to dashboard or another page if user skips verification
    router.push('/individual-dashboard');
  };

  const getPageTitle = () => {
    switch (currentStep) {
      case 'email':
        return 'Email Verification';
      case 'phone':
        return 'Phone Verification';
      case 'identity':
        return 'Identity Curation';
      default:
        return 'Verification';
    }
  };

  const getPageDescription = () => {
    switch (currentStep) {
      case 'email':
        return 'Verify your email address to access premium opportunities and improve your profile score.';
      case 'phone':
        return 'Verify your phone number to add an extra layer of trust to your profile.';
      case 'identity':
        return 'Upload your government ID to complete identity curation and unlock premium features.';
      default:
        return 'Complete verification to unlock premium opportunities and improve your profile.';
    }
  };

  return (
    <ModernLayoutWrapper>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getPageDescription()}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="w-full md:w-10/12">
            <IdentityVerification 
              onVerificationComplete={handleVerificationComplete}
              onSkip={handleSkip}
              className="mt-4"
              initialStep={currentStep}
            />
          </div>
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}
