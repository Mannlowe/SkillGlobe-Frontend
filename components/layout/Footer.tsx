'use client';

import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">
                <span className="text-orange-500">Skill</span>
                <span className="text-blue-500">Globe</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6 font-nunito">
              Empowering professionals through AI-driven hiring, curated skills, verified growth, and meaningful opportunities
            </p>
            {/* <div className="flex space-x-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => {
                const socialNames = ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'];
                return (
                  <StandardizedButton
                    key={index}
                    variant="ghost"
                    size="icon"
                    className="w-10 h-10 bg-gray-800 hover:bg-orange-500 text-white"
                    aria-label={`Visit our ${socialNames[index]} page`}
                  >
                    <Icon size={20} />
                  </StandardizedButton>
                );
              })}
            </div> */}
          </div>

          {/* Quick Links */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Discover', 'Jobs', 'Services', 'Learn', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* For Professionals */}
          {/* <div>
            <h3 className="text-lg font-semibold mb-4">For Professionals</h3>
            <ul className="space-y-2">
              {['Find Opportunities', 'Skill Assessment', 'Career Coaching', 'Freelance Services', 'Learning Paths', 'Success Stories'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Contact Info */}
          <div className="font-nunito mt-2">
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-orange-600 via-[#007BCA] to-[#007BCA] bg-clip-text text-transparent">
              Get in Touch
            </h3>


            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-orange-500" />
                <span className="text-gray-400">support@skillglobe.ai</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Phone size={16} className="text-orange-500" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div> */}
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-orange-500" />
                <span className="text-gray-400">Pune, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-end items-end">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} SkillGlobe. All rights reserved.
            </p>

            {/* <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-orange-500 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}