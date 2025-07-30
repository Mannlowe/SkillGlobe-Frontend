'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  MessageCircle,
  ChevronDown,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Building2,
  Menu
} from 'lucide-react';
import useOutsideClick from '@/hooks/useOutsideClick';
import { useAuthStore } from '@/store/authStore';

interface BusinessDashboardHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export default function BusinessDashboardHeader({ title, onMenuClick }: BusinessDashboardHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Get user data from auth store
  const { user: authUser, isAuthenticated } = useAuthStore();

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useOutsideClick(profileRef, () => setShowProfile(false));
  useOutsideClick(notificationsRef, () => setShowNotifications(false));

  const notifications = [
    { id: 1, title: 'New applicant for Frontend Developer', time: '5 min ago', unread: true },
    { id: 2, title: 'Interview scheduled with John Doe', time: '1 hour ago', unread: true },
    { id: 3, title: 'Job posting expires tomorrow', time: '2 hours ago', unread: false },
  ];

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

  const isMobile = useIsMobile();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:block lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {!isMobile && (
            <>
              {title && (
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              )}

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search jobs, applicants, team members..."
                  className="pl-10 pr-4 py-2 w-80 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </>
          )}

        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={20} />
          </button>

          {/* Messages */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <MessageCircle size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${notification.unread ? 'bg-blue-50' : ''}`}>
                      <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                  alt="Profile"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{authUser?.full_name || authUser?.name || 'Business User'}</p>
                  <p className="text-sm text-gray-600">{authUser?.email || 'business@example.com'}</p>
                  {/* {authUser?.user_type && (
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Building2 size={12} className="mr-1" />
                      <span>{authUser.user_type}</span>
                    </div>
                  )} */}
                </div>
                <div className="py-2">
                  <button
                    onClick={() => router.push('/business-dashboard/company-profile')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="mr-3 text-gray-500" />
                    Business Profile
                  </button>

                  {/* <button
                    onClick={() => router.push('/business-dashboard/settings')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings size={16} className="mr-3 text-gray-500" />
                    Settings
                  </button> */}

                  <button
                    onClick={() => router.push('/help')}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <HelpCircle size={16} className="mr-3 text-gray-500" />
                    Help & Support
                  </button>

                  <hr className="my-2" />

                  <button
                    onClick={() => {
                      // Use the logout function from auth store
                      useAuthStore.getState().logout();
                      // Redirect to login page
                      router.push('/auth/login');
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-3 text-red-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
