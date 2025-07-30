'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Globe, Upload, AtSign, Phone, User, Landmark, Locate, Briefcase, FileText, Check } from 'lucide-react';
import Image from 'next/image';
import { usePersonalInfoStore } from '@/store/portfolio/personalinfoStore';
import { PersonalInfoData } from '@/app/api/portfolio/personalInfo';

interface PersonalInfoFormProps {
  onSave?: (data: any) => void;
  onCancel?: () => void;
  initialData?: any;
}

export default function PersonalInfoForm({ onSave, onCancel, initialData = {} }: PersonalInfoFormProps) {
  // Get store state and actions
  const { 
    personalInfo, 
    isLoading, 
    isSubmitting, 
    error, 
    submitError, 
    fetchPersonalInfo, 
    updatePersonalInfo 
  } = usePersonalInfoStore();
  
  // Success state for UI feedback
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    permanentPincode: '',
    pincode: '',
    // ...other errors if needed
  });
  
  // Fetch personal info on component mount
  useEffect(() => {
    fetchPersonalInfo();
  }, [fetchPersonalInfo]);
  
  // Update form data when personalInfo is loaded from API
  useEffect(() => {
    if (personalInfo) {
      setFormData({
        fullName: `${personalInfo.first_name} ${personalInfo.last_name}`.trim(),
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        gender: personalInfo.gender || '',
        dateOfBirth: personalInfo.date_of_birth || '',
        nationality: personalInfo.nationality || '',
        country: personalInfo.country || '',
        city: personalInfo.city || '',
        landmark: personalInfo.landmark || '',
        pincode: personalInfo.pincode || '',
        currentAddress: personalInfo.current_address || '',
        permanentAddress: personalInfo.permanent_address || '',
        permanentCountry: personalInfo.country || '',
        permanentCity: personalInfo.city || '',
        permanentLandmark: personalInfo.landmark || '',
        permanentPincode: personalInfo.pincode || '',
        sameAsCurrentAddress: personalInfo.permanent_address === personalInfo.current_address,
        twitterHandle: personalInfo.twitter_handle || '',
        linkedinHandle: personalInfo.linkedin_profile || '',
        instagramHandle: personalInfo.instagram_handle || '',
        facebookHandle: personalInfo.facebook_profile || '',
        employmentStatus: personalInfo.employment_status || '',
        profilePicture: null,
        website: personalInfo.website || '',
        totalExperience: personalInfo.total_experience || '',
        noticePeriod: personalInfo.notice_period || '',
        professionalSummary: personalInfo.professional_summary || '',
      });
    }
  }, [personalInfo]);
  
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    gender: initialData.gender || '',
    dateOfBirth: initialData.dateOfBirth || '',
    nationality: initialData.nationality || '',
    country: initialData.country || '',
    city: initialData.city || '',
    landmark: initialData.landmark || '',
    pincode: initialData.pincode || '',
    currentAddress: initialData.currentAddress || '',
    permanentAddress: initialData.permanentAddress || '',
    permanentCountry: initialData.permanentCountry || '',
    permanentCity: initialData.permanentCity || '',
    permanentLandmark: initialData.permanentLandmark || '',
    permanentPincode: initialData.permanentPincode || '',
    sameAsCurrentAddress: initialData.permanentAddress === initialData.currentAddress,
    twitterHandle: initialData.twitterHandle || '',
    linkedinHandle: initialData.linkedinHandle || '',
    instagramHandle: initialData.instagramHandle || '',
    facebookHandle: initialData.facebookHandle || '',
    employmentStatus: initialData.employmentStatus || '',
    profilePicture: initialData.profilePicture || null,
    website: initialData.website || '',
    totalExperience: initialData.totalExperience || '',
    noticePeriod: initialData.noticePeriod || '',
    professionalSummary: initialData.professionalSummary || '',
  });

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
  
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
        ...(name === 'sameAsCurrentAddress' && checked
          ? { permanentAddress: formData.currentAddress }
          : {})
      }));
    } else {
      if (name === 'permanentPincode' || name === 'pincode') {
        const onlyDigits = value.replace(/\D/g, ''); // Remove non-digit characters
  
        setFormData(prev => ({
          ...prev,
          [name]: onlyDigits
        }));
  
        setErrors(prev => ({
          ...prev,
          [name]: onlyDigits.length > 0 && onlyDigits.length < 6 ? '6 digits required' : ''
        }));
      } else if (name === 'totalExperience') {
        const numericValue = parseFloat(value);
        if (!isNaN(numericValue) && numericValue >= 0) {
          setFormData(prev => ({
            ...prev,
            [name]: value
          }));
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        } else if (value === '') {
          setFormData(prev => ({
            ...prev,
            [name]: ''
          }));
          setErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        } else {
          setErrors(prev => ({
            ...prev,
            [name]: 'Only non-negative numbers allowed'
          }));
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          ...(name === 'currentAddress' && formData.sameAsCurrentAddress
            ? { permanentAddress: value }
            : {})
        }));
  
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }));
      }
    }
  };
  
  

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting personal info form...');
    
    // Reset success state
    setIsSuccess(false);
    
    // Extract first and last name from fullName
    const nameParts = formData.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Prepare data for API
    const personalInfoData: Partial<PersonalInfoData> = {
      first_name: firstName,
      last_name: lastName,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      date_of_birth: formData.dateOfBirth,
      nationality: formData.nationality,
      country: formData.country,
      city: formData.city,
      landmark: formData.landmark,
      pincode: formData.pincode,
      current_address: formData.currentAddress,
      permanent_address: formData.permanentAddress,
      twitter_handle: formData.twitterHandle,
      linkedin_profile: formData.linkedinHandle,
      instagram_handle: formData.instagramHandle,
      facebook_profile: formData.facebookHandle,
      website: formData.website,
      employment_status: formData.employmentStatus,
      total_experience: formData.totalExperience,
      notice_period: formData.noticePeriod,
      professional_summary: formData.professionalSummary
    };
    
    console.log('Personal info data to submit:', personalInfoData);
    
    // Call API through store
    const success = await updatePersonalInfo(personalInfoData);
    
    if (success) {
      console.log('Personal info updated successfully');
      setIsSuccess(true);
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      
      // Call onSave if provided
      if (onSave) {
        onSave(formData);
      }
    } else {
      console.error('Failed to update personal info:', submitError);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>

        {/* Profile Picture Upload */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            {profilePreview ? (
              <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden">
                <Image
                  src={profilePreview}
                  alt="Profile Preview"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <User className="text-gray-400" size={40} />
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
              <Upload size={16} />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                name="profilePicture"
              />
            </label>
          </div>
          <p className="text-sm text-gray-500">Profile Picture</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your.email@example.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+1 (123) 456-7890"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Auto-filled from your account</p>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-4 mt-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Other"
                  checked={formData.gender === 'Other'}
                  onChange={handleInputChange}
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Other</span>
              </label>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nationality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your nationality"
            />
          </div>

          {/* Country */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Address
            </label>
            <textarea
              name="currentAddress"
              value={formData.currentAddress}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your current address"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="IN">India</option>
                <option value="AU">Australia</option>
                {/* Add more countries as needed */}
              </select>
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your city"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landmark
            </label>
            <div className="relative">
              <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your landmark"
              />
            </div>
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Pincode
  </label>
  <div className="relative">
    <Locate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
    <input
      type="text" // Keep as text to prevent issues with leading 0
      name="pincode"
      inputMode="numeric"
      maxLength={6}
      value={formData.pincode}
      onChange={handleInputChange}
      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
        errors.pincode ? 'border-red-500' : 'border-gray-300'
      }`}
      placeholder="Enter your pincode"
    />
  </div>

  {errors.pincode && (
    <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
  )}
</div>


          {/* Same as Current Address Checkbox */}
          <div className="md:col-span-2">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="sameAsCurrentAddress"
                checked={formData.sameAsCurrentAddress}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Permanent address same as current address</span>
            </label>
          </div>

          {/* Permanent Address */}
          {!formData.sameAsCurrentAddress && (
            <>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleInputChange}
                  required
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your permanent address"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    name="permanentCountry"
                    value={formData.permanentCountry}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  >
                    <option value="">Select your country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="IN">India</option>
                    <option value="AU">Australia</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>


              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="permanentCity"
                    value={formData.permanentCity}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Landmark
                </label>
                <div className="relative">
                  <Landmark className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="permanentLandmark"
                    value={formData.permanentLandmark}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your landmark"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PincodeP
                </label>
                <div className="relative">
                  <Locate className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    pattern="\d{6,}"
                    minLength={6}
                    maxLength={6}
                    name="permanentPincode"
                    value={formData.permanentPincode}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your pincode"
                  />
                </div>
                {errors.permanentPincode && (
    <p className="text-red-500 text-sm mt-1">{errors.permanentPincode}</p>
  )}
              </div>
            </>
          )}

        </div>
      </div>

      {/* Social Media - Full Width Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Twitter Handle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter Handle
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                name="twitterHandle"
                value={formData.twitterHandle}
                onChange={handleInputChange}
                className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="username"
              />
            </div>
          </div>

          {/* LinkedIn Handle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn Profile
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">in/</span>
              <input
                type="text"
                name="linkedinHandle"
                value={formData.linkedinHandle}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram Profile
            </label>
            <div className="relative">
              <input
                type="text"
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="https://instagram.com/your_username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook Profile
            </label>
            <div className="relative">
              <input
                type="text"
                name="facebookHandle"
                value={formData.facebookHandle}
                onChange={handleInputChange}
                className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                placeholder="https://facebook.com/your_username"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Employment Status - Separate Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
        <h3 className="font-semibold text-gray-900 mb-4">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Employment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employment Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="employmentStatus"
                value={formData.employmentStatus}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select your employment status</option>
                <option value="Employed">Employed</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://www.example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Experience <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                min={0}
                name="totalExperience"
                value={formData.totalExperience}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 5.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notice Period
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                name="noticePeriod"
                value={formData.noticePeriod}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="">Select notice period</option>
                <option value="Immediate">Immediate</option>
                <option value="15 Days">15 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="60 Days">60 Days</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Professional Summary
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
              <textarea
                rows={1}
                name="professionalSummary"
                value={formData.professionalSummary}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                placeholder="Short paragraph describing experience & strengths"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Error message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{submitError}</p>
        </div>
      )}
      
      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 font-medium rounded-lg transition-colors flex items-center justify-center min-w-[150px] ${isSuccess 
            ? 'bg-green-500 hover:bg-green-600 text-white' 
            : isSubmitting 
              ? 'bg-blue-300 text-white cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          {isSubmitting ? (
            'Saving...' 
          ) : isSuccess ? (
            <>
              <Check className="mr-1" size={18} />
              Saved
            </>
          ) : (
            'Save Information'
          )}
        </button>
      </div>
      
      {/* Loading state for initial data fetch */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium">Loading your information...</p>
          </div>
        </div>
      )}
    </form>
  );
}