'use client';

import { useState, useEffect } from 'react';
import { Shield, Upload, CreditCard, FileText, CheckCircle, X } from 'lucide-react';

const documentTypes = [
  { id: 'aadhaar', name: 'Aadhaar Card', icon: CreditCard, description: 'Most trusted verification' },
  { id: 'pan', name: 'PAN Card', icon: FileText, description: 'Alternative verification' },
  { id: 'passport', name: 'Passport', icon: FileText, description: 'International ID' },
  { id: 'voter', name: 'Voter ID', icon: FileText, description: 'Government issued ID' },
];

interface IdentityVerificationProps {
  onVerificationComplete?: () => void;
  onSkip?: () => void;
  className?: string;
}

export default function IdentityVerification({ 
  onVerificationComplete, 
  onSkip,
  className = '' 
}: IdentityVerificationProps) {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setIsUploading(true);
      
      // Generate preview URL
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // Simulate upload without setting verification to true
      setTimeout(() => {
        setIsUploading(false);
      }, 2000);
    }
  };

  const handleVerify = () => {
    // Set verification to true when button is clicked
    setIdentityVerified(true);
    
    // Call the callback if provided
    if (onVerificationComplete) {
      onVerificationComplete();
    }
  };

  // Clean up object URLs when component unmounts or when file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className={`bg-white rounded-xl shadow-sm p-3 space-y-6 w-full ${className}`}>
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
        {/* <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mt-2">
          Optional - Skip for now
        </div> */}
      </div>

      {!identityVerified ? (
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
                <div className="space-y-3">
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
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl);
                          setPreviewUrl(null);
                        }
                        setUploadedFile(null);
                        setIdentityVerified(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  {/* Document Preview */}
                  {previewUrl && (
                    <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden">
                      {uploadedFile?.type.startsWith('image/') ? (
                        <img 
                          src={previewUrl} 
                          alt="Document preview" 
                          className="w-full h-auto max-h-64 object-contain"
                        />
                      ) : uploadedFile?.type === 'application/pdf' ? (
                        <div className="relative pt-[56.25%] bg-gray-100">
                          <iframe
                            src={previewUrl}
                            className="absolute top-0 left-0 w-full h-full"
                            title="PDF Preview"
                          />
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <FileText className="mx-auto mb-2" size={32} />
                          <p>Preview not available for this file type</p>
                        </div>
                      )}
                    </div>
                  )}
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
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verification Complete!</h3>
          <p className="text-gray-600">Your identity has been successfully verified</p>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        {!identityVerified && (
          <button
            onClick={handleVerify}
            disabled={!uploadedFile || isUploading}
            className="max-w-xs mx-auto flex-1 bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            Verify Identity
          </button>
        )}
      </div>
    </div>
  );
}