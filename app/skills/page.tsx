'use client';

import { useRouter } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import Skills from '@/components/skills/Skills';

export default function SkillsPage() {
  const router = useRouter();

  const handleSkillsComplete = () => {
    // Navigate to dashboard or another page after skills completion
    router.push('/individual-dashboard');
  };

  const handleSkip = () => {
    // Navigate to dashboard or another page if user skips skills setup
    router.push('/individual-dashboard');
  };

  return (
    <ModernLayoutWrapper>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <Skills 
              onSkillsComplete={handleSkillsComplete}
              onSkip={handleSkip}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}
