'use client';

import { useState } from 'react';
import ModernLayoutWrapper from '@/components/ModernLayoutWrapper';
import { Search, Filter, Star, MapPin, Clock, Users, CheckCircle } from 'lucide-react';

const services = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    provider: 'Alex Johnson',
    rating: 4.9,
    reviews: 127,
    price: '$75/hr',
    location: 'Remote',
    category: 'Development',
    skills: ['React', 'Node.js', 'MongoDB'],
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    verified: true,
    responseTime: '2 hours',
    completedProjects: 45,
  },
  {
    id: 2,
    title: 'UI/UX Design & Prototyping',
    provider: 'Sarah Chen',
    rating: 4.8,
    reviews: 89,
    price: '$60/hr',
    location: 'San Francisco, CA',
    category: 'Design',
    skills: ['Figma', 'Adobe XD', 'User Research'],
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    verified: true,
    responseTime: '1 hour',
    completedProjects: 32,
  },
  {
    id: 3,
    title: 'Digital Marketing Strategy',
    provider: 'Michael Rodriguez',
    rating: 4.7,
    reviews: 156,
    price: '$50/hr',
    location: 'Remote',
    category: 'Marketing',
    skills: ['SEO', 'Google Ads', 'Analytics'],
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    verified: true,
    responseTime: '3 hours',
    completedProjects: 78,
  },
  {
    id: 4,
    title: 'Data Analysis & Visualization',
    provider: 'Emily Davis',
    rating: 4.9,
    reviews: 94,
    price: '$80/hr',
    location: 'New York, NY',
    category: 'Data Science',
    skills: ['Python', 'Tableau', 'SQL'],
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    verified: true,
    responseTime: '4 hours',
    completedProjects: 29,
  },
];

const categories = [
  { name: 'All Services', count: 1250 },
  { name: 'Development', count: 450 },
  { name: 'Design', count: 320 },
  { name: 'Marketing', count: 280 },
  { name: 'Data Science', count: 200 },
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Services');

  return (
    <ModernLayoutWrapper>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Professional Services
              </h1>
              <p className="text-gray-600">
                Find expert freelancers and service providers for your projects
              </p>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl text-white p-6 md:p-8 mb-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Monetize Your Skills
                </h2>
                <p className="text-lg md:text-xl text-blue-100 mb-6">
                  Offer your expertise to a global marketplace and build your freelance business
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    Start Selling
                  </button>
                  <button className="border-2 border-white text-white font-semibold py-3 px-6 rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search services..."
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
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.name
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative">
                    <img
                      src={service.image}
                      alt={service.provider}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {service.verified && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                          <CheckCircle size={12} className="mr-1" />
                          Verified
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {service.category}
                      </span>
                      <span className="text-xl font-bold text-orange-600">{service.price}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3">by {service.provider}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="text-yellow-400 fill-current mr-1" size={14} />
                        {service.rating} ({service.reviews})
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {service.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        Responds in {service.responseTime}
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="mr-1" />
                        {service.completedProjects} projects
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
                        Contact
                      </button>
                      <button className="px-4 py-2 border-2 border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <button className="bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Load More Services
              </button>
            </div>
          </div>
    </ModernLayoutWrapper>
  );
}