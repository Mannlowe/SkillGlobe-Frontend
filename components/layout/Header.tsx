'use client';

import { Bell, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <div className="bg-white rounded-lg overflow-hidden">
              <Image
                src="/Images/logo_image.jpg"
                alt="SkillGlobe Logo"
                width={180}
                height={30}
                priority
                className="mix-blend-multiply"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link href="/discover" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Discover
            </Link>
            <Link href="/jobs" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Jobs
            </Link>
            <Link href="/learn" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Learn
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Services
            </Link>
          </nav> */}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            <Link href="/auth/login" className="hidden sm:inline-flex">
              <StandardizedButton variant="gradient-text" size="default">
                Log In
              </StandardizedButton>
            </Link>

            {/* Get Started Button - Desktop */}
            <Link href="/onboarding" className="hidden sm:inline-block">
              <StandardizedButton variant="gradient-text" size="default">
                Get Started
              </StandardizedButton>
            </Link>
            
            {/* Login Button - Mobile */}
            <Link href="/auth/login" className="sm:hidden">
              <StandardizedButton variant="gradient-text" size="default">
                Login
              </StandardizedButton>
            </Link>


            {/* Mobile Login (when Get Started is hidden) */}
            <Link
              href="/auth/login"
              className="sm:hidden p-2 text-gray-600 hover:text-orange-500 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}