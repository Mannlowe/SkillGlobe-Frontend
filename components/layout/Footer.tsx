'use client';

import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          {/* Brand */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-3xl font-bold">
              <span className="text-orange-500">Skill</span>
              <span className="text-blue-500">Globe</span>
            </span>
          </div>
          
          {/* Description */}
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Empowering professionals worldwide with AI-driven talent solutions and personalized career growth.
          </p>
          
          {/* Contact & Social in one row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex items-center space-x-2">
                <Mail size={18} className="text-orange-500" />
                <span className="text-gray-300">hello@skillglobe.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-orange-500" />
                <span className="text-gray-300">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>
          
          {/* Social Icons */}
          <div className="flex justify-center space-x-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => {
              const socialNames = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'];
              return (
                <StandardizedButton
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 bg-gray-800 hover:bg-orange-500 text-white transition-all duration-300 hover:scale-110"
                  aria-label={`Visit our ${socialNames[index]} page`}
                >
                  <Icon size={22} />
                </StandardizedButton>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 SkillGlobe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}