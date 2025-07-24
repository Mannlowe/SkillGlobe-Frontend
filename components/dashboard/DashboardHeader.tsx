'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, Search, Bell, MessageCircle, ChevronDown } from 'lucide-react';
import useOutsideClick from '@/hooks/useOutsideClick'; // adjust path as needed
import { useAuthStore } from '@/store/authStore';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
  title?: string;
}

export default function DashboardHeader({ onMenuClick, title }: DashboardHeaderProps) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Use reusable outside click hook
  useOutsideClick(profileRef, () => setShowProfile(false));
  useOutsideClick(notificationsRef, () => setShowNotifications(false));

  // User data is now handled by useAuthStore

  const notifications = [
    { id: 1, title: 'New job match found', time: '5 min ago', unread: true },
    { id: 2, title: 'Interview reminder', time: '1 hour ago', unread: true },
    { id: 3, title: 'Course completed', time: '2 hours ago', unread: false },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-30 font-rubik h-[82px]">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          {title && (
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          )}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs, courses, people..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search size={20} />
          </button>

          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <MessageCircle size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
            </button>
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
                  <button className="text-orange-600 text-sm font-medium hover:text-orange-700">View all notifications</button>
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
            {showProfile && (
              <div className="absolute right-0 mt-2 max-w-fit bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{user?.full_name || user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="py-2">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    View Profile
                  </a>
                  <a 
                    href={user?.user_type === 'business' ? '/business-dashboard/settings' : '/settings'} 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <a href="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Help & Support
                  </a>
                  <hr className="my-2" />
                  <button 
                    onClick={() => {
                      localStorage.removeItem('userInfo');
                      router.push('/auth/login');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
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
