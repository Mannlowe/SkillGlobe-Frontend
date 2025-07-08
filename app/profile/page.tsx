'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import MobileNavigation from '@/components/layout/MobileNavigation';
import { Edit, MapPin, Mail, Phone, Calendar, Award, Briefcase, GraduationCap, Star, TrendingUp } from 'lucide-react';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const user = {
    name: 'Alex Johnson',
    title: 'Senior Full Stack Developer',
    location: 'San Francisco, CA',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2023',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    bio: 'Passionate full stack developer with 8+ years of experience building scalable web applications. Love working with React, Node.js, and cloud technologies.',
    skills: [
      { name: 'React', level: 95, endorsements: 24 },
      { name: 'Node.js', level: 90, endorsements: 18 },
      { name: 'TypeScript', level: 85, endorsements: 15 },
      { name: 'AWS', level: 80, endorsements: 12 },
      { name: 'PostgreSQL', level: 75, endorsements: 9 },
    ],
    stats: {
      profileViews: 1250,
      connectionsGrowth: '+15%',
      skillRating: 4.8,
      projectsCompleted: 47,
    },
  };

  const experiences = [
    {
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc.',
      duration: '2022 - Present',
      description: 'Leading development of microservices architecture and mentoring junior developers.',
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      duration: '2020 - 2022',
      description: 'Built and maintained multiple web applications using React and Node.js.',
    },
  ];

  const education = [
    {
      degree: 'Bachelor of Computer Science',
      school: 'University of California, Berkeley',
      year: '2016',
    },
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: '2023' },
    { name: 'React Developer Certification', issuer: 'Meta', year: '2022' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="skillglobe-card p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                  />
                  <button className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600 transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.title}</p>
                
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <div className="flex items-center justify-center">
                    <MapPin size={16} className="mr-2" />
                    {user.location}
                  </div>
                  <div className="flex items-center justify-center">
                    <Mail size={16} className="mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center justify-center">
                    <Calendar size={16} className="mr-2" />
                    Joined {user.joinDate}
                  </div>
                </div>
                
                <button className="w-full skillglobe-button mb-4">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="skillglobe-card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">{user.stats.profileViews}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Connections Growth</span>
                  <span className="font-semibold text-green-600">{user.stats.connectionsGrowth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Skill Rating</span>
                  <div className="flex items-center">
                    <Star className="text-yellow-400 fill-current mr-1" size={16} />
                    <span className="font-semibold text-gray-900">{user.stats.skillRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects Completed</span>
                  <span className="font-semibold text-gray-900">{user.stats.projectsCompleted}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="skillglobe-card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skills</h3>
              <div className="space-y-4">
                {user.skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.endorsements} endorsements</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="skillglobe-card p-6 mb-6">
              <div className="flex flex-wrap gap-2 mb-6">
                {['overview', 'experience', 'education', 'certifications'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{user.bio}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="text-blue-600 mr-2" size={20} />
                        <span className="font-semibold text-blue-800">Career Growth</span>
                      </div>
                      <p className="text-blue-700">+25% skill improvement this year</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Award className="text-green-600 mr-2" size={20} />
                        <span className="font-semibold text-green-800">Achievements</span>
                      </div>
                      <p className="text-green-700">Top 5% performer in React</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'experience' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                  <div className="space-y-6">
                    {experiences.map((exp, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{exp.title}</h4>
                            <p className="text-gray-600">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'education' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <GraduationCap className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                          <p className="text-gray-600">{edu.school}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'certifications' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Award className="text-green-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                          <p className="text-gray-600">{cert.issuer}</p>
                          <p className="text-sm text-gray-500">{cert.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileNavigation />
      <div className="h-20 md:h-0"></div>
    </div>
  );
}