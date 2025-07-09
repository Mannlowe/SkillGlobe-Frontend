'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Search, 
  Briefcase, 
  BookOpen, 
  User, 
  Settings, 
  BarChart3, 
  MessageCircle, 
  Bell,
  LogOut,
  X,
  ChevronDown,
  Building,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/individual-dashboard' },
  // { icon: Search, label: 'Discover', href: '/discover' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: Briefcase, label: 'Identity Verification', href: '/verification' },
  { icon: Briefcase, label: 'Portfolio', href: '/portfolio' },
  { icon: Briefcase, label: 'Profile', href: '/jobs' },
  { icon: Briefcase, label: 'Skills', href: '/skills' },
  // { icon: Building, label: 'Services', href: '/services' },
  // { icon: BookOpen, label: 'Learning', href: '/learn' },
  // { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  // { icon: MessageCircle, label: 'Messages', href: '/messages' },
  // { icon: DollarSign, label: 'Earnings', href: '/earnings' },
];

const bottomMenuItems = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
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

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

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
          <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${isCollapsed && !isMobile ? 'px-4' : ''}`}>
            {(!isCollapsed || isMobile) && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
                <span className="text-xl font-bold">
                  <span className="text-orange-500">Skill</span>
                  <span className="text-blue-500">Globe</span>
                </span>
              </div>
            )}
            
            {isCollapsed && !isMobile && (
              <div className="flex justify-center w-full">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SG</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              {/* Collapse Toggle - Desktop Only */}
              {!isMobile && (
                <button 
                  type="button"
                  onClick={handleCollapseToggle}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
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

          {/* User Info */}
          {(!isCollapsed || isMobile) && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.userType === 'business' ? (user?.company || 'Business') : 'Individual'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Collapsed User Avatar */}
          {isCollapsed && !isMobile && (
            <div className="p-4 border-b border-gray-200 flex justify-center">
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop"
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
                title={user?.name || 'User'}
              />
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${isCollapsed && !isMobile ? 'px-2' : 'px-4'}`}>
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

          {/* Bottom Menu */}
          <div className={`border-t border-gray-200 space-y-2 ${isCollapsed && !isMobile ? 'p-2' : 'p-4'}`}>
            {bottomMenuItems.map((item) => {
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
                      ? 'bg-orange-50 text-orange-600' 
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
            
            <button 
              type="button"
              onClick={handleLogout}
              className={`
                flex items-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors w-full
                ${isCollapsed && !isMobile ? 'justify-center p-3' : 'space-x-3 px-4 py-3'}
              `}
              title={isCollapsed && !isMobile ? 'Logout' : undefined}
            >
              <LogOut size={20} />
              {(!isCollapsed || isMobile) && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}