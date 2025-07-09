'use client';

import { useState } from 'react';
import { Building, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface BusinessBasicInformationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function BusinessBasicInformation({ data, updateData, nextStep }: BusinessBasicInformationProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!data.businessName?.trim()) newErrors.businessName = 'Business name is required';
    if (data.businessName?.trim().length < 2) newErrors.businessName = 'Business name must be at least 2 characters';
    
    if (!data.contactPersonName?.trim()) newErrors.contactPersonName = 'Contact person name is required';
    if (!/^[a-zA-Z\s]+$/.test(data.contactPersonName || '')) newErrors.contactPersonName = 'Only alphabetical characters allowed';
    
    if (!data.email?.trim()) newErrors.email = 'Official email is required';
    if (!data.mobile?.trim()) newErrors.mobile = 'Mobile number is required';
    if (!data.password) newErrors.password = 'Password is required';
    if (data.password !== data.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    // Business email validation (must have business domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (data.email && (data.email.includes('@gmail.com') || data.email.includes('@yahoo.com') || data.email.includes('@hotmail.com'))) {
      newErrors.email = 'Please use a business domain email (e.g., @yourcompany.com)';
    }

    // Mobile validation
    if (!data.mobile) {
      newErrors.mobile = 'Mobile number is required';
    }

    // Password validation
    if (data.password && data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (data.password && !/(?=.*\d)(?=.*[!@#$%^&*])/.test(data.password)) {
      newErrors.password = 'Password must include a number and special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="text-blue-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Business Information
        </h1>
        <p className="text-gray-600">
          Tell us about your organization to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={data.businessName || ''}
              onChange={(e) => updateData({ businessName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.businessName ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Your Company Name"
            />
          </div>
          {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
        </div>

        {/* Contact Person Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={data.contactPersonName || ''}
              onChange={(e) => updateData({ contactPersonName: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.contactPersonName ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Full Name"
            />
          </div>
          {errors.contactPersonName && <p className="text-red-500 text-xs mt-1">{errors.contactPersonName}</p>}
        </div>

        {/* Official Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Official Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.email ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="admin@yourcompany.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          <p className="text-xs text-gray-500 mt-1">Must be a business domain email</p>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="phone-input-container">
            <PhoneInput
              country={'in'}
              value={data.mobile}
              onChange={(phone) => updateData({ mobile: phone })}
              inputClass={`w-full py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.mobile ? 'ring-2 ring-red-500' : ''
              }`}
              containerClass="phone-input-container"
              buttonClass="phone-input-button"
              dropdownClass="phone-input-dropdown"
              enableSearch={true}
              disableSearchIcon={false}
              searchPlaceholder="Search country..."
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: false
              }}
            />
          </div>
          {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password || ''}
              onChange={(e) => updateData({ password: e.target.value })}
              className={`w-full pl-10 pr-12 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.password ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters, include number and special character</p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={data.confirmPassword || ''}
              onChange={(e) => updateData({ confirmPassword: e.target.value })}
              className={`w-full pl-10 pr-12 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.confirmPassword ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
        >
          Continue
        </button>
      </form>
    </div>
  );
}