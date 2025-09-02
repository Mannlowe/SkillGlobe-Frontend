'use client';

import { ArrowRight, Smartphone, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { StandardizedButton } from '@/components/ui/StandardizedButton';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-orange-500 to-blue-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-lg md:text-xl text-orange-100 max-w-3xl mx-auto mb-8 md:mb-12">
            Join thousands of professionals already building their future with SkillGlobe
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/onboarding">
              <StandardizedButton
                variant="secondary"
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-50 hover:scale-105 transition-all duration-300 px-8 py-4"
              >
                Get Started for Free
                <ArrowRight className="ml-2" size={20} />
              </StandardizedButton>
            </Link>
            <Link href="#">
              <StandardizedButton
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 transition-all duration-300 px-8 py-4"
              >
                Watch Demo
              </StandardizedButton>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: Smartphone,
              title: 'Mobile-First',
              description: 'Access opportunities anywhere with the mobile app',
            },
            {
              icon: Users,
              title: 'Community Driven',
              description: 'Connect with like-minded professionals globally',
            },
            {
              icon: Zap,
              title: 'Curated Results',
              description: 'Get matched with opportunities in real-time',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-orange-100">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}