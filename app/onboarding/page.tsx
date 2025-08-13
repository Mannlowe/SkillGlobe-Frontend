'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, User, Building, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Individual Components
import UserTypeSelection from '@/components/onboarding/UserTypeSelection';
import BasicInformation from '@/components/onboarding/BasicInformation';
import OTPVerification from '@/components/onboarding/OTPVerification';
import TermsAcceptance from '@/components/onboarding/TermsAcceptance';

// Business Components
import BusinessBasicInformation from '@/components/onboarding/BusinessBasicInformation';
import BusinessTermsAcceptance from '@/components/onboarding/BusinessTermsAcceptance';
import BusinessProfile from '@/components/onboarding/BusinessProfile';

export interface OnboardingData {
  userType: 'individual' | 'business' | '';
  // Individual fields
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  emailOTP: string;
  mobileOTP: string;
  termsAccepted: boolean;
  identityVerified: boolean;
  portfolioCompleted: boolean;
  skillsSetup: boolean;
  profileCreated: boolean;
  skills: string[];
  // Business fields
  businessName: string;
  contactPersonName: string;
  businessAddress: string;
  website: string;
  taxId: string;
  industrySector: string;
  organizationSize: string;
  businessDescription: string;
  logo: string;
  socialLinks: string;
  authDocument: string;
  businessProfileCompleted: boolean;
  documentVerified: boolean;
  dashboardSetup: boolean;
}

const individualSteps = [
  { id: 'userType', title: 'User Type', component: UserTypeSelection },
  { id: 'basicInfo', title: 'Basic Info', component: BasicInformation },
  { id: 'otpVerification', title: 'Verification', component: OTPVerification },
  { id: 'terms', title: 'Terms', component: TermsAcceptance },
  // { id: 'profile', title: 'Profile', component: ProfileCreation },
];

const businessSteps = [
  { id: 'userType', title: 'User Type', component: UserTypeSelection },
  { id: 'basicInfo', title: 'Basic Info', component: BusinessBasicInformation },
  { id: 'otpVerification', title: 'Verification', component: OTPVerification },
  { id: 'terms', title: 'Terms', component: BusinessTermsAcceptance },
  // { id: 'businessProfile', title: 'Profile', component: BusinessProfile },
  // { id: 'documentVerification', title: 'Documents', component: BusinessDocumentVerification },
  // { id: 'dashboardSetup', title: 'Dashboard', component: BusinessDashboardSetup },
];

// Function to fetch lead data from backend
async function fetchLeadData(leadId: string) {
  try {
    // Replace with your actual API endpoint that connects to Frappe
    const response = await fetch(`/api/leads/${leadId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch lead data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching lead data:', error);
    return {}; // Return empty object if fetch fails
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    emailOTP: '',
    mobileOTP: '',
    termsAccepted: false,
    identityVerified: false,
    portfolioCompleted: false,
    skillsSetup: false,
    profileCreated: false,
    skills: [],
    // Business fields
    businessName: '',
    contactPersonName: '',
    businessAddress: '',
    website: '',
    taxId: '',
    industrySector: '',
    organizationSize: '',
    businessDescription: '',
    logo: '',
    socialLinks: '',
    authDocument: '',
    businessProfileCompleted: false,
    documentVerified: false,
    dashboardSetup: false,
  });

  const updateData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  // Handle lead registration links
  useEffect(() => {
    const leadId = searchParams.get('leadId');
    const skipFirstStep = searchParams.get('skipFirstStep');
    const userType = searchParams.get('userType');
    
    if (leadId && skipFirstStep === 'true' && (userType === 'individual' || userType === 'business')) {
      // Set the user type
      updateData({
        userType: userType as 'individual' | 'business',
      });
      
      // Fetch lead data from backend
      fetchLeadData(leadId).then(leadData => {
        if (leadData) {
          // Pre-fill the form with lead data
          updateData({
            email: leadData.email || '',
            // For individual leads
            ...(userType === 'individual' && {
              firstName: leadData.firstName || '',
              lastName: leadData.lastName || '',
              mobile: leadData.mobile || '',
            }),
            // For business leads
            ...(userType === 'business' && {
              businessName: leadData.businessName || '',
              contactPersonName: leadData.contactPersonName || '',
              businessAddress: leadData.businessAddress || '',
            }),
          });
        }
      });
      
      // Skip to the second step (Basic Info)
      setCurrentStep(1);
    }
  }, [searchParams]);

  const steps = onboardingData.userType === 'business' ? businessSteps : individualSteps;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding - redirect to login page
      router.push('/auth/login');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={currentStep === 0 ? () => router.push('/') : prevStep}
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Back</span>
          </button>
          
          <Link href="/" className="flex items-center">
          <div className="bg-white rounded-lg overflow-hidden">
              <Image 
                src="/Images/logo_image.jpg" 
                alt="SkillGlobe Logo" 
                width={150} 
                height={24} 
                priority
                className="mix-blend-multiply"
              />
            </div>
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
              {onboardingData.userType && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {onboardingData.userType === 'business' ? 'Business' : 'Individual'}
                </span>
              )}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <CurrentStepComponent
            data={onboardingData}
            updateData={updateData}
            nextStep={nextStep}
            // prevStep={prevStep}
            // isFirstStep={currentStep === 0}
            // isLastStep={currentStep === steps.length - 1}
          />
        </div>
      </div>
    </div>
  );
}