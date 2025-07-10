'use client';

import { Search, MapPin, Filter } from 'lucide-react';
import { useState } from 'react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-orange-600 text-white">
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6 h-24">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
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

              {/* Location Input */}
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

              {/* Filter Button */}
              <button className="md:w-auto px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Filter size={20} />
                <span className="ml-2 md:hidden">Filters</span>
              </button>

              {/* Search Button */}
              <button className="relative border-0 font-semibold py-2 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                {/* Gradient border using pseudo-element */}
                <span className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 rounded-xl -z-10"></span>
                {/* White background slightly smaller to show gradient border */}
                <span className="absolute inset-[1px] bg-white rounded-lg -z-5"></span>
                {/* Text with gradient */}
                <span className="relative bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                  <span className="md:hidden">Search Opportunities</span>
                  <span className="hidden md:inline">Search</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8 md:mt-12">
          {[
            { number: '50K+', label: 'Active Users' },
            { number: '10K+', label: 'Job Opportunities' },
            { number: '5K+', label: 'Skills Available' },
            { number: '95%', label: 'Success Rate' },
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