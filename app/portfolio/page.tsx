'use client';

import { useRouter } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import Portfolio from '@/components/portfolio/Portfolio';

export default function PortfolioPage() {
  const router = useRouter();

  const handlePortfolioComplete = () => {
    // Navigate to dashboard or another page after portfolio completion
    router.push('/individual-dashboard');
  };

  const handleSkip = () => {
    // Navigate to dashboard or another page if user skips portfolio setup
    router.push('/individual-dashboard');
  };

  return (
    <ModernLayoutWrapper>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center">
          <div className="w-full md:w-11/12">
            <Portfolio 
              onPortfolioComplete={handlePortfolioComplete}
              onSkip={handleSkip}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </ModernLayoutWrapper>
  );
}
