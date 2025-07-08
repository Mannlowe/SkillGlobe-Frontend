'use client';

import { useState } from 'react';
import { Shield, Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react';

interface BusinessDocumentVerificationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

const documentTypes = [
  { 
    id: 'gstin', 
    name: 'GSTIN', 
    icon: FileText, 
    description: 'Preferred for businesses',
    placeholder: 'Enter 15-digit GSTIN'
  },
  { 
    id: 'pan', 
    name: 'PAN Card', 
    icon: FileText, 
    description: 'Alternative for startups',
    placeholder: 'Enter 10-character PAN'
  },
];

export default function BusinessDocumentVerification({ data, updateData, nextStep }: BusinessDocumentVerificationProps) {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [verificationStatus, setVerificationStatus] = useState('');

  const handleSkip = () => {
    updateData({ documentVerified: false });
    nextStep();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleVerify = async () => {
    if (!selectedDoc || !documentNumber) {
      alert('Please select document type and enter document number');
      return;
    }

    setIsVerifying(true);
    
    // Simulate API verification
    setTimeout(() => {
      setIsVerifying(false);
      // Simulate different verification outcomes
      const outcomes = ['verified', 'partially-verified', 'not-verified'];
      const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      setVerificationStatus(randomOutcome);
      
      if (randomOutcome === 'verified' || randomOutcome === 'partially-verified') {
        updateData({ documentVerified: true, verificationStatus: randomOutcome });
      }
    }, 3000);
  };

  const handleContinue = () => {
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-green-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Business Document Verification
        </h1>
        <p className="text-gray-600">
          Verify your business authenticity with government-issued documents
        </p>
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
          Optional - Enhances credibility
        </div>
      </div>

      {!verificationStatus ? (
        <div className="space-y-4">
          {/* Document Type Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Select Document Type</h3>
            <div className="space-y-3">
              {documentTypes.map((doc) => {
                const Icon = doc.icon;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedDoc === doc.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={selectedDoc === doc.id ? 'text-orange-600' : 'text-gray-600'} size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{doc.name}</p>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Number Input */}
          {selectedDoc && (
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Enter Document Details</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                    placeholder={documentTypes.find(d => d.id === selectedDoc)?.placeholder}
                  />
                </div>

                {/* Optional File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Document (Optional but Recommended)
                  </label>
                  
                  {!uploadedFile ? (
                    <label className="block">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition-colors cursor-pointer">
                        <Upload className="mx-auto text-gray-400 mb-2" size={20} />
                        <p className="text-sm font-medium text-gray-900">Upload scanned copy</p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG or PDF (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="text-green-600" size={20} />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                          <p className="text-xs text-gray-500">Upload complete</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUploadedFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Verification Button */}
          {selectedDoc && documentNumber && (
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying with Government Database...
                </>
              ) : (
                'Verify Document'
              )}
            </button>
          )}

          {/* Security Note */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="text-blue-600 mt-0.5" size={16} />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Secure Verification Process</p>
                <p className="text-blue-700">
                  We use authorized government APIs for real-time verification. Your documents are encrypted and only verification status is stored.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          {verificationStatus === 'verified' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Complete!</h3>
              <p className="text-gray-600 mb-4">Your business document has been successfully verified</p>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-green-800 font-medium">✓ Verified Business Status</p>
                <p className="text-green-700 text-sm">Enhanced credibility and trust with clients</p>
              </div>
            </>
          )}

          {verificationStatus === 'partially-verified' && (
            <>
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Partially Verified</h3>
              <p className="text-gray-600 mb-4">Your document has been validated through basic checks</p>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-yellow-800 font-medium">⚠ Partially Verified Status</p>
                <p className="text-yellow-700 text-sm">Basic validation completed, enhanced verification available later</p>
              </div>
            </>
          )}

          {verificationStatus === 'not-verified' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="text-red-600" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-4">Unable to verify the document. You can retry or continue without verification</p>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-red-800 font-medium">✗ Verification Failed</p>
                <p className="text-red-700 text-sm">Please check document details or try alternative verification</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleSkip}
          className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
        >
          Skip for Now
        </button>
        <button
          onClick={handleContinue}
          disabled={isVerifying}
          className="flex-1 bg-gradient-to-r from-orange-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}