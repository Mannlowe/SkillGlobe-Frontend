'use client';

import ConsolidatedDashboard from '@/components/dashboard/ConsolidatedDashboard';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';

export default function DashboardV2Page() {
  return (
    <ModernLayoutWrapper>
      <ConsolidatedDashboard />
    </ModernLayoutWrapper>
  );
}