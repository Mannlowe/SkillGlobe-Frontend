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

// IT Subdomain options
export const itSubDomains = [
  { value: 'IT1', label: 'Software Development & Services' },
  { value: 'IT2', label: 'Data & Emerging Tech' },
  { value: 'IT3', label: 'Cybersecurity & Networks' }
];

// Manufacturing Subdomain options
export const manufacturingSubDomains = [
  { value: 'MF1', label: 'Production & Operations' },
  { value: 'MF2', label: 'Automotive & Engineering' },
  { value: 'MF3', label: 'Quality & Maintenance' },
  { value: 'MF4', label: 'Supply Chain & Materials' }
];

// Banking Subdomain options
export const bankingSubDomains = [
  { value: 'BF1', label: 'Banking' },
  { value: 'BF2', label: 'Finance & Investments' },
  { value: 'BF3', label: 'Insurance' },
  { value: 'BF4', label: 'FinTech & Payments' }
];

// Hospitality Subdomain options
export const hospitalitySubDomains = [
  { value: 'HS1', label: 'Hotels & Lodging' },
  { value: 'HS2', label: 'Food & Beverages' },
  { value: 'HS3', label: 'Travel & Tourism' },
  { value: 'HS4', label: 'Events & Recreation' }
];

const DomainFields: React.FC<DomainFieldsProps> = ({ profileType, subDomain, editingEntry, setEditingEntry }) => {
  // Type-safe setter function that ensures compatibility between ProfileEntry types
  const updateEditingEntry = (updater: (prev: ProfileEntry | null) => ProfileEntry | null) => {
    setEditingEntry(prev => updater(prev as unknown as ProfileEntry) as unknown as BaseProfileEntry);
  };
  // State for managing dropdown visibility
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  
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

  const renderITSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;
    
    switch (subDomain) {
      // Software Development & Services (IT1) Fields
      case 'IT1':
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
                  onChange={(e) => updateEditingEntry(prev => prev ? {...prev, it_portfolio: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username or portfolio URL"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Development Methodology
                </label>
                <select
                  value={editingEntry?.it_dev_method || ''}
                  onChange={(e) => updateEditingEntry(prev => prev ? {...prev, it_dev_method: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Methodology</option>
                  {itFieldOptions.it_dev_method.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain Expertise
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_domain_exp || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_domain_exp || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_domain_exp: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select domain expertise</option>
                    {itFieldOptions.it_domain_exp
                      .filter(domain => !(editingEntry?.it_domain_exp || []).includes(domain))
                      .map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_domain_exp || []).map(domain => (
                    <span key={domain} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {domain}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_domain_exp || []).filter(d => d !== domain);
                          updateEditingEntry(prev => prev ? {...prev, it_domain_exp: updated} : null);
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tools & Platforms
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_tools_used || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_tools_used || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_tools_used: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select tools</option>
                    {itFieldOptions.it_tools_used
                      .filter(tool => !(editingEntry?.it_tools_used || []).includes(tool))
                      .map(tool => (
                        <option key={tool} value={tool}>{tool}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_tools_used || []).map(tool => (
                    <span key={tool} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {tool}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_tools_used || []).filter(t => t !== tool);
                          updateEditingEntry(prev => prev ? {...prev, it_tools_used: updated} : null);
                        }}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      // Data & Emerging Tech (IT2) Fields
      case 'IT2':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tools Used
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_tools || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_tools || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_tools: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select tools</option>
                    {itFieldOptions.it_tools
                      .filter(tool => !(editingEntry?.it_tools || []).includes(tool))
                      .map(tool => (
                        <option key={tool} value={tool}>{tool}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_tools || []).map(tool => (
                    <span key={tool} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {tool}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_tools || []).filter(t => t !== tool);
                          updateEditingEntry(prev => prev ? {...prev, it_tools: updated} : null);
                        }}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Domain Focus
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_data_domain_exp || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_data_domain_exp || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_data_domain_exp: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select data domains</option>
                    {itFieldOptions.it_data_domain_exp
                      .filter(domain => !(editingEntry?.it_data_domain_exp || []).includes(domain))
                      .map(domain => (
                        <option key={domain} value={domain}>{domain}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_data_domain_exp || []).map(domain => (
                    <span key={domain} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                      {domain}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_data_domain_exp || []).filter(d => d !== domain);
                          updateEditingEntry(prev => prev ? {...prev, it_data_domain_exp: updated} : null);
                        }}
                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Research / Papers
                </label>
                <input
                  type="url"
                  value={editingEntry?.it_research || ''}
                  onChange={(e) => updateEditingEntry(prev => prev ? {...prev, it_research: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Link to research papers or publications"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major Projects
                </label>
                <textarea
                  value={editingEntry?.it_data_projects || ''}
                  onChange={(e) => updateEditingEntry(prev => prev ? {...prev, it_data_projects: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe your major data projects or provide links"
                />
              </div>
            </div>
            
          
          </div>
        );

      // Cybersecurity & Networks (IT3) Fields
      case 'IT3':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Compliance
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_compliance || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_compliance || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_compliance: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{(editingEntry?.it_compliance || []).length} compliance selected</option>
                    {itFieldOptions.it_compliance
                      .filter(compliance => !(editingEntry?.it_compliance || []).includes(compliance))
                      .map(compliance => (
                        <option key={compliance} value={compliance}>{compliance}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_compliance || []).map(compliance => (
                    <span key={compliance} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                      {compliance}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_compliance || []).filter(c => c !== compliance);
                          updateEditingEntry(prev => prev ? {...prev, it_compliance: updated} : null);
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Tools Used
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_security_tools || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_security_tools || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_security_tools: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{(editingEntry?.it_security_tools || []).length} security tools selected</option>
                    {itFieldOptions.it_security_tools
                      .filter(tool => !(editingEntry?.it_security_tools || []).includes(tool))
                      .map(tool => (
                        <option key={tool} value={tool}>{tool}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_security_tools || []).map(tool => (
                    <span key={tool} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                      {tool}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_security_tools || []).filter(t => t !== tool);
                          updateEditingEntry(prev => prev ? {...prev, it_security_tools: updated} : null);
                        }}
                        className="ml-2 text-orange-600 hover:text-orange-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Handling
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_incident_exp || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_incident_exp || []), e.target.value];
                        updateEditingEntry(prev => prev ? {...prev, it_incident_exp: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{(editingEntry?.it_incident_exp || []).length} incident handling selected</option>
                    {itFieldOptions.it_incident_exp
                      .filter(exp => !(editingEntry?.it_incident_exp || []).includes(exp))
                      .map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_incident_exp || []).map(exp => (
                    <span key={exp} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                      {exp}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_incident_exp || []).filter(e => e !== exp);
                          setEditingEntry((prev: ProfileEntry | null) => prev ? {...prev, it_incident_exp: updated} : null);
                        }}
                        className="ml-2 text-yellow-600 hover:text-yellow-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Security Clearance
              </label>
              <select
                value={editingEntry?.it_security_clearance || ''}
                onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? {...prev, it_security_clearance: e.target.value} : null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Clearance Level</option>
                {itFieldOptions.it_security_clearance.map(clearance => (
                  <option key={clearance} value={clearance}>{clearance}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Network Expertise
              </label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !(editingEntry?.it_network_exp || []).includes(e.target.value)) {
                        const updated = [...(editingEntry?.it_network_exp || []), e.target.value];
                        setEditingEntry((prev: ProfileEntry | null) => prev ? {...prev, it_network_exp: updated} : null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{(editingEntry?.it_network_exp || []).length} network expertise selected</option>
                    {itFieldOptions.it_network_exp
                      .filter(exp => !(editingEntry?.it_network_exp || []).includes(exp))
                      .map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                  </select>
                </div>
                <div className="w-1/2 flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[42px] bg-gray-50">
                  {(editingEntry?.it_network_exp || []).map(exp => (
                    <span key={exp} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-100 text-teal-800">
                      {exp}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingEntry?.it_network_exp || []).filter(e => e !== exp);
                          setEditingEntry((prev: ProfileEntry | null) => prev ? {...prev, it_network_exp: updated} : null);
                        }}
                        className="ml-2 text-teal-600 hover:text-teal-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
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
};  // Close the renderITSubdomainFields function

  // Manufacturing subdomain fields renderer
  const renderManufacturingSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;
    
    switch (subDomain) {
      // Production & Operations (MF1) Fields
      case 'MF1':
        return (
          <div className="space-y-4">
            {renderMultiSelect('mf_production_area', manufacturingFieldOptions.mf_production_area, 'Production Area', true)}
            {renderMultiSelect('mf_machine_handling', manufacturingFieldOptions.mf_machine_handling, 'Machine Handling')}
            {renderMultiSelect('mf_safety_cert', manufacturingFieldOptions.mf_safety_cert, 'Safety Training')}
            {renderSelect('mf_shift_preference', manufacturingFieldOptions.mf_shift_preference, 'Shift Preference')}
          </div>
        );

      // Automotive & Engineering (MF2) Fields
      case 'MF2':
        return (
          <div className="space-y-4">
            {renderMultiSelect('mf_engineering_domain', manufacturingFieldOptions.mf_engineering_domain, 'Engineering Domain', true)}
            {renderMultiSelect('mf_design_tools', manufacturingFieldOptions.mf_design_tools, 'Design Tools')}
            {renderMultiSelect('mf_prototyping_exp', manufacturingFieldOptions.mf_prototyping_exp, 'Prototyping Experience')}
            {renderMultiSelect('mf_regulatory_knowledge', manufacturingFieldOptions.mf_regulatory_knowledge, 'Regulatory Standards')}
          </div>
        );

      // Quality & Maintenance (MF3) Fields
      case 'MF3':
        return (
          <div className="space-y-4">
            {renderMultiSelect('mf_quality_tools', manufacturingFieldOptions.mf_quality_tools, 'Quality Tools', true)}
            {renderMultiSelect('mf_testing_methods', manufacturingFieldOptions.mf_testing_methods, 'Testing Methods')}
            {renderMultiSelect('mf_certifications_qm', manufacturingFieldOptions.mf_certifications_qm, 'Quality Certifications')}
            {renderMultiSelect('mf_maintenance_exp', manufacturingFieldOptions.mf_maintenance_exp, 'Maintenance Expertise')}
          </div>
        );

      // Supply Chain & Materials (MF4) Fields
      case 'MF4':
        return (
          <div className="space-y-4">
            {renderMultiSelect('mf_supply_area', manufacturingFieldOptions.mf_supply_area, 'Supply Chain Area', true)}
            {renderMultiSelect('mf_material_expertise', manufacturingFieldOptions.mf_material_expertise, 'Material Expertise')}
            {renderMultiSelect('mf_tools_used', manufacturingFieldOptions.mf_tools_used, 'SCM Tools')}
            {renderMultiSelect('mf_regulatory_compliance', manufacturingFieldOptions.mf_regulatory_compliance, 'Regulatory Compliance')}
          </div>
        );

      default:
        return null;
    }
  };

  // Banking subdomain fields renderer
  const renderBankingSubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;
    
    switch (subDomain) {
      // Banking (BF1) Fields
      case 'BF1':
        return (
          <div className="space-y-4">
            {renderMultiSelect('bf_banking_domain', bankingFieldOptions.bf_banking_domain, 'Banking Domain', true)}
            {renderMultiSelect('bf_core_banking_systems', bankingFieldOptions.bf_core_banking_systems, 'Core Banking Systems')}
            {renderMultiSelect('bf_regulatory_exp', bankingFieldOptions.bf_regulatory_exp, 'Regulatory Exposure')}
            {renderMultiSelect('bf_compliance_knowledge', bankingFieldOptions.bf_compliance_knowledge, 'Compliance Knowledge')}
          </div>
        );

      // Finance & Investments (BF2) Fields
      case 'BF2':
        return (
          <div className="space-y-4">
            {renderMultiSelect('bf_finance_area', bankingFieldOptions.bf_finance_area, 'Finance Focus Area', true)}
            {renderMultiSelect('bf_erp_tools', bankingFieldOptions.bf_erp_tools, 'ERP / Financial Tools')}
            {renderMultiSelect('bf_reporting_standards', bankingFieldOptions.bf_reporting_standards, 'Reporting Standards')}
            {renderMultiSelect('bf_industry_experience', bankingFieldOptions.bf_industry_experience, 'Industry Finance Exp')}
          </div>
        );

      // Insurance (BF3) Fields
      case 'BF3':
        return (
          <div className="space-y-4">
            {renderMultiSelect('bf_insurance_domain', bankingFieldOptions.bf_insurance_domain, 'Insurance Domain', true)}
            {renderMultiSelect('bf_insurance_products', bankingFieldOptions.bf_insurance_products, 'Insurance Products')}
            {renderMultiSelect('bf_licensing', bankingFieldOptions.bf_licensing, 'Regulatory Licenses')}
            {renderMultiSelect('bf_claims_exp', bankingFieldOptions.bf_claims_exp, 'Claims & Underwriting')}
          </div>
        );

      // FinTech & Payments (BF4) Fields
      case 'BF4':
        return (
          <div className="space-y-4">
            {renderMultiSelect('bf_payment_systems', bankingFieldOptions.bf_payment_systems, 'Payment Systems', true)}
            {renderMultiSelect('bf_digital_platforms', bankingFieldOptions.bf_digital_platforms, 'FinTech Platforms')}
            {renderMultiSelect('bf_regtech_knowledge', bankingFieldOptions.bf_regtech_knowledge, 'Regulatory Tech')}
            {renderMultiSelect('bf_security_compliance', bankingFieldOptions.bf_security_compliance, 'Security Standards')}
          </div>
        );

      default:
        return null;
    }
  };

  // Hospitality subdomain fields renderer
  const renderHospitalitySubdomainFields = () => {
    if (!subDomain || !editingEntry) return null;
    
    switch (subDomain) {
      // Hotels & Lodging (HS1) Fields
      case 'HS1':
        return (
          <div className="space-y-4">
            {renderSelect('hs_department', hospitalityFieldOptions.hs_department, 'Department', true)}
            {renderMultiSelect('hs_property_type', hospitalityFieldOptions.hs_property_type, 'Property Type')}
            {renderMultiSelect('hs_guest_mgmt_system', hospitalityFieldOptions.hs_guest_mgmt_system, 'Guest Management System')}
            {renderMultiSelect('hs_languages_known', hospitalityFieldOptions.hs_languages_known, 'Languages Known')}
          </div>
        );

      // Food & Beverages (HS2) Fields
      case 'HS2':
        return (
          <div className="space-y-4">
            {renderMultiSelect('hs_fnb_specialization', hospitalityFieldOptions.hs_fnb_specialization, 'F&B Specialization', true)}
            {renderMultiSelect('hs_service_type', hospitalityFieldOptions.hs_service_type, 'Service Type')}
            {renderMultiSelect('hs_fnb_certifications', hospitalityFieldOptions.hs_fnb_certifications, 'F&B Certifications')}
            {renderMultiSelect('hs_beverage_knowledge', hospitalityFieldOptions.hs_beverage_knowledge, 'Beverage Knowledge')}
          </div>
        );

      // Travel & Tourism (HS3) Fields
      case 'HS3':
        return (
          <div className="space-y-4">
            {renderMultiSelect('hs_travel_domain', hospitalityFieldOptions.hs_travel_domain, 'Travel Domain', true)}
            {renderMultiSelect('hs_ticketing_systems', hospitalityFieldOptions.hs_ticketing_systems, 'Ticketing Systems')}
            {renderMultiSelect('hs_destination_expertise', hospitalityFieldOptions.hs_destination_expertise, 'Destination Expertise')}
            {renderMultiSelect('hs_customer_type', hospitalityFieldOptions.hs_customer_type, 'Customer Type')}
          </div>
        );

      // Events & Recreation (HS4) Fields
      case 'HS4':
        return (
          <div className="space-y-4">
            {renderMultiSelect('hs_event_type', hospitalityFieldOptions.hs_event_type, 'Event Type', true)}
            {renderMultiSelect('hs_event_skills', hospitalityFieldOptions.hs_event_skills, 'Event Skills')}
            {renderMultiSelect('hs_ticketing_platforms', hospitalityFieldOptions.hs_ticketing_platforms, 'Ticketing Platforms')}
            {renderMultiSelect('hs_property_type_event', hospitalityFieldOptions.hs_property_type_event, 'Venue Type')}
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
            {renderMultiSelect('itCertifications', itCertifications, 'Certifications')}
            <div className="grid grid-cols-2 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub / Portfolio</label>
                <input 
                  type="url" 
                  value={editingEntry?.githubPortfolio || ''} 
                  onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? {...prev, githubPortfolio: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username or portfolio URL"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                <select 
                  value={editingEntry?.noticePeriod || ''} 
                  onChange={(e) => setEditingEntry((prev: ProfileEntry | null) => prev ? {...prev, noticePeriod: e.target.value} : null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select notice period</option>
                  {noticePeriods.map(period => (
                    <option key={period} value={period}>{period}</option>
                  ))}
                </select>
              </div>
            </div>
            {subDomain && (
              <div className="mt-6">
                <div className="border-t border-gray-200 my-4"></div>
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
            {renderMultiSelect('financeSkills', financeSkills, 'Skills')}
            {renderMultiSelect('erpSystems', erpSystems, 'ERP Systems')}
            {renderMultiSelect('financeCertifications', financeCertifications, 'Certifications')}
            {renderMultiSelect('financeIndustries', financeIndustries, 'Industries')}
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