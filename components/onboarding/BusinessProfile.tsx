'use client';

import { useState } from 'react';
import { Building, MapPin, Globe, FileText, Upload, Users, Briefcase } from 'lucide-react';

interface BusinessProfileProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

const industrySectors = [
  'Technology',
  'Healthcare',
  'Education',
  'Finance',
  'Manufacturing',
  'Retail',
  'Consulting',
  'Media & Entertainment',
  'Real Estate',
  'Non-Profit',
  'Government',
  'Other'
];

const organizationSizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-1000 employees',
  '1000+ employees'
];

export default function BusinessProfile({ data, updateData, nextStep }: BusinessProfileProps) {
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!data.businessAddress?.trim()) newErrors.businessAddress = 'Business address is required';
    if (!data.industrySector) newErrors.industrySector = 'Industry sector is required';
    if (!data.organizationSize) newErrors.organizationSize = 'Organization size is required';

    // Website URL validation (if provided)
    if (data.website && !/^https?:\/\/.+\..+/.test(data.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }

    // Tax ID validation (if provided)
    if (data.taxId && !/^[A-Z0-9]{10,15}$/.test(data.taxId.replace(/\s/g, ''))) {
      newErrors.taxId = 'Please enter a valid Tax ID format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Logo file size must be less than 2MB');
        return;
      }
      setLogo(file);
      updateData({ logo: file.name });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateData({ businessProfileCompleted: true });
      nextStep();
    }
  };

  const handleSkip = () => {
    updateData({ businessProfileCompleted: false });
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="text-purple-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Business Profile
        </h1>
        <p className="text-gray-600">
          Provide additional details to enhance your business presence
        </p>
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
          Optional - Complete later
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              value={data.businessAddress || ''}
              onChange={(e) => updateData({ businessAddress: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-none ${
                errors.businessAddress ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Official office or operational address"
              rows={2}
            />
          </div>
          {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website (Optional)
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="url"
              value={data.website || ''}
              onChange={(e) => updateData({ website: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.website ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="https://yourcompany.com"
            />
          </div>
          {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
        </div>

        {/* Tax ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tax ID / PAN / GSTIN (Optional)
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={data.taxId || ''}
              onChange={(e) => updateData({ taxId: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all ${
                errors.taxId ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Enter Tax ID for verification"
            />
          </div>
          {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
          <p className="text-xs text-gray-500 mt-1">Required for document verification</p>
        </div>

        {/* Industry Sector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry Sector <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={data.industrySector || ''}
              onChange={(e) => updateData({ industrySector: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none ${
                errors.industrySector ? 'ring-2 ring-red-500' : ''
              }`}
            >
              <option value="">Select industry sector</option>
              {industrySectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>
          {errors.industrySector && <p className="text-red-500 text-xs mt-1">{errors.industrySector}</p>}
        </div>

        {/* Organization Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Organization Size <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={data.organizationSize || ''}
              onChange={(e) => updateData({ organizationSize: e.target.value })}
              className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all appearance-none ${
                errors.organizationSize ? 'ring-2 ring-red-500' : ''
              }`}
            >
              <option value="">Select organization size</option>
              {organizationSizes.map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          {errors.organizationSize && <p className="text-red-500 text-xs mt-1">{errors.organizationSize}</p>}
        </div>

        {/* Business Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Description (Optional)
          </label>
          <textarea
            value={data.businessDescription || ''}
            onChange={(e) => updateData({ businessDescription: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all resize-none"
            placeholder="Short company overview"
            rows={3}
          />
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Logo (Optional)
          </label>
          {!logo ? (
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-2" size={20} />
                <p className="text-sm font-medium text-gray-900">Upload company logo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG (max 2MB)</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="bg-green-50 p-3 rounded-xl border border-green-200">
              <p className="text-sm font-medium text-green-900">✓ {logo.name}</p>
              <p className="text-xs text-green-700">Logo uploaded successfully</p>
            </div>
          )}
        </div>

        {/* Social Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Social/External Links (Optional)
          </label>
          <input
            type="url"
            value={data.socialLinks || ''}
            onChange={(e) => updateData({ socialLinks: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            placeholder="LinkedIn, Facebook, etc."
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
          >
            Skip for Now
          </button>
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}