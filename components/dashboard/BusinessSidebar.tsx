'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Briefcase,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Settings
} from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/business-dashboard' },
  { icon: Briefcase, label: 'Job Postings', href: '/business-dashboard/job-postings' },
  { icon: Shield, label: 'Document Verify', href: '/business-dashboard/document-verify' },
  { icon: Settings, label: 'Admin Access', href: '/business-dashboard/dashboard-setup' },
];

// Custom hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  return isMobile;
};

interface BusinessSidebarProps {
  mobileOpen?: boolean;
}

export default function BusinessSidebar({ mobileOpen }: BusinessSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  // Use mobileOpen prop if provided, otherwise default to true
  const [isOpen, setIsOpen] = useState(true);
  
  // Update isOpen when mobileOpen prop changes
  useEffect(() => {
    if (mobileOpen !== undefined && isMobile) {
      setIsOpen(mobileOpen);
    }
  }, [mobileOpen, isMobile]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Close sidebar on mobile when navigating
  const handleNavigate = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 bottom-0 left-0 z-50 bg-white border-r border-gray-200 transition-all duration-300
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${isCollapsed && !isMobile ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full font-rubik">
          {/* Header */}
          <div className={`flex items-center h-[85px] justify-between border-b border-gray-200 ${isCollapsed && !isMobile ? 'p-3' : 'p-4'}`}>
            {(!isCollapsed || isMobile) && (
              <Link href="/business-dashboard" className="flex items-center space-x-2">
                <div className="relative w-40 h-40">
                  <Image 
                    src="/Images/logo_image.jpg" 
                    alt="SkillGlobe Logo" 
                    fill 
                    className="object-contain"
                  />
                </div>
              </Link>
            )}
            
            {isCollapsed && !isMobile && (
              <div className="relative w-8 h-8 mx-auto">
                <Image 
                  src="/Images/favicon/apple-touch-icon.png"
                  alt="SkillGlobe Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            )}
            
            {isMobile && (
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            )}
            
            {!isMobile && (
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
              </button>
            )}
          </div>
          
          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto ${isCollapsed && !isMobile ? 'p-2' : 'p-4'} space-y-2`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={`
                    flex items-center rounded-lg transition-colors
                    ${isCollapsed && !isMobile ? 'justify-center p-3' : 'space-x-3 px-4 py-3'}
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                >
                  <Icon size={20} />
                  {(!isCollapsed || isMobile) && <span className="font-medium">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
