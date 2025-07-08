'use client';

import { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { Search, Filter, MapPin, Clock, Star, Bookmark } from 'lucide-react';

const opportunities = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $150k',
    skills: ['React', 'TypeScript', 'Node.js'],
    rating: 4.8,
    posted: '2 days ago',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'UX/UI Designer',
    company: 'Design Studio',
    location: 'San Francisco, CA',
    type: 'Contract',
    salary: '$80 - $120/hr',
    skills: ['Figma', 'Sketch', 'Prototyping'],
    rating: 4.9,
    posted: '1 day ago',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'AI Innovations',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$130k - $180k',
    skills: ['Python', 'Machine Learning', 'SQL'],
    rating: 4.7,
    posted: '3 days ago',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Marketing Consultant',
    company: 'Growth Agency',
    location: 'Remote',
    type: 'Freelance',
    salary: '$50 - $80/hr',
    skills: ['Digital Marketing', 'SEO', 'Analytics'],
    rating: 4.6,
    posted: '1 week ago',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
  },
];

export default function DiscoverPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Discover Opportunities
              </h1>
              <p className="text-gray-600">
                Find your next career move or project opportunity
              </p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  />
                </div>
                <button className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  <Filter size={20} className="mr-2" />
                  Filters
                </button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['all', 'jobs', 'freelance', 'remote', 'full-time'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedFilter === filter
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={opportunity.image}
                        alt={opportunity.company}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{opportunity.title}</h3>
                        <p className="text-gray-600">{opportunity.company}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                      <Bookmark size={20} />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {opportunity.location}
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      {opportunity.type}
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="mr-1 text-yellow-400 fill-current" />
                      {opportunity.rating}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-lg font-semibold text-gray-900 mb-2">{opportunity.salary}</div>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Posted {opportunity.posted}</span>
                    <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-300">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Load More Opportunities
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}