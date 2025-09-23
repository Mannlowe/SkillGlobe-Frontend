import React, { useState } from 'react';
import { ProfileEntry as BaseProfileEntry } from './ProfileForm';

// Extend the ProfileEntry interface from ProfileForm to include additional fields
export type ProfileEntry = BaseProfileEntry & {
  // Additional fields not in the base ProfileEntry
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  experience?: string;
  education?: string;
  skills?: string[];
  githubPortfolio?: string;
  noticePeriod?: string;
  itCertifications?: string[];
  [key: string]: any; // Allow for dynamic fields
}

interface DomainFieldsProps {
  profileType: string;
  subDomain?: string;
  editingEntry: ProfileEntry | null;
  setEditingEntry: React.Dispatch<React.SetStateAction<BaseProfileEntry | null>>;
}

// IT Subdomain options - using full names as expected by backend
export const itSubDomains = [
  { value: 'Software Development & Services (IT1)', label: 'Software Development & Services' },
  { value: 'Data & Emerging Tech (IT2)', label: 'Data & Emerging Tech' },
  { value: 'Cybersecurity & Networks (IT3)', label: 'Cybersecurity & Networks' }
];

// Manufacturing Subdomain options - using full names as expected by backend
export const manufacturingSubDomains = [
  { value: 'Production & Operations (MF1)', label: 'Production & Operations' },
  { value: 'Automotive & Engineering (MF2)', label: 'Automotive & Engineering' },
  { value: 'Quality & Maintenance (MF3)', label: 'Quality & Maintenance' },
  { value: 'Supply Chain & Materials (MF4)', label: 'Supply Chain & Materials' }
];

// Banking Subdomain options - using full names as expected by backend
export const bankingSubDomains = [
  { value: 'Banking (BF1)', label: 'Banking' },
  { value: 'Finance & Investments (BF2)', label: 'Finance & Investments' },
  { value: 'Insurance (BF3)', label: 'Insurance' },
  { value: 'FinTech & Payments (BF4)', label: 'FinTech & Payments' }
];

// Hospitality Subdomain options - using full names as expected by backend
export const hospitalitySubDomains = [
  { value: 'Hotels & Lodging (HS1)', label: 'Hotels & Lodging' },
  { value: 'Food & Beverages (HS2)', label: 'Food & Beverages' },
  { value: 'Travel & Tourism (HS3)', label: 'Travel & Tourism' },
  { value: 'Events & Recreation (HS4)', label: 'Events & Recreation' }
];

// Pharma & Healthcare Subdomain options - using full names as expected by backend
export const pharmaSubDomains = [
  { value: 'Pharma Manufacturing & Quality (PH1)', label: 'Pharma Manufacturing & Quality' },
  { value: 'Distribution & Supply Chain (PH2)', label: 'Distribution & Supply Chain' },
  { value: 'Research & Clinical (PH3)', label: 'Research & Clinical' },
  { value: 'Healthcare Services (PH4)', label: 'Healthcare Services' }
];

