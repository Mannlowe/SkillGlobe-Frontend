'use client';

import { useState } from 'react';
import { Shield, FileText, Eye, Upload, Download, Check } from 'lucide-react';
import Link from 'next/link';
import { useRegistrationStore } from '@/store/registration';

interface BusinessTermsAcceptanceProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function BusinessTermsAcceptance({ data, updateData, nextStep }: BusinessTermsAcceptanceProps) {
  const [authDocument, setAuthDocument] = useState<File | null>(null);
  const [agreementDownloaded, setAgreementDownloaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get registration store state and actions
  const { completeRegistration, isLoading, error: apiError, request_id, password } = useRegistrationStore();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAuthDocument(file);
      updateData({ authDocument: file.name });
    }
  };
  
  const handleDownloadAgreement = () => {
    // Create a link to download the agreement.pdf file
    const link = document.createElement('a');
    link.href = '/documents/agreement.pdf'; // Path to your agreement PDF
    link.download = 'SkillGlobe_Agreement.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Set state to indicate agreement has been downloaded
    setAgreementDownloaded(true);
  };

  const handleAccept = async () => {
    if (!data.termsAccepted) {
      setError('Please accept the terms and conditions to continue');
      return;
    }
    
    // Check if request_id exists
    if (!request_id) {
      setError('Registration ID is missing. Please complete previous steps first.');
      return;
    }
    
    // For password, we'll handle it differently since it's not persisted in localStorage
    if (!password) {
      // If we have data.password from the form, we can use that
      if (data.password) {
        // Update the password in the registration store
        useRegistrationStore.setState({ password: data.password });
        console.log('Using password from form data');
      } else {
        // If no password is available, we need to ask the user to re-enter it
        setError('For security reasons, your password is not stored. Please go back to the personal information step to re-enter your password.');
        return;
      }
    }
    
    try {
      // Call API to complete registration with agreed=1 since terms are accepted
      await completeRegistration(data.termsAccepted ? 1 : 0);
      
      // Proceed to next step on success
      nextStep();
    } catch (error) {
      console.error('Error completing registration:', error);
      // Error is handled by the store
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-blue-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Business Terms & Authorization
        </h1>
        <p className="text-gray-600">
          Please review and accept our business terms to continue
        </p>
      </div>

      <div className="space-y-4">
        {/* Business Terms Preview */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-900">Business Agreement Key Points</h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>Business data is encrypted and securely stored with enterprise-grade security</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>Admin controls for user management and access permissions</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>Compliance with data protection regulations (GDPR, CCPA)</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>Flexible billing and subscription management</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>24/7 business support and dedicated account management</p>
            </div>
          </div>
        </div>

        {/* Document Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/business-terms" 
            target="_blank"
            className="flex items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} className="mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Business Terms</span>
          </Link>
          
          <Link 
            href="/privacy" 
            target="_blank"
            className="flex items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Eye size={16} className="mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Privacy Policy</span>
          </Link>
        </div>

        {/* Authorization Agreement Document */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3">Authorization Agreement</h3>
          
          {!agreementDownloaded ? (
            <>
              <p className="text-sm text-blue-700 mb-3">
                Please download the authorization agreement form, sign it, and upload the scanned copy.
              </p>
              
              <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="text-blue-500 mr-2" size={20} />
                    <span className="text-sm font-medium">SkillGlobe_Agreement.pdf</span>
                  </div>
                  <button 
                    onClick={handleDownloadAgreement}
                    className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
                <Check className="text-green-500 mr-2" size={18} />
                <span className="text-sm font-medium text-green-700">Agreement downloaded successfully</span>
              </div>
              
              <p className="text-sm text-blue-700 mb-3">
                Please upload the signed authorization document for verification
              </p>
              
              {!authDocument ? (
                <label className="block">
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto text-blue-400 mb-2" size={20} />
                    <p className="text-sm font-medium text-blue-900">Upload Signed Authorization</p>
                    <p className="text-xs text-blue-600 mt-1">PDF, JPG, PNG (max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">✓ {authDocument.name}</p>
                  <p className="text-xs text-blue-700">Document uploaded successfully</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Acceptance Checkbox */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.termsAccepted || false}
              onChange={(e) => updateData({ termsAccepted: e.target.checked })}
              className="w-5 h-5 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
            />
            <div className="text-sm">
              <p className="text-gray-900 font-medium mb-1">
                I agree to the Business Terms of Service and Privacy Policy
              </p>
              <p className="text-gray-600">
                As an authorized representative of the business, I confirm that I have the authority to bind the organization to these terms and have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </label>
        </div>
      </div>

      {(apiError || error) && (
        <div className="text-center text-sm text-red-500 p-2 bg-red-50 rounded-md mb-4">
          {apiError || error}
        </div>
      )}
      
      <button
        onClick={handleAccept}
        disabled={isLoading || !data.termsAccepted}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          'Accept & Continue'
        )}
      </button>

      <div className="text-center text-sm text-gray-500">
        You must accept these terms to use SkillGlobe for Business
      </div>
    </div>
  );
}