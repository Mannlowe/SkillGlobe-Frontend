'use client';

import { useState, useEffect } from 'react';
import { Building, MapPin, Globe, FileText, Upload, Users, Briefcase, Save } from 'lucide-react';
import BusinessDashboardHeader from '@/components/dashboard/BusinessDashboardHeader';
import BusinessSidebar from '@/components/dashboard/BusinessSidebar';

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

export default function CompanyProfilePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const [data, setData] = useState<any>({});
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load company profile data from localStorage on component mount
  useEffect(() => {
    const loadCompanyProfile = () => {
      if (typeof window !== 'undefined') {
        const companyProfileStr = localStorage.getItem('companyProfile');
        const userInfoStr = localStorage.getItem('userInfo');
        
        if (companyProfileStr) {
          try {
            const companyProfile = JSON.parse(companyProfileStr);
            setData(companyProfile);
          } catch (error) {
            console.error('Error parsing company profile:', error);
          }
        } else if (userInfoStr) {
          // If no company profile exists, initialize with basic info from user data
          try {
            const userInfo = JSON.parse(userInfoStr);
            setData({
              companyName: userInfo.company || '',
            });
          } catch (error) {
            console.error('Error parsing user info:', error);
          }
        }
      }
    };
    
    loadCompanyProfile();
  }, []);

  const updateData = (newData: any) => {
    setData((prevData: any) => ({
      ...prevData,
      ...newData
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!data.companyName?.trim()) newErrors.companyName = 'Company name is required';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSaving(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Save to localStorage for demo purposes
        localStorage.setItem('companyProfile', JSON.stringify(data));
        
        // Update success state
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (error) {
        console.error('Error saving company profile:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <BusinessSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 transition-all duration-300" style={{ marginLeft: isMenuOpen ? '0' : '' }}>
        <BusinessDashboardHeader 
          title="Company Profile" 
          onMenuClick={() => setIsMenuOpen(!isMenuOpen)} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Company Profile
                </h1>
                <p className="text-gray-600">
                  Manage your company&apos;s information and presence on SkillGlobe
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Grid layout for form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={data.companyName || ''}
                        onChange={(e) => updateData({ companyName: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                          errors.companyName ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="Your company name"
                      />
                    </div>
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
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
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
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
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                          errors.taxId ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="Enter your business tax ID"
                      />
                    </div>
                    {errors.taxId && <p className="text-red-500 text-xs mt-1">{errors.taxId}</p>}
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
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      placeholder="LinkedIn, Facebook, etc."
                    />
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
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none ${
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
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all appearance-none ${
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
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none ${
                          errors.businessAddress ? 'ring-2 ring-red-500' : ''
                        }`}
                        placeholder="Official office or operational address"
                        rows={2}
                      />
                    </div>
                    {errors.businessAddress && <p className="text-red-500 text-xs mt-1">{errors.businessAddress}</p>}
                  </div>

                  {/* Business Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Description (Optional)
                    </label>
                    <textarea
                      value={data.businessDescription || ''}
                      onChange={(e) => updateData({ businessDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
                      placeholder="Short company overview"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Logo Upload - Full width */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Logo (Optional)
                  </label>
                  {!logo && !data.logo ? (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
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
                      <p className="text-sm font-medium text-green-900">✓ {logo?.name || data.logo}</p>
                      <p className="text-xs text-green-700">Logo uploaded successfully</p>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                

                {/* Save Button */}
                <div className="pt-4 flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-60 flex items-center justify-center bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-600 transition-all duration-300 ${
                      isSaving ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2" size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  {/* Success Message */}
                  {saveSuccess && (
                    <div className="mt-3 bg-green-50 text-green-800 text-sm p-3 rounded-lg border border-green-200 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Company profile updated successfully!
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
