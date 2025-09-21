'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, RefreshCw } from 'lucide-react';
import { useRegistrationStore } from '@/store/registration';
import { useBusinessRegistrationStore } from '@/store/businessRegistrationStore';

interface OTPVerificationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
  userType?: string;
}

export default function OTPVerification({ data, updateData, nextStep, userType }: OTPVerificationProps) {
  const [emailTimer, setEmailTimer] = useState(90);
  const [mobileTimer, setMobileTimer] = useState(90);
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [canResendMobile, setCanResendMobile] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes} min ${seconds < 10 ? '0' : ''}${seconds} sec`;
  };

  // Get registration store state and actions based on user type
  const individualStore = useRegistrationStore();
  const businessStore = useBusinessRegistrationStore();
  
  const isBusinessRegistration = userType === 'business';
  
  // Use appropriate store based on registration type
  const {
    verifyOtpCodes,
    resendEmailOtp,
    resendPhoneOtp,
    clearError,
    isLoading,
    error: apiError,
    request_id
  } = isBusinessRegistration ? {
    verifyOtpCodes: individualStore.verifyOtpCodes, // Business uses same verification logic
    resendEmailOtp: businessStore.resendEmailOtp,
    resendPhoneOtp: businessStore.resendPhoneOtp,
    clearError: businessStore.clearError,
    isLoading: businessStore.isLoading,
    error: businessStore.error,
    request_id: individualStore.request_id // Business uses same request_id from individual store
  } : individualStore;

  // Clear any previous errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    // Email timer
    if (emailTimer > 0) {
      const timer = setTimeout(() => setEmailTimer(emailTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendEmail(true);
    }
  }, [emailTimer]);

  useEffect(() => {
    // Mobile timer
    if (mobileTimer > 0) {
      const timer = setTimeout(() => setMobileTimer(mobileTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResendMobile(true);
    }
  }, [mobileTimer]);

  const handleResendEmail = async () => {
    try {
      setEmailTimer(60);
      setCanResendEmail(false);
      setErrors({});
      
      // Call API to resend email OTP
      await resendEmailOtp();
      
      // Show success message or handle success
      console.log('Email OTP resent successfully');
    } catch (error) {
      console.error('Error resending email OTP:', error);
      // Reset timer on error so user can try again
      setEmailTimer(0);
      setCanResendEmail(true);
    }
  };

  const handleResendMobile = async () => {
    try {
      setMobileTimer(60);
      setCanResendMobile(false);
      setErrors({});
      
      // Call API to resend mobile OTP
      await resendPhoneOtp();
      
      // Show success message or handle success
      console.log('Mobile OTP resent successfully');
    } catch (error) {
      console.error('Error resending mobile OTP:', error);
      // Reset timer on error so user can try again
      setMobileTimer(0);
      setCanResendMobile(true);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!data.emailOTP) {
      newErrors.emailOTP = 'Email verification code is required';
    } else if (data.emailOTP.length !== 6) {
      newErrors.emailOTP = 'Email verification code must be 6 digits';
    }

    if (!data.mobileOTP) {
      newErrors.mobileOTP = 'Mobile verification code is required';
    } else if (data.mobileOTP.length !== 6) {
      newErrors.mobileOTP = 'Mobile verification code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if request_id exists
    if (!request_id) {
      setErrors({
        form: 'Registration ID not found. Please start registration first.'
      });
      return;
    }

    try {
      // Call API to verify OTP codes
      await verifyOtpCodes(
        data.emailOTP,
        data.mobileOTP
      );

      // Proceed to next step on success
      nextStep();
    } catch (error) {
      console.error('Error verifying OTP codes:', error);
      // Error is handled by the store
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Details
        </h1>
        <p className="text-gray-600">
          We&apos;ve sent verification codes to secure your account
        </p>
      </div>

      <div className="space-y-4">
        {/* Email OTP */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Email Verification <span className="text-red-500">*</span></h3>
              <p className="text-sm text-gray-600">{data.email}</p>
            </div>
          </div>

          <input
            type="text"
            value={data.emailOTP}
            onChange={(e) => updateData({ emailOTP: e.target.value })}
            className={`w-full p-3 bg-gray-50 font-rubik rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-center text-lg font-mono ${errors.emailOTP ? 'ring-2 ring-red-500' : ''}`}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          {errors.emailOTP && <p className="text-red-500 text-xs mt-1">{errors.emailOTP}</p>}

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {emailTimer > 0 ? `Expires in ${formatTime(emailTimer)}` : 'Did not receive OTP?'}
            </span>

            <button
              onClick={handleResendEmail}
              disabled={!canResendEmail || isLoading}
              className="text-sm text-orange-600 hover:text-orange-700 disabled:text-gray-400 flex items-center"
            >
              <RefreshCw size={14} className="mr-1" />
              Resend
            </button>
          </div>
        </div>

        {/* Mobile OTP */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Phone className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mobile Verification <span className="text-red-500">*</span></h3>
              <p className="text-sm text-gray-600">{data.mobile}</p>
            </div>
          </div>

          <input
            type="text"
            value={data.mobileOTP}
            onChange={(e) => updateData({ mobileOTP: e.target.value })}
            className={`w-full p-3 bg-gray-50 font-rubik rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-center text-lg font-mono ${errors.mobileOTP ? 'ring-2 ring-red-500' : ''}`}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          {errors.mobileOTP && <p className="text-red-500 text-xs mt-1">{errors.mobileOTP}</p>}

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
            {mobileTimer > 0 ? `Expires in ${formatTime(mobileTimer)}` : 'Did not receive OTP?'}
            </span>
            <button
              onClick={handleResendMobile}
              disabled={!canResendMobile || isLoading}
              className="text-sm text-orange-600 hover:text-orange-700 disabled:text-gray-400 flex items-center"
            >
              <RefreshCw size={14} className="mr-1" />
              Resend
            </button>
          </div>
        </div>
      </div>

      {(apiError || errors.form) && (
        <div className="text-center text-sm text-red-500 p-2 bg-red-50 rounded-md">
          {apiError || errors.form}
        </div>
      )}

      <button
        onClick={handleVerify}
        disabled={isLoading || !data.emailOTP || !data.mobileOTP}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          'Verify & Continue'
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        Didn&apos;t receive the codes? Check your spam folder or try resending
      </div>
    </div>
  );
}