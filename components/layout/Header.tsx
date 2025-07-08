'use client';

import { Bell, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="bg-white rounded-lg overflow-hidden">
              <Image 
                src="/Images/logo_image.png" 
                alt="SkillGlobe Logo" 
                width={180} 
                height={30} 
                priority
                className="mix-blend-multiply"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
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
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Login Button */}
            <Link 
              href="/auth/login"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-all duration-300"
            >
              Sign In
            </Link>
            
            {/* Get Started Button */}
            <Link 
              href="/auth/login"
              className="skillglobe-button"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Login</span>
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