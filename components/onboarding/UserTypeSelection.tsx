'use client';

import { User, Building } from 'lucide-react';

interface UserTypeSelectionProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function UserTypeSelection({ data, updateData, nextStep }: UserTypeSelectionProps) {
  const handleUserTypeSelect = (userType: 'individual' | 'business') => {
    updateData({ userType });
    // Auto-advance after selection
    setTimeout(() => {
      nextStep();
    }, 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Welcome to SkillGlobe
        </h1>
        <p className="text-gray-600 text-lg">
          Let's get started by understanding how you'll use our platform
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleUserTypeSelect('individual')}
          className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
            data.userType === 'individual'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              data.userType === 'individual' ? 'bg-orange-500' : 'bg-gray-100'
            }`}>
              <User className={data.userType === 'individual' ? 'text-white' : 'text-gray-600'} size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Individual</h3>
              <p className="text-gray-600 text-sm">
                I'm looking for jobs, freelance work, or want to learn new skills
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleUserTypeSelect('business')}
          className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 ${
            data.userType === 'business'
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              data.userType === 'business' ? 'bg-orange-500' : 'bg-gray-100'
            }`}>
              <Building className={data.userType === 'business' ? 'text-white' : 'text-gray-600'} size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Business / Organization</h3>
              <p className="text-gray-600 text-sm">
                I'm hiring talent, need services, or want to train my team
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="text-center text-sm text-gray-500">
        You can change this later in your account settings
      </div>
    </div>
  );
}