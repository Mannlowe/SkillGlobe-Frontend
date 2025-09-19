'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useRegistrationStore } from '@/store/registration';

interface BasicInformationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function BasicInformation({ data, updateData, nextStep }: BasicInformationProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    mobile: false,
    password: false,
    confirmPassword: false
  });

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          }
        }
        break;
      case 'mobile':
        if (!value.trim()) {
          error = 'Mobile number is required';
        } else {
          const mobileRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
          if (!mobileRegex.test(value)) {
            error = 'Please enter a valid mobile number';
          }
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        }
        break;
      case 'confirmPassword':
        if (value !== data.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleFieldChange = (name: string, value: string) => {
    updateData({ [name]: value });

    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors((prev: any) => ({
        ...prev,
        [name]: fieldError
      }));

      // Special case for password and confirmPassword
      if (name === 'password' && touched.confirmPassword) {
        const confirmError = data.confirmPassword !== value ? 'Passwords do not match' : '';
        setErrors((prev: any) => ({
          ...prev,
          confirmPassword: confirmError
        }));
      }
    }
  };

  const handleFieldBlur = (name: string) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const fieldError = validateField(name, data[name]);
    setErrors((prev: any) => ({
      ...prev,
      [name]: fieldError
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    // Mark all fields as touched
    const allTouched = Object.keys(touched).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);

    setTouched(allTouched);

    // Validate all fields
    Object.keys(touched).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get registration store state and actions
  const { updatePersonalDetails, clearError, isLoading, error: apiError, request_id } = useRegistrationStore();

  // Clear any previous errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Check if request_id exists
        if (!request_id) {
          setErrors((prev: Record<string, string>) => ({
            ...prev,
            form: 'Please go back and select your user type first.'
          }));
          return;
        }

        // Call API to update personal details
        await updatePersonalDetails(
          data.firstName,
          data.lastName,
          data.email,
          data.mobile,
          data.password
        );

        // Proceed to next step on success
        nextStep();
      } catch (error) {
        console.error('Error updating personal details:', error);
        // Error is handled by the store
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Basic Information
        </h1>
        <p className="text-gray-600">
          Tell us a bit about yourself to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={data.firstName}
                onChange={(e) => handleFieldChange('firstName', e.target.value)}
                onBlur={() => handleFieldBlur('firstName')}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.firstName ? 'ring-2 ring-red-500' : ''
                  }`}
                placeholder="First name"
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={data.lastName}
                onChange={(e) => handleFieldChange('lastName', e.target.value)}
                onBlur={() => handleFieldBlur('lastName')}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.lastName ? 'ring-2 ring-red-500' : ''
                  }`}
                placeholder="Last name"
              />
            </div>
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.email ? 'ring-2 ring-red-500' : ''
                }`}
              placeholder="your@email.com"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <div className="phone-input-container">
            <PhoneInput
              country={'in'}
              value={data.mobile}
              onChange={(phone) => {
                const digitsOnly = phone.replace(/\D/g, '');

                // Limit to 12 digits
                if (digitsOnly.length <= 12) {
                  updateData({ mobile: digitsOnly });

                  // Live validation
                  if (!digitsOnly) {
                    setErrors((prev: any) => ({ ...prev, mobile: 'Mobile number is required' }));
                  } else if (digitsOnly.length !== 12) {
                    setErrors((prev: any) => ({ ...prev, mobile: 'Mobile number must be exactly 10 digits' }));
                  } else {
                    setErrors((prev: any) => ({ ...prev, mobile: '' }));
                  }
                }
              }}
              inputClass={`w-full py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.mobile ? 'ring-2 ring-red-500' : ''
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
              value={data.password}
              onChange={(e) => handleFieldChange('password', e.target.value)}
              onBlur={() => handleFieldBlur('password')}
              className={`w-full pl-10 pr-12 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.password ? 'ring-2 ring-red-500' : ''
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
              value={data.confirmPassword}
              onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
              onBlur={() => handleFieldBlur('confirmPassword')}
              className={`w-full pl-10 pr-12 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''
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

        {(apiError || errors.form) && (
          <div className="text-center text-sm text-red-500 p-2 bg-red-50 rounded-md">
            {apiError || errors.form}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70"
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </form>
    </div>
  );
}