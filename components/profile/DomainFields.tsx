import React, { useState } from 'react';
import { ProfileEntry } from './ProfileForm';

interface DomainFieldsProps {
  profileType: string;
  editingEntry: ProfileEntry | null;
  setEditingEntry: (entry: ProfileEntry | null) => void;
}

const DomainFields: React.FC<DomainFieldsProps> = ({ profileType, editingEntry, setEditingEntry }) => {
  // State for managing dropdown visibility
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // Field options for different domains
  const itSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Angular', 'Vue.js', 'PHP', 'C#', 'Ruby', 'Go', 'TypeScript'];
  const itSecondarySkills = ['QA Testing', 'DevOps', 'AWS', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'MongoDB', 'PostgreSQL'];
  const itCertifications = ['AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'PMP', 'Scrum Master', 'Oracle Certified', 'Microsoft Certified'];
  const noticePeriods = ['Immediate', '15 Days', '30 Days', '60 Days'];

  const manufacturingSkills = ['CNC Programming', 'AutoCAD', 'SolidWorks', 'PLC Programming', 'CAM', 'Machining', 'Quality Control', 'Production Planning'];
  const manufacturingIndustries = ['Automotive', 'Aerospace', 'Heavy Machinery', 'Electronics', 'Textiles', 'Pharmaceuticals'];
  const manufacturingCertifications = ['Six Sigma', 'ISO 9001', 'OSHA', 'Lean Manufacturing', 'Kaizen', 'Total Quality Management'];
  const shiftPreferences = ['Day', 'Night', 'Rotating', 'No Preference'];

  const financeSkills = ['GST', 'TDS', 'IFRS', 'MIS Reporting', 'Financial Analysis', 'Budgeting', 'Taxation', 'Auditing'];
  const erpSystems = ['SAP', 'Oracle', 'Tally', 'Zoho', 'QuickBooks', 'NetSuite'];
  const financeCertifications = ['CA', 'CPA', 'CMA', 'CFA', 'FRM', 'ACCA'];
  const financeIndustries = ['Banking', 'Insurance', 'Manufacturing', 'FMCG', 'Healthcare', 'Real Estate'];

  const bankingDomains = ['Retail Banking', 'Corporate Banking', 'Investment Banking', 'Treasury', 'Risk Management', 'Credit'];
  const bankingCertifications = ['NISM', 'IRDA', 'CFA', 'FRM', 'CAIIB', 'JAIIB'];
  const complianceKnowledge = ['KYC', 'AML', 'Basel III', 'RBI Guidelines', 'SEBI Regulations', 'FEMA'];
  const coreBankingSoftware = ['Finacle', 'T24', 'Flexcube', 'BaNCS', 'Silverlake', 'Profile'];
  const regulatoryExperience = ['RBI', 'SEBI', 'IRDA', 'NABARD', 'SIDBI', 'EXIM Bank'];

  const hospitalityDepartments = ['Front Office', 'Food & Beverage', 'Housekeeping', 'Kitchen', 'Sales & Marketing', 'HR'];
  const hospitalitySkills = ['Guest Relations', 'Reservation Systems', 'Culinary Arts', 'Event Management', 'Revenue Management', 'Hospitality Software'];
  const languages = ['English', 'Hindi', 'French', 'Spanish', 'German', 'Mandarin', 'Arabic', 'Japanese'];
  const hospitalityCertifications = ['HACCP', 'Food Safety', 'Hospitality Management', 'Sommelier', 'Culinary Arts', 'Hotel Management'];
  const propertyTypes = ['Hotel', 'Resort', 'Restaurant', 'Cruise', 'Airlines', 'Event Management', 'Catering'];

  const handleFieldChange = (fieldName: string, value: any) => {
    if (editingEntry) {
      setEditingEntry({
        ...editingEntry,
        [fieldName]: value
      });
    }
  };

  const handleMultiSelectChange = (fieldName: string, option: string) => {
    if (!editingEntry) return;
    
    const currentValues = (editingEntry as any)[fieldName] || [];
    const updatedValues = currentValues.includes(option)
      ? currentValues.filter((item: string) => item !== option)
      : [...currentValues, option];
    
    handleFieldChange(fieldName, updatedValues);
  };

  const toggleDropdown = (fieldName: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderMultiSelect = (fieldName: string, options: string[], label: string, mandatory: boolean = false) => {
    const selectedValues = (editingEntry as any)?.[fieldName] || [];
    const isOpen = openDropdowns[fieldName] || false;
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
        <div className="flex space-x-4">
          <div className="w-1/2 relative">
            <div 
              className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all flex justify-between items-center cursor-pointer"
              onClick={() => toggleDropdown(fieldName)}
            >
              <span className={selectedValues.length === 0 ? "text-gray-500" : ""}>
                {selectedValues.length === 0 ? `Select ${label.toLowerCase()}` : `${selectedValues.length} ${label.toLowerCase()} selected`}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            {isOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleMultiSelectChange(fieldName, option)}
                  >
                    <span className="text-sm">{option}</span>
                    {selectedValues.includes(option) && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-1/2 bg-gray-50 border border-gray-200 rounded-lg p-2 min-h-[42px] max-h-[150px] overflow-y-auto">
            {selectedValues && selectedValues.length > 0 ? (
              selectedValues.map((value: string) => (
                <div key={value} className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                  {value}
                  <button 
                    type="button"
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={() => handleMultiSelectChange(fieldName, value)}
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No {label.toLowerCase()} selected</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSelect = (fieldName: string, options: string[], label: string, mandatory: boolean = false) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
        <select
          value={(editingEntry as any)?.[fieldName] || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  };

  const renderTextInput = (fieldName: string, label: string, type: string = 'text', mandatory: boolean = false) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          value={(editingEntry as any)?.[fieldName] || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      </div>
    );
  };

  const renderDomainFields = () => {
    switch (profileType) {
      case 'IT':
        return (
          <div className="space-y-4">
            {renderMultiSelect('itCertifications', itCertifications, 'Certifications')}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub / Portfolio
                </label>
                <input
                  type="url"
                  value={(editingEntry as any)?.githubPortfolio || ''}
                  onChange={(e) => handleFieldChange('githubPortfolio', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter github / portfolio"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notice Period
                </label>
                <select
                  value={(editingEntry as any)?.noticePeriod || ''}
                  onChange={(e) => handleFieldChange('noticePeriod', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Notice Period</option>
                  {noticePeriods.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 'Manufacturing':
        return (
          <div className="space-y-4">
            {renderMultiSelect('industryExperience', manufacturingIndustries, 'Industry Experience')}
            {renderTextInput('machineHandling', 'Machine Handling')}
            {renderMultiSelect('manufacturingCertifications', manufacturingCertifications, 'Certifications')}
            {renderSelect('willingToRelocate', ['Yes', 'No'], 'Willing to Relocate')}
            {renderSelect('shiftPreference', shiftPreferences, 'Shift Preference')}
          </div>
        );

      case 'Finance':
        return (
          <div className="space-y-4">
            {renderMultiSelect('erpExperience', erpSystems, 'ERP Experience')}
            {renderMultiSelect('financeCertifications', financeCertifications, 'Certifications')}
            {renderTextInput('yearsInIndustry', 'Years in Industry', 'number')}
            {renderMultiSelect('preferredIndustry', financeIndustries, 'Preferred Industry')}
          </div>
        );

      case 'Banking':
        return (
          <div className="space-y-4">
            {renderMultiSelect('bankingDomain', bankingDomains, 'Banking Domain', true)}
            {renderMultiSelect('bankingCertifications', bankingCertifications, 'Certifications')}
            {renderMultiSelect('complianceKnowledge', complianceKnowledge, 'Compliance Knowledge')}
            {renderMultiSelect('coreBankingSoftware', coreBankingSoftware, 'Core Banking Software')}
            {renderMultiSelect('regulatoryExperience', regulatoryExperience, 'Regulatory Experience')}
          </div>
        );

      case 'Hospitality':
        return (
          <div className="space-y-4">
            {renderSelect('hospitalityDepartment', hospitalityDepartments, 'Department', true)}
            {renderMultiSelect('hospitalitySkills', hospitalitySkills, 'Skills')}
            {renderMultiSelect('languagesKnown', languages, 'Languages Known')}
            {renderMultiSelect('hospitalityCertifications', hospitalityCertifications, 'Certifications')}
            {renderMultiSelect('propertyType', propertyTypes, 'Property Type')}
            {renderSelect('willingToRelocate', ['Yes', 'No'], 'Willing to Relocate')}
          </div>
        );

      default:
        return null;
    }
  };

  if (profileType === 'Others') {
    return null;
  }

  return (
    <div className="mt-6">
      {/* Divider */}
      <div className="border-t border-gray-200 my-6"></div>
      
      {/* Domain-Specific Fields Header */}
      <h4 className="text-lg font-medium text-gray-900 mb-4">
        Domain-Specific Fields ({profileType})
      </h4>
      
      {/* Domain Fields */}
      {renderDomainFields()}
    </div>
  );
};

export default DomainFields;