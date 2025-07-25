'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import IdentityVerification from '@/components/verification/IdentityVerification';

export default function VerificationPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleVerificationComplete = () => {
    // Navigate to dashboard or another page after verification
    router.push('/individual-dashboard');
  };

  const handleSkip = () => {
    // Navigate to dashboard or another page if user skips verification
    router.push('/individual-dashboard');
  };

  return (
    <ModernLayoutWrapper>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-10/12">
            <IdentityVerification 
              onVerificationComplete={handleVerificationComplete}
              onSkip={handleSkip}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}
