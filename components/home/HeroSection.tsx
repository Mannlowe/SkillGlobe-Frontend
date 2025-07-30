'use client';

import { Search, MapPin, Filter } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-orange-500 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
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
      

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
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
        </div>
      </div>
    </section>
  );
}