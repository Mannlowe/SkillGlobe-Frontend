'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ModernLayoutWrapper from '@/components/layout/ModernLayoutWrapper';
import Portfolio from '@/components/portfolio/Portfolio';
import PortfolioSidebar from '@/components/portfolio/PortfolioSidebar';
import { Upload, User, GraduationCap, Briefcase, Award, FileText } from 'lucide-react';

export default function PortfolioPage() {
  const router = useRouter();
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false);
  const [portfolioSidebarOpen, setPortfolioSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('resume');
  
  // Portfolio section states
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [personalInfoCompleted, setPersonalInfoCompleted] = useState(false);
  const [educationCompleted, setEducationCompleted] = useState(false);
  const [experienceCompleted, setExperienceCompleted] = useState(false);
  const [certificatesCompleted, setCertificatesCompleted] = useState(false);

  const sections = [
    { id: 'resume', name: 'Resume Upload', icon: FileText, completed: resumeUploaded },
    { id: 'personal', name: 'Personal Info', icon: User, completed: personalInfoCompleted },
    { id: 'education', name: 'Education', icon: GraduationCap, completed: educationCompleted },
    { id: 'experience', name: 'Experience', icon: Briefcase, completed: experienceCompleted },
    { id: 'certificates', name: 'Certificates', icon: Award, completed: certificatesCompleted },
  ];

  const handlePortfolioComplete = () => {
    // Navigate to dashboard or another page after portfolio completion
    router.push('/individual-dashboard');
  };

  const handleSkip = () => {
    // Navigate to dashboard or another page if user skips portfolio setup
    router.push('/individual-dashboard');
  };

  // When Portfolio link is clicked in main sidebar, this will be called
  // This effect simulates that behavior for initial page load
  useEffect(() => {
    // Auto-collapse main sidebar when portfolio page loads
    setMainSidebarOpen(false);
    // Auto-open portfolio sidebar
    setPortfolioSidebarOpen(true);
  }, []);

  return (
    <ModernLayoutWrapper>
      {/* Portfolio Sidebar */}
      {portfolioSidebarOpen && (
        <PortfolioSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sections={sections}
          onClose={() => {
            setPortfolioSidebarOpen(false);
            setMainSidebarOpen(true);
          }}
        />
      )}
      
      <div className="max-w-7xl mx-auto p-4">
        <Portfolio 
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sections={sections}
          setResumeUploaded={setResumeUploaded}
          setPersonalInfoCompleted={setPersonalInfoCompleted}
          setEducationCompleted={setEducationCompleted}
          setExperienceCompleted={setExperienceCompleted}
          setCertificatesCompleted={setCertificatesCompleted}
          onPortfolioComplete={handlePortfolioComplete}
          onSkip={handleSkip}
          className="mt-4"
        />
      </div>
    </ModernLayoutWrapper>
  );
}
