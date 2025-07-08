'use client';

import { useState } from 'react';
import { Briefcase, DollarSign, MapPin, Star, CheckCircle } from 'lucide-react';

interface ProfileCreationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function ProfileCreation({ data, updateData, nextStep }: ProfileCreationProps) {
  const [profileData, setProfileData] = useState({
    roleTitle: '',
    salaryRange: '',
    location: '',
    primarySkill: '',
    secondarySkills: [] as string[],
  });

  const salaryRanges = [
    '$30k - $50k',
    '$50k - $75k',
    '$75k - $100k',
    '$100k - $150k',
    '$150k+',
  ];

  const locations = [
    'Remote',
    'New York, NY',
    'San Francisco, CA',
    'Los Angeles, CA',
    'Chicago, IL',
    'Austin, TX',
  ];

  const handleComplete = () => {
    updateData({ 
      profileCreated: true,
      profile: profileData 
    });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="text-green-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Profile
        </h1>
        <p className="text-gray-600">
          Set up your professional profile to get matched with opportunities
        </p>
      </div>

      <div className="space-y-4">
        {/* Role Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What role are you looking for?
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={profileData.roleTitle}
              onChange={(e) => setProfileData({ ...profileData, roleTitle: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              placeholder="e.g., Full Stack Developer, UX Designer"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Salary Range
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={profileData.salaryRange}
              onChange={(e) => setProfileData({ ...profileData, salaryRange: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">Select salary range</option>
              {salaryRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={profileData.location}
              onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">Select location</option>
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Skill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Skill <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={profileData.primarySkill}
              onChange={(e) => setProfileData({ ...profileData, primarySkill: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none"
            >
              <option value="">Select your main expertise</option>
              {data.skills?.map((skill: string) => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This represents your main area of expertise for job matching
          </p>
        </div>
      </div>

      {/* Profile Preview */}
      <div className="bg-gradient-to-r from-orange-50 to-blue-50 p-4 rounded-xl border border-orange-200">
        <h3 className="font-semibold text-gray-900 mb-3">Profile Preview</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <Briefcase size={14} className="text-gray-600" />
            <span className="text-gray-700">
              {profileData.roleTitle || 'Role not specified'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign size={14} className="text-gray-600" />
            <span className="text-gray-700">
              {profileData.salaryRange || 'Salary range not specified'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin size={14} className="text-gray-600" />
            <span className="text-gray-700">
              {profileData.location || 'Location not specified'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star size={14} className="text-gray-600" />
            <span className="text-gray-700">
              Primary: {profileData.primarySkill || 'Not selected'}
            </span>
          </div>
        </div>
      </div>

      {/* Completion Benefits */}
      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
        <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
        <div className="space-y-2 text-sm text-green-700">
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Get matched with relevant job opportunities</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Receive personalized learning recommendations</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle size={14} className="text-green-600" />
            <p>Access your dashboard and start exploring</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleComplete}
        disabled={!profileData.primarySkill}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Complete Setup & Enter Dashboard
      </button>

      <div className="text-center text-sm text-gray-500">
        You can update your profile anytime from your dashboard
      </div>
    </div>
  );
}