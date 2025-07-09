'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import IdentityVerification from '@/components/verification/IdentityVerification';

export default function VerificationPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleVerificationComplete = () => {
    // Navigate to dashboard or another page after verification
    router.push('/dashboard');
  };

  const handleSkip = () => {
    // Navigate to dashboard or another page if user skips verification
    router.push('/dashboard');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center">
              <div className="w-full md:w-2/3">
                <IdentityVerification 
                  onVerificationComplete={handleVerificationComplete}
                  onSkip={handleSkip}
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
