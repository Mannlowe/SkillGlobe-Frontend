'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import PasswordResetSuccessModal from '@/components/modal/PasswordResetSuccessModal';
import { useForgetPasswordStore } from '@/store/registration/forgetpasswordStore';

export const ForgetPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [localError, setError] = useState('');
  const [isLocalLoading, setIsLoading] = useState(false);
  
  // Use the forget password store
  const { 
    isLoading: storeIsLoading, 
    error: storeError, 
    sendResetPasswordEmail,
    verifyOtp,
    resetUserPassword,
    otpId,
    otpVerified,
    passwordReset,
    resetState 
  } = useForgetPasswordStore();

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the API to send reset password email
      console.log('Sending reset password email to:', email);
      
      const result = await sendResetPasswordEmail(email);
      
      if (result.success) {
        console.log('Reset password email sent successfully, OTP ID:', result.otpId);
        // Move to the next step
        setStep(2);
      } else {
        console.error('Failed to send reset password email');
      }
    } catch (err) {
      console.error('Error sending reset password email:', err);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call the API to verify the OTP
      const otpValue = otp.join('');
      console.log('Verifying OTP:', otpValue);
      
      // Call the verify OTP function from the store
      const result = await verifyOtp(otpValue);
      
      if (result.success) {
        console.log('OTP verified successfully');
        // Move to the next step
        setStep(3);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Call the API to reset the password
      console.log('Resetting password for email:', email);
      
      // Call the reset password function from the store
      const result = await resetUserPassword(password);
      
      if (result.success) {
        console.log('Password reset successfully');
        // Show success modal
        setShowSuccessModal(true);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle OTP input keydown
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle done button click in success modal
  const handleDoneClick = () => {
    setShowSuccessModal(false);
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-rubik">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <Image 
                src="/Images/logo_image.jpg" 
                alt="SkillGlobe Logo" 
                width={220} 
                height={30} 
                priority
                className="mix-blend-multiply"
              />
            </div>
          </Link>
        </div>
        
        {/* Back button */}
        <div className="mt-6 flex justify-center">
          <Link href="/auth/login" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} className="mr-1" />
            Back to login
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <div>
              <h2 className="text-center text-2xl font-bold text-[#007BCA] mb-2">Mail Address Here</h2>
              <p className="text-center text-gray-400 mb-6">
                Enter the email address associated with your account.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="johndoe@gmail.com"
                    />
                  </div>
                </div>

                {(localError || storeError) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {localError || storeError}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={storeIsLoading || isLocalLoading}
                    className=" w-44 flex justify-center py-3 px-4 border border-orange-600 text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    onClick={handleEmailSubmit}
                  >
                    {(storeIsLoading || isLocalLoading) ? (
                      <div className="w-5 h-5 border-2 border-orange-600 border-t-orange-600 rounded-full animate-spin"></div>
                    ) : (
                      'Recover Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div>
              <h2 className="text-center text-2xl font-bold text-[#007BCA] mb-2">Get Your Code</h2>
              <p className="text-center text-gray-400 mb-6">
                Please enter the 4 digit code that we sent to your email address.
              </p>
              
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <div className="flex justify-center space-x-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                    ))}
                  </div>
                  {/* <div className="mt-4 text-center">
                    <button
                      type="button"
                      className="text-sm text-purple-700 hover:text-purple-800"
                      onClick={() => {
                      
                        console.log('Resending OTP to email:', email);
                      }}
                    >
                      If you don&apos;t receive code: Resend
                    </button>
                  </div> */}
                </div>

                {(localError || storeError) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {localError || storeError}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLocalLoading || otp.some(digit => !digit)}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLocalLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Verify and Proceed'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div>
              <h2 className="text-center text-2xl font-bold text-[#007BCA] mb-2">Enter New Password</h2>
              <p className="text-center text-gray-400 mb-6">
                Your new password must be different from previously used password.
              </p>
              
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {(localError || storeError) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {localError || storeError}
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLocalLoading || !password || !confirmPassword}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {isLocalLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Continue'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <PasswordResetSuccessModal
          isOpen={showSuccessModal}
          onClose={handleDoneClick}
        />
      )}
    </div>
  );
};