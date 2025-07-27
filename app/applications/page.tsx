'use client';

import ApplicationTracker from '@/components/applications/ApplicationTracker';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';

export default function ApplicationsPage() {
  return (
    <ModernLayoutWrapper>
      <ApplicationTracker />
    </ModernLayoutWrapper>
  );
}