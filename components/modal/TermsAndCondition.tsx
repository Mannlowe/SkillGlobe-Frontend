'use client';

import { X } from 'lucide-react';

interface TermsAndConditionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsAndCondition({ isOpen, onClose }: TermsAndConditionProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">1. Introduction</h3>
              <p className="text-gray-600">
                Welcome to SkillGlobe. These Terms of Service govern your use of our website and services. By accessing or using SkillGlobe, you agree to be bound by these Terms.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">2. Definitions</h3>
              <p className="text-gray-600">
                "User", "You", and "Your" refers to you, the person accessing this website and accepting the Company's terms and conditions.
              </p>
              <p className="text-gray-600">
                "Company", "Ourselves", "We", "Our" and "Us", refers to SkillGlobe.
              </p>
              <p className="text-gray-600">
                "Party", "Parties", or "Us", refers to both the User and ourselves, or either the User or ourselves.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">3. User Accounts</h3>
              <p className="text-gray-600">
                When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account on the Service.
              </p>
              <p className="text-gray-600">
                You are responsible for maintaining the confidentiality of your account and password, including but not limited to the restriction of access to your computer and/or account. You agree to accept responsibility for any and all activities or actions that occur under your account and/or password.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">4. Intellectual Property</h3>
              <p className="text-gray-600">
                The Service and its original content, features, and functionality are and will remain the exclusive property of SkillGlobe and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
              <p className="text-gray-600">
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of SkillGlobe.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">5. Termination</h3>
              <p className="text-gray-600">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-600">
                If you wish to terminate your account, you may simply discontinue using the Service, or notify us that you wish to delete your account.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">6. Limitation of Liability</h3>
              <p className="text-gray-600">
                In no event shall SkillGlobe, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">7. Changes to Terms</h3>
              <p className="text-gray-600">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>
          </div>
        </div>
        
      </div>
    </div>
  );
}