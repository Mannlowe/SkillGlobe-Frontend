'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Briefcase,
  User,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  Award
} from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  forceCollapsed?: boolean;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/individual-dashboard' },
  { icon: Briefcase, label: 'Opportunities', href: '/jobs' },
  { icon: Shield, label: 'Identity Curation', href: '/verification' },
  { icon: FileText, label: 'Portfolio', href: '/portfolio' },
  { icon: Award, label: 'Skills', href: '/skills' },
  { icon: User, label: 'Profile', href: '/profile' },
];

// Custom hook to detect mobile
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth < breakpoint);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [breakpoint]);

  return isMobile;
}

export default function Sidebar({ isOpen, onClose, forceCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; userType?: string; company?: string } | null>(null);

  useEffect(() => {
    // Get user info from localStorage on component mount
    const getUserInfo = () => {
      if (typeof window !== 'undefined') {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr);
            setUser(userInfo);
          } catch (error) {
            console.error('Error parsing user info:', error);
          }
        }
      }
    };

    getUserInfo();
  }, []);

  // On mobile, force expanded when visible
  // When forceCollapsed is provided, use that value
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    } else if (forceCollapsed !== undefined) {
      setIsCollapsed(forceCollapsed);
    }
  }, [isMobile, forceCollapsed]);

  // Handle navigation - separate from collapse toggle
  const handleNavigate = (e: React.MouseEvent) => {
    // On mobile, close the overlay after navigation
    if (isMobile) {
      onClose();
    }
    // On desktop, do nothing to collapse state - just navigate
  };

  // Handle collapse toggle - ONLY for desktop
  const handleCollapseToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isMobile) {
      setIsCollapsed(prev => !prev);
    }
  };

  // Handle logout
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    // Close mobile sidebar if open
    if (isMobile) {
      onClose();
    }

    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');

    // Redirect to login page
    router.push('/auth/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'static'} inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out
        ${isMobile
          ? `w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `${isCollapsed ? 'w-20' : 'w-64'} translate-x-0`
        }
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center h-[82px] justify-between border-b border-gray-200 ${isCollapsed && !isMobile ? 'p-3' : 'p-4'}`}>
            {(!isCollapsed || isMobile) && (
              <Link href="/individual-dashboard" className="flex items-center space-x-2">
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
              <div className="flex justify-center w-full">
                <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    onClick={handleCollapseToggle}
                    src="/Images/favicon/apple-touch-icon.png"
                    alt="Logo"
                    width={32}
                    height={32}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {/* Collapse Toggle - Desktop Only */}
              {!isMobile && !isCollapsed && (
                <button
                  type="button"
                  onClick={handleCollapseToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft size={16} />
                </button>
              )}

              {/* Close Button - Mobile Only */}
              {isMobile && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

          </div>

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-2 overflow-y-auto font-rubik ${isCollapsed && !isMobile ? 'px-2' : 'px-4'}`}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigate}
                  className={`
                    flex items-center rounded-lg transition-colors relative
                    ${isCollapsed && !isMobile ? 'justify-center p-3' : 'space-x-3 px-4 py-3'}
                    ${isActive
                      ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
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