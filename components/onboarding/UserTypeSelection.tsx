'use client';

import { User, Building } from 'lucide-react';
import { useRegistrationStore } from '@/store/registration';

interface UserTypeSelectionProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function UserTypeSelection({ data, updateData, nextStep }: UserTypeSelectionProps) {
  // Get registration state and actions from store
  const { setUserType, isLoading, error } = useRegistrationStore();
  
  const handleUserTypeSelect = async (userType: 'individual' | 'business') => {
    // Update local state
    updateData({ userType });
    
    try {
      // Call store action to handle API request
      await setUserType(userType);
      
      // Auto-advance after selection
      setTimeout(() => {
        nextStep();
      }, 300);
    } catch (err) {
      console.error('Error selecting user type:', err);
      // Error is handled by the store
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Welcome to SkillGlobe
        </h1>
        <p className="text-gray-600 text-lg">
          Let&apos;s get started by understanding how you&apos;ll use our platform
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
                I&apos;m looking for jobs, freelance work, or want to learn new skills
                {/* <span className="text-xs text-blue-500 block mt-1">(Default: Seller)</span> */}
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
                I&apos;m hiring talent, need services, or want to train my team
                {/* <span className="text-xs text-blue-500 block mt-1">(Default: Buyer)</span> */}
              </p>
            </div>
          </div>
        </button>
      </div>

      {error && (
        <div className="text-center text-sm text-red-500 p-2 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      
      {/* <div className="text-center text-sm text-gray-500">
        {isLoading ? 'Processing...' : 'You can change this later in your account settings'}
      </div> */}
    </div>
  );
}