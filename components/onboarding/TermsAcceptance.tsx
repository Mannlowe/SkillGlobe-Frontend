'use client';

import { useState } from 'react';
import { Shield, FileText, Eye } from 'lucide-react';
import Link from 'next/link';

interface TermsAcceptanceProps {
  data: any;
  updateData: (data: any) => void;
  nextStep: () => void;
}

export default function TermsAcceptance({ data, updateData, nextStep }: TermsAcceptanceProps) {
  const [hasRead, setHasRead] = useState(false);

  const handleAccept = () => {
    if (!data.termsAccepted) {
      alert('Please accept the terms and conditions to continue');
      return;
    }
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="text-blue-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Terms & Privacy
        </h1>
        <p className="text-gray-600">
          Please review and accept our terms to continue
        </p>
      </div>

      <div className="space-y-4">
        {/* Terms Preview */}
        <div className="bg-white p-4 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="text-gray-600" size={20} />
            <h3 className="font-semibold text-gray-900">Key Points</h3>
          </div>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>Your data is encrypted and securely stored</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>We never share your personal information without consent</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>You can delete your account and data at any time</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
              <p>Free to use with optional premium features</p>
            </div>
          </div>
        </div>

        {/* Document Links */}
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href="/terms" 
            target="_blank"
            className="flex items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setHasRead(true)}
          >
            <Eye size={16} className="mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Terms of Service</span>
          </Link>
          
          <Link 
            href="/privacy" 
            target="_blank"
            className="flex items-center justify-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setHasRead(true)}
          >
            <Eye size={16} className="mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Privacy Policy</span>
          </Link>
        </div>

        {/* Acceptance Checkbox */}
        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.termsAccepted}
              onChange={(e) => updateData({ termsAccepted: e.target.checked })}
              className="w-5 h-5 text-orange-500 bg-white border-gray-300 rounded focus:ring-orange-500 focus:ring-2 mt-0.5"
            />
            <div className="text-sm">
              <p className="text-gray-900 font-medium mb-1">
                I agree to the Terms of Service and Privacy Policy
              </p>
              <p className="text-gray-600">
                By checking this box, you confirm that you have read, understood, and agree to be bound by these terms.
              </p>
            </div>
          </label>
        </div>
      </div>

      <button
        onClick={handleAccept}
        disabled={!data.termsAccepted}
        className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Accept & Continue
      </button>

      <div className="text-center text-sm text-gray-500">
        You must accept these terms to use SkillGlobe
      </div>
    </div>
  );
}