'use client';

import { useState } from 'react';
import ModernLayoutWrapper from '@/components/ModernLayoutWrapper';
import { Play, Clock, Users, Star, BookOpen, Award, TrendingUp } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Complete React Development Bootcamp',
    instructor: 'Sarah Johnson',
    rating: 4.9,
    students: 12500,
    duration: '40 hours',
    level: 'Intermediate',
    price: '$89',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    skills: ['React', 'JavaScript', 'Redux'],
    progress: 0,
  },
  {
    id: 2,
    title: 'UI/UX Design Masterclass',
    instructor: 'Michael Chen',
    rating: 4.8,
    students: 8900,
    duration: '25 hours',
    level: 'Beginner',
    price: '$69',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    skills: ['Figma', 'Design Thinking', 'Prototyping'],
    progress: 65,
  },
  {
    id: 3,
    title: 'Data Science with Python',
    instructor: 'Dr. Emily Rodriguez',
    rating: 4.7,
    students: 15200,
    duration: '60 hours',
    level: 'Advanced',
    price: '$129',
    image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    skills: ['Python', 'Machine Learning', 'Pandas'],
    progress: 30,
  },
  {
    id: 4,
    title: 'Digital Marketing Strategy',
    instructor: 'Alex Thompson',
    rating: 4.6,
    students: 6700,
    duration: '20 hours',
    level: 'Intermediate',
    price: '$59',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    skills: ['SEO', 'Social Media', 'Analytics'],
    progress: 0,
  },
];

const categories = [
  { name: 'Technology', count: 245, icon: '💻' },
  { name: 'Design', count: 189, icon: '🎨' },
  { name: 'Business', count: 156, icon: '📊' },
  { name: 'Marketing', count: 134, icon: '📢' },
  { name: 'Data Science', count: 98, icon: '📈' },
  { name: 'Photography', count: 87, icon: '📸' },
];

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <ModernLayoutWrapper>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Learning Center
              </h1>
              <p className="text-gray-600">
                Accelerate your career with AI-powered learning paths
              </p>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-6 md:p-8 mb-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Accelerate Your Career with AI-Powered Learning
                </h2>
                <p className="text-lg md:text-xl text-purple-100 mb-6">
                  Discover personalized learning paths designed to match your career goals and market demands
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300">
                    Get Skill Assessment
                  </button>
                  <button className="border-2 border-white text-white font-semibold py-3 px-6 rounded-xl hover:bg-white hover:text-purple-600 transition-all duration-300">
                    Browse Courses
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: BookOpen, label: 'Courses', value: '1,200+' },
                { icon: Users, label: 'Students', value: '50K+' },
                { icon: Award, label: 'Certificates', value: '25K+' },
                { icon: TrendingUp, label: 'Success Rate', value: '94%' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4 text-center border border-gray-100">
                    <Icon className="mx-auto mb-2 text-orange-500" size={24} />
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{category.icon}</span>
                          <span className="font-medium text-gray-700">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{category.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Path</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <span className="text-gray-700">JavaScript Fundamentals</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <span className="text-gray-700">React Development</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-bold">3</span>
                      </div>
                      <span className="text-gray-500">Advanced React</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['all', 'in-progress', 'completed', 'recommended'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <button className="bg-white text-gray-900 rounded-full p-3 hover:scale-110 transition-transform">
                            <Play size={24} />
                          </button>
                        </div>
                        {course.progress > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                            <div className="bg-gray-300 rounded-full h-2">
                              <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-xs mt-1 block">{course.progress}% complete</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            {course.level}
                          </span>
                          <span className="text-lg font-bold text-orange-600">{course.price}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-3">by {course.instructor}</p>
                        
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Star className="text-yellow-400 fill-current mr-1" size={14} />
                            {course.rating}
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {course.students.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {course.duration}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {course.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <button className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:shadow-lg transition-all duration-300">
                          {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
    </ModernLayoutWrapper>
  );
}