const DomainFields: React.FC<DomainFieldsProps> = ({ profileType, subDomain, editingEntry, setEditingEntry }) => {
  // State for managing input values for each field separately
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // Type-safe setter function that ensures compatibility between ProfileEntry types
  const updateEditingEntry = (updater: (prev: any) => any) => {
    setEditingEntry(updater);
  };

  // Enhanced multi-value input with Enter key support
  const renderEnhancedMultiValueInput = (
    fieldName: string,
    label: string,
    placeholder: string,
    colorClass: string,
    mandatory: boolean = false
  ) => {
    const inputValue = inputValues[fieldName] || '';

    const addValue = (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue) {
        const currentValues = (editingEntry as any)?.[fieldName] || [];
        if (!currentValues.includes(trimmedValue)) {
          updateEditingEntry(prev => prev ? {
            ...prev,
            [fieldName]: [...currentValues, trimmedValue]
          } : null);
        }
        // Clear the input for this specific field
        setInputValues(prev => ({ ...prev, [fieldName]: '' }));
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addValue(inputValue);
      }
    };

    const handleBlur = () => {
      addValue(inputValue);
    };

    const handleInputChange = (value: string) => {
      console.log(`Updating input for ${fieldName}:`, value); // Debug log
      setInputValues(prev => ({ ...prev, [fieldName]: value }));
    };

    const removeValue = (valueToRemove: string) => {
      const updated = ((editingEntry as any)?.[fieldName] || []).filter((v: string) => v !== valueToRemove);
      updateEditingEntry(prev => prev ? { ...prev, [fieldName]: updated } : null);
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {mandatory && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-4">
          <div className="w-1/2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                console.log(`Input change event for ${fieldName}:`, e.target.value);
                handleInputChange(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={placeholder}
            />
          </div>
          <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
            {((editingEntry as any)?.[fieldName] || []).map((value: any, index: number) => {
              // Handle both old string format and new object format from API
              const displayValue = typeof value === 'string' ? value : (typeof value === 'object' && value ? Object.values(value)[0] : value);
              const keyValue = typeof displayValue === 'string' ? displayValue : `${fieldName}-${index}`;

              return (
                <span key={keyValue} className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${colorClass}`}>
                  {displayValue}
                  <button
                    type="button"
                    onClick={() => removeValue(typeof value === 'string' ? value : displayValue)}
                    className="ml-2 hover:opacity-80"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    );
  };


  // Field options for IT subdomains
  const itFieldOptions = {
    it_dev_method: ['Agile', 'Scrum', 'Waterfall', 'DevOps'],
    it_domain_exp: ['FinTech', 'HealthTech', 'EdTech', 'eCommerce', 'SaaS'],
    it_tools_used: ['Jira', 'Confluence', 'Docker', 'Kubernetes'],
    it_tools: ['Tableau', 'PowerBI', 'Hadoop', 'Spark'],
    it_data_domain_exp: ['Healthcare', 'Finance', 'Retail', 'IoT'],
    it_compliance: ['ISO27001', 'GDPR', 'HIPAA', 'PCI-DSS'],
    it_security_tools: ['SIEM', 'IDS', 'Firewalls', 'Splunk'],
    it_incident_exp: ['SOC', 'Threat Hunting', 'Incident Response'],
    it_security_clearance: ['None', 'Confidential', 'Secret', 'Top Secret'],
    it_network_exp: ['Routing', 'Switching', 'VPNs', 'SD-WAN']
  };

  // Field options for Manufacturing subdomains
  const manufacturingFieldOptions = {
    mf_production_area: ['Assembly', 'Fabrication', 'Packaging', 'Welding'],
    mf_machine_handling: ['CNC', 'Lathe', 'Injection Molding', 'Press Machine'],
    mf_shift_preference: ['Day', 'Night', 'Rotational'],
    mf_safety_cert: ['OSHA', 'Fire Safety', 'PPE', 'ISO 45001'],
    mf_engineering_domain: ['Automotive', 'Aerospace', 'Rail', 'Marine', 'Heavy Machinery'],
    mf_design_tools: ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS'],
    mf_prototyping_exp: ['Rapid Prototyping', '3D Printing'],
    mf_regulatory_knowledge: ['ISO/TS16949', 'AS9100', 'BIS'],
    mf_quality_tools: ['Six Sigma', 'Kaizen', 'Lean', 'CAPA', 'SPC'],
    mf_testing_methods: ['NDT', 'Fatigue Testing', 'Stress Testing'],
    mf_certifications_qm: ['ISO 9001', 'ISO 14001', 'OHSAS'],
    mf_maintenance_exp: ['Preventive', 'Predictive', 'Breakdown'],
    mf_supply_area: ['Procurement', 'Logistics', 'Inventory', 'Vendor Mgmt'],
    mf_material_expertise: ['Steel', 'Plastics', 'Composites', 'Chemicals'],
    mf_tools_used: ['SAP', 'Oracle', 'JD Edwards', 'MS Dynamics'],
    mf_regulatory_compliance: ['REACH', 'RoHS', 'BIS', 'ISO 14001']
  };

  // Field options for Banking subdomains
  const bankingFieldOptions = {
    // Banking (BF1) fields
    bf_banking_domain: ['Retail', 'Corporate', 'Investment', 'Treasury'],
    bf_core_banking_systems: ['Finacle', 'T24', 'Flexcube', 'Finastra'],
    bf_regulatory_exp: ['RBI', 'SEBI', 'FED', 'ECB'],
    bf_compliance_knowledge: ['KYC', 'AML', 'Basel III', 'FATCA'],

    // Finance & Investments (BF2) fields
    bf_finance_area: ['Equity', 'Debt', 'Treasury', 'Risk', 'FP&A'],
    bf_erp_tools: ['SAP FICO', 'Oracle', 'Tally', 'Zoho', 'QuickBooks'],
    bf_reporting_standards: ['IFRS', 'GAAP', 'Ind-AS', 'SOX'],
    bf_industry_experience: ['Banking', 'Insurance', 'FMCG', 'Manufacturing'],

    // Insurance (BF3) fields
    bf_insurance_domain: ['Life', 'Health', 'General', 'Reinsurance'],
    bf_insurance_products: ['ULIP', 'Term Plan', 'Motor', 'Travel'],
    bf_licensing: ['IRDA', 'NISM', 'CPCU'],
    bf_claims_exp: ['Claims Processing', 'Risk Assessment', 'Policy Underwriting'],

    // FinTech & Payments (BF4) fields
    bf_payment_systems: ['UPI', 'SWIFT', 'NEFT/RTGS', 'SEPA', 'ACH'],
    bf_digital_platforms: ['Paytm', 'Razorpay', 'Stripe', 'PayPal'],
    bf_regtech_knowledge: ['AML Tools', 'KYC Platforms', 'Fraud Analytics'],
    bf_security_compliance: ['PCI-DSS', 'ISO 20022', 'GDPR']
  };

  // Field options for Hospitality subdomains
  const hospitalityFieldOptions = {
    // Hotels & Lodging (HS1) fields
    hs_department: ['Front Office', 'Housekeeping', 'Kitchen', 'Concierge'],
    hs_property_type: ['Hotel', 'Resort', 'Hostel', 'Cruise', 'Boutique'],
    hs_guest_mgmt_system: ['Opera PMS', 'IDS', 'Protel', 'eZee FrontDesk'],
    hs_languages_known: ['English', 'Hindi', 'French', 'Spanish', 'Arabic'],

    // Food & Beverages (HS2) fields
    hs_fnb_specialization: ['Culinary', 'Bartending', 'Baking', 'Catering'],
    hs_service_type: ['Casual Dining', 'Fine Dining', 'Quick Service', 'Cloud Kitchen'],
    hs_fnb_certifications: ['HACCP', 'Food Safety', 'Culinary Arts Diploma'],
    hs_beverage_knowledge: ['Wines', 'Cocktails', 'Coffee', 'Tea'],

    // Travel & Tourism (HS3) fields
    hs_travel_domain: ['Airline', 'Cruise', 'Agency', 'Tour Operator'],
    hs_ticketing_systems: ['Amadeus', 'Galileo', 'Sabre', 'Abacus'],
    hs_destination_expertise: ['Europe', 'SE Asia', 'Africa', 'Middle East'],
    hs_customer_type: ['Leisure', 'Corporate', 'MICE', 'Luxury'],

    // Events & Recreation (HS4) fields
    hs_event_type: ['Weddings', 'Conferences', 'Exhibitions', 'Concerts'],
    hs_event_skills: ['Stage Mgmt', 'AV', 'Vendor Coordination', 'Budgeting'],
    hs_ticketing_platforms: ['BookMyShow', 'Eventbrite', 'Ticketmaster'],
    hs_property_type_event: ['Convention Center', 'Banquet Hall', 'Stadium', 'Resort']
  };

  // Field options for Pharma & Healthcare subdomains
  const pharmaFieldOptions = {
    // Pharma Manufacturing & Quality (PH1) fields
    ph_compliance: ['GMP', 'GLP', 'FDA', 'EMA', 'MHRA'],
    ph_equipment_handling: ['Bioreactors', 'HPLC', 'Chromatography'],
    ph_quality_tools: ['Six Sigma', 'CAPA', 'Lean', 'Kaizen'],
    ph_shift_preference: ['Day', 'Night', 'Rotational'],

    // Distribution & Supply Chain (PH2) fields
    ph_supply_chain_area: ['Cold Chain', 'Inventory', 'Logistics', 'Procurement'],
    ph_regulatory_knowledge: ['GDP (Good Distribution Practice)', 'WHO', 'CDSCO'],
    ph_tools_used: ['SAP', 'Oracle', 'JD Edwards', 'TrackWise'],

    // Research & Clinical (PH3) fields
    ph_trial_phase_exp: ['Phase I', 'Phase II', 'Phase III', 'Phase IV'],
    ph_regulatory_docs: ['IND', 'NDA', 'ANDA', 'CTA'],
    ph_lab_tools: ['LIMS', 'SAS', 'R', 'Python', 'CRO tools'],

    // Healthcare Services (PH4) fields
    ph_department: ['Nursing', 'Surgery', 'Radiology', 'Pharmacy', 'Admin'],
    ph_licenses: ['MBBS', 'MD', 'RN', 'Pharmacist', 'DNB'],
    ph_languages: ['English', 'Hindi', 'French', 'Arabic']
  };

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
      updateEditingEntry(prev => prev ? {
        ...prev,
        [fieldName]: value
      } : null);
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
        {/* <select
          value={(editingEntry as any)?.[fieldName] || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select {label.toLowerCase()}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select> */}
        <input
          type="text"
          value={(editingEntry as any)?.[fieldName] || ''}
          onChange={(e) => handleFieldChange(fieldName, e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
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

  const renderITSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;

    switch (subDomain) {
      // Software Development & Services (IT1) Fields
      case 'Software Development & Services (IT1)':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Portfolio / GitHub
                </label>
                <input
                  type="url"
                  value={editingEntry?.it_portfolio || ''}
                  onChange={(e) => updateEditingEntry(prev => prev ? { ...prev, it_portfolio: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your GitHub/Portfolio link"
                />
              </div>

            </div>

            {renderEnhancedMultiValueInput(
              'it_dev_method',
              'Development Methodology',
              'Type Agile, Scrum, Waterfall...',
              'bg-blue-100 text-blue-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'it_domain_exp',
              'Domain Expertise',
              'Domains like FinTech, HealthTech, SaaS',
              'bg-purple-100 text-purple-800'
            )}

            {renderEnhancedMultiValueInput(
              'it_tools_used',
              'Tools & Platforms',
              'List tools like Jira, Docker, Kubernetes...',
              'bg-green-100 text-green-800'
            )}
          </div>
        );

      // Data & Emerging Tech (IT2) Fields
      case 'Data & Emerging Tech (IT2)':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'it_tools',
              'Tools Used',
              'Enter tools like Tableau, Hadoop, Spark...',
              'bg-purple-100 text-purple-800'
            )}

            {renderEnhancedMultiValueInput(
              'it_data_domain_exp',
              'Data Domain Focus',
              'Enter domains like Healthcare, Retail, IoT...',
              'bg-indigo-100 text-indigo-800'
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research / Papers
                </label>
                <input
                  type="url"
                  value={editingEntry?.it_research || ''}
                  onChange={(e) => updateEditingEntry(prev => prev ? { ...prev, it_research: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste link to research papers or publications"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major Projects
                </label>
                <textarea
                  value={editingEntry?.it_data_projects || ''}
                  onChange={(e) => updateEditingEntry(prev => prev ? { ...prev, it_data_projects: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Mention key data projects with links"
                />
              </div>
            </div>


          </div>
        );

      // Cybersecurity & Networks (IT3) Fields
      case 'Cybersecurity & Networks (IT3)':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'it_compliance',
              'Compliance',
              'Enter standards like ISO27001, GDPR...',
              'bg-red-100 text-red-800'
            )}

            {renderEnhancedMultiValueInput(
              'it_security_tools',
              'Security Tools Used',
              'Enter tools like SIEM, IDS, Firewalls, Splunk...',
              'bg-orange-100 text-orange-800'
            )}

            {renderEnhancedMultiValueInput(
              'it_incident_exp',
              'Incident Handling',
              'Enter SOC, Threat Hunting, Incident Response...',
              'bg-yellow-100 text-yellow-800'
            )}


            {renderEnhancedMultiValueInput(
              'it_network_exp',
              'Network Expertise',
              'Enter Routing, Switching, VPNs, SD-WAN...',
              'bg-teal-100 text-teal-800'
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Clearance
              </label>
              <select
                value={editingEntry?.it_security_clearance || ''}
                onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? { ...prev, it_security_clearance: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Clearance Level</option>
                {itFieldOptions.it_security_clearance.map(clearance => (
                  <option key={clearance} value={clearance}>{clearance}</option>
                ))}
              </select>
              {/* <input
                type="text"
                value={editingEntry?.it_security_clearance || ''}
                onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? { ...prev, it_security_clearance: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter security clearance level (e.g., None, Confidential, Secret, Top Secret)"
              /> */}
            </div>
          </div>
        );

      case 'Banking':
        return (
          <div className="space-y-4">
            {renderTextInput('bankingDomain', 'Banking Domain', 'text', true)}
            {renderTextInput('bankingCertifications', 'Certifications')}
            {renderTextInput('complianceKnowledge', 'Compliance Knowledge')}
            {renderTextInput('coreBankingSoftware', 'Core Banking Software')}
            {renderTextInput('regulatoryExperience', 'Regulatory Experience')}
          </div>
        );

      case 'Hospitality':
        return (
          <div className="space-y-4">
            {renderSelect('hospitalityDepartment', hospitalityDepartments, 'Department', true)}
            {renderTextInput('hospitalitySkills', 'Skills')}
            {renderTextInput('languagesKnown', 'Languages Known')}
            {renderTextInput('hospitalityCertifications', 'Certifications')}
            {renderTextInput('propertyType', 'Property Type')}
            {renderSelect('willingToRelocate', ['Yes', 'No'], 'Willing to Relocate')}
          </div>
        );

      default:
        return null;
    }
  };  // Close the renderITSubdomainFields function

  // Manufacturing subdomain fields renderer
  const renderManufacturingSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;

    // Extract the code from the subdomain value (e.g., "Production & Operations (MF1)" -> "MF1")
    const subDomainCode = subDomain.includes('(') ? subDomain.match(/\(([^)]+)\)/)?.[1] : subDomain;

    switch (subDomainCode) {
      // Production & Operations (MF1) Fields
      case 'MF1':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'mf_production_area',
              'Production Area',
              'Enter production area and press Enter (e.g., Assembly, Fabrication, Packaging)',
              'bg-blue-100 text-blue-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'mf_machine_handling',
              'Machine Handling',
              'Enter machine and press Enter (e.g., CNC, Lathe, Injection Molding)',
              'bg-green-100 text-green-800'
            )}

            {renderEnhancedMultiValueInput(
              'mf_safety_cert',
              'Safety Training',
              'Enter training and press Enter (e.g., OSHA, Fire Safety, PPE)',
              'bg-yellow-100 text-yellow-800'
            )}

            {renderEnhancedMultiValueInput(
              'mf_shift_preference',
              'Shift Preference',
              'Enter preference and press Enter (e.g., Day Shift, Night Shift, Rotational)',
              'bg-purple-100 text-purple-800'
            )}
          </div>
        );

      // Automotive & Engineering (MF2) Fields
      case 'MF2':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'mf_engineering_domain',
              'Engineering Domain',
              'Enter domain and press Enter (e.g., Automotive, Aerospace, Rail)',
              'bg-indigo-100 text-indigo-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'mf_design_tools',
              'Design Tools',
              'Enter tool and press Enter (e.g., AutoCAD, SolidWorks, CATIA)',
              'bg-cyan-100 text-cyan-800'
            )}

            {renderEnhancedMultiValueInput(
              'mf_prototyping_exp',
              'Prototyping Experience',
              'Enter experience and press Enter (e.g., 3D Printing, CNC, Injection Molding)',
              'bg-emerald-100 text-emerald-800'
            )}

            {renderEnhancedMultiValueInput(
              'mf_regulatory_knowledge',
              'Regulatory Standards',
              'Enter knowledge and press Enter (e.g., ISO/TS16949, AS9100, BIS)',
              'bg-red-100 text-red-800'
            )}
          </div>
        );

      // Quality & Maintenance (MF3) Fields
      case 'MF3':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'mf_quality_tools',
              'Quality Tools',
              'Enter tool and press Enter (e.g., Six Sigma, Lean, SPC)',
              'bg-purple-100 text-purple-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'mf_testing_methods',
              'Testing Methods',
              'Enter method and press Enter (e.g., NDT, Destructive Testing, CMM)',
              'bg-blue-100 text-blue-800'
            )}

            {renderEnhancedMultiValueInput(
              'mf_certifications_qm',
              'Quality Certifications',
              'Enter certification and press Enter (e.g., ISO 9001, Six Sigma Black Belt)',
              'bg-orange-100 text-orange-800'
            )}

            {renderEnhancedMultiValueInput(
              'mf_maintenance_exp',
              'Maintenance Experience',
              'Enter experience and press Enter (e.g., Preventive, Predictive, TPM)',
              'bg-emerald-100 text-emerald-800'
            )}
          </div>
        );

      // Supply Chain & Materials (MF4) Fields
      case 'MF4':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'mf_supply_area',
              'Supply Chain Area',
              'Enter area and press Enter (e.g., Procurement, Logistics, Warehousing)',
              'bg-indigo-100 text-indigo-800',
              true
            )}
            {renderEnhancedMultiValueInput(
              'mf_material_expertise',
              'Material Expertise',
              'Enter expertise and press Enter (e.g., Steel, Plastics, Composites)',
              'bg-teal-100 text-teal-800'
            )}
            {renderEnhancedMultiValueInput(
              'mf_tools_used',
              'SCM Tools',
              'Enter tool and press Enter (e.g., SAP, Oracle SCM, JDA)',
              'bg-cyan-100 text-cyan-800'
            )}
            {renderEnhancedMultiValueInput(
              'mf_regulatory_compliance',
              'Regulatory Compliance',
              'Enter compliance and press Enter (e.g., ISO 14001, REACH, RoHS)',
              'bg-rose-100 text-rose-800'
            )}
          </div>
        );


      default:
        return null;
    }
  };

  // Banking subdomain fields renderer
  const renderBankingSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;

    // Extract the code from the subdomain value (e.g., "Banking (BF1)" -> "BF1")
    const subDomainCode = subDomain.includes('(') ? subDomain.match(/\(([^)]+)\)/)?.[1] : subDomain;

    switch (subDomainCode) {
      // Banking (BF1) Fields
      case 'BF1':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'bf_banking_domain',
              'Banking Domain',
              'Enter domain and press Enter (e.g., Retail Banking, Corporate Banking)',
              'bg-blue-100 text-blue-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'bf_core_banking_systems',
              'Core Banking Systems',
              'Enter system and press Enter (e.g., Temenos, Finacle, Oracle FLEXCUBE)',
              'bg-green-100 text-green-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'bf_regulatory_exp',
              'Regulatory Exposure',
              'Enter regulation and press Enter (e.g., Basel III, GDPR, PCI DSS)',
              'bg-yellow-100 text-yellow-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_compliance_knowledge',
              'Compliance Knowledge',
              'Enter compliance area and press Enter (e.g., AML, KYC, SOX)',
              'bg-purple-100 text-purple-800'
            )}
          </div>
        );

      // Finance & Investments (BF2) Fields
      case 'BF2':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'bf_finance_area',
              'Finance Focus Area',
              'Enter area and press Enter (e.g., Investment Banking, Asset Management, Risk)',
              'bg-indigo-100 text-indigo-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'bf_erp_tools',
              'ERP / Financial Tools',
              'Enter tool and press Enter (e.g., SAP, Oracle ERP, QuickBooks)',
              'bg-cyan-100 text-cyan-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_reporting_standards',
              'Reporting Standards',
              'Enter standard and press Enter (e.g., GAAP, IFRS, SOX)',
              'bg-pink-100 text-pink-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_industry_experience',
              'Industry Finance Experience',
              'Enter experience and press Enter (e.g., Healthcare Finance, Tech Finance)',
              'bg-red-100 text-red-800'
            )}
          </div>
        );

      // Insurance (BF3) Fields
      case 'BF3':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'bf_insurance_domain',
              'Insurance Domain',
              'Enter domain and press Enter (e.g., Life Insurance, Health Insurance)',
              'bg-teal-100 text-teal-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'bf_insurance_products',
              'Insurance Products',
              'Enter product and press Enter (e.g., Term Life, Annuities, Auto)',
              'bg-orange-100 text-orange-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_licensing',
              'Regulatory Licenses',
              'Enter license and press Enter (e.g., Series 7, Series 66, Life & Health)',
              'bg-emerald-100 text-emerald-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_claims_exp',
              'Claims & Underwriting',
              'Enter experience and press Enter (e.g., Claims Processing, Risk Assessment)',
              'bg-violet-100 text-violet-800'
            )}
          </div>
        );

      // FinTech & Payments (BF4) Fields
      case 'BF4':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'bf_payment_systems',
              'Payment Systems',
              'Enter system and press Enter (e.g., Stripe, PayPal, Square)',
              'bg-blue-100 text-blue-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'bf_digital_platforms',
              'FinTech Platforms',
              'Enter platform and press Enter (e.g., Robinhood, Coinbase, Plaid)',
              'bg-green-100 text-green-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_regtech_knowledge',
              'Regulatory Tech',
              'Enter knowledge and press Enter (e.g., Compliance Automation, Risk Management)',
              'bg-yellow-100 text-yellow-800'
            )}

            {renderEnhancedMultiValueInput(
              'bf_security_compliance',
              'Security Standards',
              'Enter standard and press Enter (e.g., PCI DSS, ISO 27001, SOC 2)',
              'bg-purple-100 text-purple-800'
            )}
          </div>
        );


      default:
        return null;
    }
  };

  // Hospitality subdomain fields renderer
  const renderHospitalitySubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;

    // Extract the code from the subdomain value (e.g., "Hotels & Lodging (HS1)" -> "HS1")
    const subDomainCode = subDomain.includes('(') ? subDomain.match(/\(([^)]+)\)/)?.[1] : subDomain;

    switch (subDomainCode) {
      // Hotels & Lodging (HS1) Fields
      case 'HS1':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'hs_department',
              'Department',
              'Enter department and press Enter (e.g., Front Office, Housekeeping, Concierge)',
              'bg-blue-100 text-blue-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'hs_property_type',
              'Property Type',
              'Enter type and press Enter (e.g., Hotel, Resort, Boutique)',
              'bg-green-100 text-green-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_guest_mgmt_system',
              'Guest Management System',
              'Enter system and press Enter (e.g., Opera, Fidelio, RoomMaster)',
              'bg-purple-100 text-purple-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_languages_known',
              'Languages Known',
              'Enter language and press Enter (e.g., English, Spanish, French)',
              'bg-purple-100 text-purple-800'
            )}
          </div>
        );

      // Food & Beverages (HS2) Fields
      case 'HS2':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'hs_fnb_specialization',
              'F&B Specialization',
              'Enter specialization and press Enter (e.g., Fine Dining, Casual Dining, Catering)',
              'bg-indigo-100 text-indigo-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'hs_service_type',
              'Service Type',
              'Enter type and press Enter (e.g., Table Service, Counter Service, Buffet)',
              'bg-cyan-100 text-cyan-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_fnb_certifications',
              'F&B Certifications',
              'Enter certification and press Enter (e.g., ServSafe, HACCP, Sommelier)',
              'bg-pink-100 text-pink-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_beverage_knowledge',
              'Beverage Knowledge',
              'Enter knowledge and press Enter (e.g., Wine, Cocktails, Coffee)',
              'bg-red-100 text-red-800'
            )}
          </div>
        );

      // Travel & Tourism (HS3) Fields
      case 'HS3':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'hs_travel_domain',
              'Travel Domain',
              'Enter domain and press Enter (e.g., Corporate Travel, Leisure Travel, Adventure)',
              'bg-teal-100 text-teal-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'hs_ticketing_systems',
              'Ticketing Systems',
              'Enter system and press Enter (e.g., Amadeus, Sabre, Galileo)',
              'bg-orange-100 text-orange-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_destination_expertise',
              'Destination Expertise',
              'Enter destination and press Enter (e.g., Europe, Asia, Caribbean)',
              'bg-emerald-100 text-emerald-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_customer_type',
              'Customer Type',
              'Enter type and press Enter (e.g., Business Travelers, Families, Solo Travelers)',
              'bg-violet-100 text-violet-800'
            )}
          </div>
        );

      // Events & Recreation (HS4) Fields
      case 'HS4':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'hs_event_type',
              'Event Type',
              'Enter type and press Enter (e.g., Corporate Events, Weddings, Conferences)',
              'bg-blue-100 text-blue-800',
              true
            )}

            {renderEnhancedMultiValueInput(
              'hs_event_skills',
              'Event Skills',
              'Enter skill and press Enter (e.g., Event Planning, Vendor Management, Logistics)',
              'bg-green-100 text-green-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_ticketing_platforms',
              'Ticketing Platforms',
              'Enter platform and press Enter (e.g., Eventbrite, Ticketmaster, BookMyShow)',
              'bg-yellow-100 text-yellow-800'
            )}

            {renderEnhancedMultiValueInput(
              'hs_property_type_event',
              'Venue Type',
              'Enter type and press Enter (e.g., Convention Centers, Hotels, Outdoor Venues)',
              'bg-purple-100 text-purple-800'
            )}
          </div>
        );


      default:
        return null;
    }
  };

  // Pharma & Healthcare subdomain fields renderer
  const renderPharmaSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;

    // Extract the code from the subdomain value (e.g., "Pharma Manufacturing & Quality (PH1)" -> "PH1")
    const subDomainCode = subDomain.includes('(') ? subDomain.match(/\(([^)]+)\)/)?.[1] : subDomain;

    switch (subDomainCode) {
      // Pharma Manufacturing & Quality (PH1) Fields
      case 'PH1':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'ph_compliance',
              'Compliance Standards',
              'Enter compliance standard and press Enter (e.g., GMP, FDA, ICH)',
              'bg-blue-100 text-blue-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_equipment_handling',
              'Equipment Handling',
              'Enter equipment and press Enter (e.g., Bioreactors, HPLC, Tablet Press)',
              'bg-green-100 text-green-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_quality_tools',
              'Quality Tools Used',
              'Enter tool and press Enter (e.g., SPC, CAPA, Validation)',
              'bg-yellow-100 text-yellow-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_shift_preference',
              'Shift Preference',
              'Enter preference and press Enter (e.g., Day Shift, Night Shift, Rotational)',
              'bg-purple-100 text-purple-800'
            )}
          </div>
        );

      // Distribution & Supply Chain (PH2) Fields
      case 'PH2':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'ph_supply_chain_area',
              'Supply Chain Focus',
              'Enter area and press Enter (e.g., Procurement, Distribution, Logistics)',
              'bg-purple-100 text-purple-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_regulatory_knowledge',
              'Regulatory Knowledge',
              'Enter knowledge and press Enter (e.g., GDP, Cold Chain, Import/Export)',
              'bg-indigo-100 text-indigo-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_tools_used',
              'SCM Tools Used',
              'Enter tool and press Enter (e.g., SAP, Oracle WMS, TraceLink)',
              'bg-teal-100 text-teal-800'
            )}
          </div>
        );

      // Research & Clinical (PH3) Fields
      case 'PH3':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'ph_trial_phase_exp',
              'Clinical Trial Phases',
              'Enter phase and press Enter (e.g., Phase I, Phase II, Phase III)',
              'bg-red-100 text-red-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_regulatory_docs',
              'Regulatory Documents',
              'Enter document and press Enter (e.g., IND, NDA, CTD)',
              'bg-orange-100 text-orange-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_lab_tools',
              'Lab Tools / Platforms',
              'Enter tool and press Enter (e.g., LIMS, EDC, Statistical Software)',
              'bg-emerald-100 text-emerald-800'
            )}

            {renderTextInput('ph_publications', 'Publications / Papers', 'url')}
          </div>
        );

      // Healthcare Services (PH4) Fields
      case 'PH4':
        return (
          <div className="space-y-4">
            {/* {renderEnhancedMultiValueInput(
              'ph_department',
              'Department',
              'Enter department and press Enter (e.g., Nursing, Surgery, Radiology, Pharmacy)',
              'bg-blue-100 text-blue-800',
              true
            )} */}

            {renderEnhancedMultiValueInput(
              'ph_shift_preference',
              'Shift Preference',
              'Enter preference and press Enter (e.g., Day Shift, Night Shift, Rotational)',
              'bg-indigo-100 text-indigo-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_licenses',
              'Medical Licenses',
              'Enter license and press Enter (e.g., MD, RN, PharmD)',
              'bg-pink-100 text-pink-800'
            )}

            {renderEnhancedMultiValueInput(
              'ph_languages',
              'Languages Known',
              'Enter language and press Enter (e.g., English, Spanish, French)',
              'bg-cyan-100 text-cyan-800'
            )}
          </div>
        );


      default:
        return null;
    }
  };

  // Define renderDomainFields function
  const renderDomainFields = () => {
    switch (profileType) {
      case 'IT':
        return (
          <div className="space-y-4">
            {renderEnhancedMultiValueInput(
              'itCertifications',
              'Certifications',
              'Certifications like AWS, Azure, Google Cloud',
              'bg-blue-100 text-blue-800'
            )}
            {/*
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub / Portfolio</label>
                <input 
                  type="url" 
                  value={editingEntry?.githubPortfolio || ''} 
                  onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? { ...prev, githubPortfolio: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter GitHub or portfolio URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period <span className='text-gray-500'>(in days)</span></label>
                <select
                  value={editingEntry?.noticePeriod || ''}
                  onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? { ...prev, noticePeriod: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select notice period</option>
                  {noticePeriods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select> 
                <input
                  type="number"
                  value={editingEntry?.noticePeriod || ''}
                  onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? { ...prev, noticePeriod: e.target.value } : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notice period"
                />
                
              </div>
            </div>
              */}
            {subDomain && (
              <div className="mt-6">
                <h5 className="text-md font-medium text-gray-900 mb-4">
                  {itSubDomains.find(sub => sub.value === subDomain)?.label} Fields
                </h5>
                {renderITSubdomainFields()}
              </div>
            )}
          </div>
        );

      case 'Manufacturing':
        return (
          <div className="space-y-4">
            {subDomain && (
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-4">
                  {manufacturingSubDomains.find(sub => sub.value === subDomain)?.label} Fields
                </h5>
                {renderManufacturingSubdomainFields()}
              </div>
            )}
          </div>
        );

      case 'Finance':
        return (
          <div className="space-y-4">
            {renderTextInput('financeSkills', 'Skills')}
            {renderTextInput('erpSystems', 'ERP Systems')}
            {renderTextInput('financeCertifications', 'Certifications')}
            {renderTextInput('financeIndustries', 'Industries')}
          </div>
        );

      case 'Banking':
        return (
          <div className="space-y-4">
            {subDomain && (
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-4">
                  {bankingSubDomains.find(sub => sub.value === subDomain)?.label} Fields
                </h5>
                {renderBankingSubdomainFields()}
              </div>
            )}
          </div>
        );

      case 'Hospitality':
        return (
          <div className="space-y-4">
            {subDomain && (
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-4">
                  {hospitalitySubDomains.find(sub => sub.value === subDomain)?.label} Fields
                </h5>
                {renderHospitalitySubdomainFields()}
              </div>
            )}
          </div>
        );

      case 'Pharma & Healthcare':
        return (
          <div className="space-y-4">
            {subDomain && (
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-4">
                  {pharmaSubDomains.find(sub => sub.value === subDomain)?.label} Fields
                </h5>
                {renderPharmaSubdomainFields()}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

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