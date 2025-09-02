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
            {/* Desktop Buttons */}
            <Link href="/auth/login" className="hidden sm:inline-flex">
              <StandardizedButton variant="outline" size="default">
                Log In
              </StandardizedButton>
            </Link>
            <Link href="/onboarding" className="hidden sm:inline-block">
              <StandardizedButton variant="primary" size="default">
                Get Started
              </StandardizedButton>
            </Link>
            
            {/* Mobile Buttons */}
            <Link href="/auth/login" className="sm:hidden">
              <StandardizedButton variant="outline" size="sm">
                Login
              </StandardizedButton>
            </Link>
            <Link href="/onboarding" className="sm:hidden">
              <StandardizedButton variant="primary" size="sm">
                Start
              </StandardizedButton>
            </Link>


          </div>
        </div>
      </div>
    </header>
  );
}