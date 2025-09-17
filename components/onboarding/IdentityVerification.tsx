'use client';

import { useState } from 'react';
import { Shield, Upload, CreditCard, FileText, CheckCircle, X } from 'lucide-react';

interface IdentityVerificationProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

const documentTypes = [
  { id: 'aadhaar', name: 'Aadhaar Card', icon: CreditCard, description: 'Most trusted verification' },
  { id: 'pan', name: 'PAN Card', icon: FileText, description: 'Alternative verification' },
  // { id: 'passport', name: 'Passport', icon: FileText, description: 'International ID' },
  { id: 'voter', name: 'Voter ID', icon: FileText, description: 'Government issued ID' },
];

export default function IdentityVerification({ data, updateData, nextStep }: IdentityVerificationProps) {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleSkip = () => {
    updateData({ identityVerified: false });
    nextStep();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsUploading(true);
      
      // Simulate upload
      setTimeout(() => {
        setIsUploading(false);
        updateData({ identityVerified: true });
      }, 2000);
    }
  };

  const handleVerify = () => {
    if (data.identityVerified) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-green-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Identity Verification
        </h1>
        <p className="text-gray-600">
          Verify your identity to build trust and unlock premium features
        </p>
        <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
          Optional - Skip for now
        </div>
      </div>

      {!data.identityVerified ? (
        <div className="space-y-4">
          {/* Document Type Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Select Document Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {documentTypes.map((doc) => {
                const Icon = doc.icon;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc.id)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      selectedDoc === doc.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-300'
                    }`}
                  >
                    <Icon className={selectedDoc === doc.id ? 'text-orange-600' : 'text-gray-600'} size={20} />
                    <p className="text-sm font-medium text-gray-900 mt-1">{doc.name}</p>
                    <p className="text-xs text-gray-500">{doc.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* File Upload */}
          {selectedDoc && (
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Upload Document</h3>
              
              {!uploadedFile ? (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors cursor-pointer">
                    <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-sm font-medium text-gray-900">Upload your {documentTypes.find(d => d.id === selectedDoc)?.name}</p>
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
                    {isUploading ? (
                      <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle className="text-green-600" size={20} />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {isUploading ? 'Uploading...' : 'Upload complete'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      updateData({ identityVerified: false });
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Security Note */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="text-blue-600 mt-0.5" size={16} />
              <div className="text-sm">
                <p className="text-blue-900 font-medium mb-1">Your data is secure</p>
                <p className="text-blue-700">
                  Documents are encrypted and sensitive information is automatically masked. We only store verification status.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Complete!</h3>
          <p className="text-gray-600">Your identity has been successfully verified</p>
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
          onClick={data.identityVerified ? handleVerify : undefined}
          disabled={!data.identityVerified}
          className="flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}