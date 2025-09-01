/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Target,
  User,
  TrendingUp,
  ChevronDown,
  Brain,
  Briefcase,
  Users,
  Bell,
  MessageSquare,
  Settings,
  Menu,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useAuthStore } from '@/store';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  children?: {
    id: string;
    label: string;
    icon: React.ReactNode;
    href: string;
    description?: string;
  }[];
}

interface HorizontalNavigationProps {
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
  isSidebarOpen?: boolean;
  notifications?: number;
  messages?: number;
  onNotificationClick?: () => void;
  onMessageClick?: () => void;
  onSettingsClick?: () => void;
  onProfileClick?: () => void;
  userAvatar?: string;
  userName?: string;
}

export default function HorizontalNavigation({
  onMenuClick,
  onSidebarToggle,
  isSidebarOpen = false,
  notifications = 0,
  messages = 0,
  onNotificationClick,
  onMessageClick,
  onSettingsClick,
  onProfileClick,
  userAvatar,

}: HorizontalNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      href: '/individual-dashboard'
    },
    {
      id: 'opportunities',
      label: 'Opportunities',
      icon: <Target className="w-4 h-4" />,
      href: '/opportunities',
      badge: 3
    },
    {
      id: 'identity',
      label: 'My Identity',
      icon: <User className="w-4 h-4" />,
      children: [
        {
          id: 'curation',
          label: 'Curation',
          icon: <Shield className="w-4 h-4" />,
          href: '/verification',
          description: 'Verify your identity for premium opportunities'
        },
        {
          id: 'skills',
          label: 'Skills',
          icon: <Brain className="w-4 h-4" />,
          href: '/skills',
          description: 'Manage your skills and expertise'
        },
        {
          id: 'portfolio',
          label: 'Portfolio',
          icon: <Briefcase className="w-4 h-4" />,
          href: '/portfolio',
          description: 'Showcase your work and projects'
        },
        {
          id: 'profiles',
          label: 'Profiles',
          icon: <Users className="w-4 h-4" />,
          href: '/profiles',
          description: 'Manage multiple professional profiles'
        }
      ]
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: <TrendingUp className="w-4 h-4" />,
      href: '/insights'
    }
  ];

  const isActive = (item: NavigationItem) => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.children) {
      return item.children.some(child => pathname === child.href);
    }
    return false;
  };

  const isChildActive = (href: string) => pathname === href;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const [userName, setUserName] = useState('User');
  const { user, isAuthenticated } = useAuthStore();

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      if (!isAuthenticated) {
        router.push('/auth/login');
      }
    }, 100);
    
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && user && window.location.pathname.includes('individual-dashboard')) {
      setUserName(user.full_name || user.name);
    }
  }, [isAuthenticated, user]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Left Section: Menu Button and Logo */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Desktop Sidebar Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100 transition-colors"
            title={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className={`w-5 h-5 transition-colors ${isSidebarOpen ? 'text-blue-600' : 'text-gray-600'}`} />
          </Button>

          {/* Logo */}
          <button
            className="flex items-center ml-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-md p-1"
            onClick={() => router.push('/')}
            aria-label="Go to homepage"
          >
            <img
              src="/Images/logo_image.jpg"
              alt="SkillGlobe"
              className="h-12 w-auto object-contain max-w-[180px]"
            />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 ml-8 flex-1">
          {navigationItems.map((item) => {
            if (item.children) {
              return (
                <DropdownMenu key={item.id} open={isIdentityOpen} onOpenChange={setIsIdentityOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors",
                        isActive(item)
                          ? "text-[#FF6B35] bg-[#FF6B35]/10"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <ChevronDown className={cn(
                        "w-3 h-3 transition-transform",
                        isIdentityOpen ? "rotate-180" : ""
                      )} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-64"
                    sideOffset={5}
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500 uppercase">
                      Professional Identity
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        key={child.id}
                        onClick={() => handleNavigation(child.href)}
                        className={cn(
                          "cursor-pointer",
                          child.id === 'curation'
                            ? "border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100"
                            : "",
                          isChildActive(child.href) && "bg-[#FF6B35]/10"
                        )}
                      >
                        <div className="flex items-start space-x-3 py-1">
                          <div className={cn(
                            "mt-0.5",
                            child.id === 'curation'
                              ? "text-orange-600"
                              : isChildActive(child.href)
                                ? "text-[#FF6B35]"
                                : "text-gray-500"
                          )}>
                            {child.icon}
                          </div>
                          <div className="flex-1">
                            <div className={cn(
                              "font-medium text-sm flex items-center gap-2",
                              child.id === 'curation'
                                ? "text-orange-700"
                                : isChildActive(child.href)
                                  ? "text-[#FF6B35]"
                                  : "text-gray-900"
                            )}>
                              {child.label}
                              {child.id === 'curation' && (
                                <span className="px-1.5 py-0.5 text-xs bg-orange-200 text-orange-800 rounded-full font-medium">
                                  Important
                                </span>
                              )}
                            </div>
                            {child.description && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {child.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => item.href && handleNavigation(item.href)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors relative",
                  isActive(item)
                    ? "text-[#FF6B35] bg-[#FF6B35]/10"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 px-1.5 text-xs bg-[#FF6B35] text-white"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Quick Tools */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onNotificationClick}
            className="relative"
          >
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white"
              >
                {notifications > 9 ? '9+' : notifications}
              </Badge>
            )}
          </Button>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMessageClick}
            className="relative"
          >
            <MessageSquare className="w-5 h-5" />
            {messages > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-blue-500 text-white"
              >
                {messages > 9 ? '9+' : messages}
              </Badge>
            )}
          </Button>

          {/* Settings */}
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="hidden sm:flex"
          >
            <Settings className="w-5 h-5" />
          </Button> */}

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-md"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-blue-600 rounded-md flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials(userName)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 px-2 py-3">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                {/* <User className="mr-2 h-4 w-4" /> */}
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer sm:hidden">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  localStorage.clear();
                  router.push('/auth/login');
                }} 
                className="cursor-pointer text-red-600"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          {navigationItems.filter(item => !item.children).map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => item.href && handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center space-y-1 h-full rounded-none relative",
                isActive(item)
                  ? "text-[#FF6B35]"
                  : "text-gray-600"
              )}
            >
              {item.icon}
              <span className="text-xs">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge
                  className="absolute top-1 right-1 h-4 px-1 text-xs bg-[#FF6B35] text-white"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}

          {/* My Identity for mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex flex-col items-center space-y-1 h-full rounded-none",
                  navigationItems.find(item => item.id === 'identity' && isActive(item))
                    ? "text-[#FF6B35]"
                    : "text-gray-600"
                )}
              >
                <User className="w-4 h-4" />
                <span className="text-xs">Identity</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="w-56 mb-2">
              {navigationItems.find(item => item.id === 'identity')?.children?.map((child) => (
                <DropdownMenuItem
                  key={child.id}
                  onClick={() => handleNavigation(child.href)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    {child.icon}
                    <span className="text-sm">{child.label}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}