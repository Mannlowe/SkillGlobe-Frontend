'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function OTPVerification({ data, updateData, nextStep }: OTPVerificationProps) {
  const [emailTimer, setEmailTimer] = useState(60);
  const [mobileTimer, setMobileTimer] = useState(60);
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [canResendMobile, setCanResendMobile] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleResendEmail = () => {
    setEmailTimer(60);
    setCanResendEmail(false);
    // Simulate sending OTP
  };

  const handleResendMobile = () => {
    setMobileTimer(60);
    setCanResendMobile(false);
    // Simulate sending OTP
  };

  const handleVerify = async () => {
    if (!data.emailOTP || !data.mobileOTP) {
      alert('Please enter both OTP codes');
      return;
    }

    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      nextStep();
    }, 2000);
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
              <h3 className="font-semibold text-gray-900">Email Verification</h3>
              <p className="text-sm text-gray-600">{data.email}</p>
            </div>
          </div>
          
          <input
            type="text"
            value={data.emailOTP}
            onChange={(e) => updateData({ emailOTP: e.target.value })}
            className="w-full p-3 bg-gray-50 font-rubik rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-center text-lg font-mono"
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {emailTimer > 0 ? `Resend in ${emailTimer}s` : 'Code expired'}
            </span>
            <button
              onClick={handleResendEmail}
              disabled={!canResendEmail}
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
              <h3 className="font-semibold text-gray-900">Mobile Verification</h3>
              <p className="text-sm text-gray-600">{data.mobile}</p>
            </div>
          </div>
          
          <input
            type="text"
            value={data.mobileOTP}
            onChange={(e) => updateData({ mobileOTP: e.target.value })}
            className="w-full p-3 bg-gray-50 font-rubik rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-center text-lg font-mono"
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-500">
              {mobileTimer > 0 ? `Resend in ${mobileTimer}s` : 'Code expired'}
            </span>
            <button
              onClick={handleResendMobile}
              disabled={!canResendMobile}
              className="text-sm text-orange-600 hover:text-orange-700 disabled:text-gray-400 flex items-center"
            >
              <RefreshCw size={14} className="mr-1" />
              Resend
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleVerify}
        disabled={isVerifying || !data.emailOTP || !data.mobileOTP}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isVerifying ? (
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