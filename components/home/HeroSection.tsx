'use client';

import { ArrowRight, Smartphone, Users, Zap } from 'lucide-react';
import { StandardizedButton } from '@/components/ui/StandardizedButton';
import Link from 'next/link';

export default function HeroSection() {

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-orange-500 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Your Skills,
            <br />
            <span className="text-orange-300">Unlimited Opportunities</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Connect with opportunities, monetize your expertise, and grow your skills in our AI-powered talent ecosystem
          </p>
        </div>

        {/* Search Section */}
        {/* <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 h-24">
            <div className="flex flex-col md:flex-row gap-4">
         
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search skills, jobs, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
              </div>

           
              <div className="md:w-64 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-800 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
              </div>

             
              <StandardizedButton
                variant="secondary"
                size="lg"
                leftIcon={<Filter size={20} />}
                className="md:w-auto"
                aria-label="Open filters"
              >
                <span className="md:hidden">Filters</span>
              </StandardizedButton>

          
              <StandardizedButton
                variant="outline"
                size="lg"
                className="md:w-auto border-2 border-gradient-to-r from-orange-500 to-blue-500 bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent hover:shadow-lg hover:scale-105"
              >
                <span className="md:hidden">Search Opportunities</span>
                <span className="hidden md:inline">Search</span>
              </StandardizedButton>
            </div>
          </div>
        </div> */}

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
          {[
            { number: '5K+', label: 'Active Users' },
            { number: '1K+', label: 'Job Opportunities' },
            { number: '5K+', label: 'Skills Available' },
            { number: '85%', label: 'Success Rate' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-orange-300">{stat.number}</div>
              <div className="text-sm md:text-base text-blue-100">{stat.label}</div>
            </div>
          ))}
        </div> */}

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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
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