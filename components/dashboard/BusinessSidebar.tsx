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

const allMenuItems = [
  { icon: Home, label: 'Dashboard', href: '/business-dashboard', roles: ['Business Admin'] },
  { icon: Briefcase, label: 'Opportunity Postings', href: '/business-dashboard/job-postings', roles: ['Business Admin', 'Business User'] },
  { icon: Shield, label: 'Document Verify', href: '/business-dashboard/document-verify', roles: ['Business Admin'] },
  { icon: Settings, label: 'Admin Access', href: '/business-dashboard/business-team-member', roles: ['Business Admin'] },
];

// Helper function to get user role from localStorage
const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const entityDataStr = localStorage.getItem('entity_data');
      const userDataStr = localStorage.getItem('user_data');
      
      if (entityDataStr && userDataStr) {
        const entityData = JSON.parse(entityDataStr);
        const userData = JSON.parse(userDataStr);
        
        // Get current user's email
        const currentUserEmail = userData.email;
        
        // Find user's role in business_users array
        const businessUsers = entityData.details?.business_users;
        if (businessUsers && Array.isArray(businessUsers)) {
          const currentUser = businessUsers.find(user => user.email === currentUserEmail);
          return currentUser?.role || null;
        }
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  }
  return null;
};

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
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Get user role on component mount
  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, []);
  
  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => {
    if (!userRole) return true; // Show all items if role is not determined
    return item.roles.includes(userRole);
  });
  
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
          ${isCollapsed && !isMobile ? 'w-24' : 'w-[270px]'}
        `}
      >
        <div className="flex flex-col h-full font-rubik overflow-hidden">
          {/* Header */}
          <div className={`flex items-center h-[85px] justify-between border-b border-gray-200 ${isCollapsed && !isMobile ? 'p-3' : 'p-4'}`}>
            {(!isCollapsed || isMobile) && (
              <Link 
                href={userRole === 'Business User' ? '/business-dashboard/job-postings' : '/business-dashboard'} 
                className="flex items-center space-x-2"
              >
                <div className="relative w-32 h-12">
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
          <nav className={`flex-1 overflow-y-auto ${isCollapsed && !isMobile ? 'px-1 py-2' : 'p-4'} space-y-2`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={`
                    flex items-center rounded-lg transition-colors w-full
                    ${isCollapsed && !isMobile ? 'justify-center p-2' : 'space-x-3 px-4 py-3'}
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
