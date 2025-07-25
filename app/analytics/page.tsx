'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to insights page since analytics was moved there
    router.replace('/insights');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Analytics has moved to Insights</p>
      </div>
    </div>
  );
}