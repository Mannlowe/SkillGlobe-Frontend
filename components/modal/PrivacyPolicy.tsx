'use client';

import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
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
                At SkillGlobe, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">2. The Data We Collect</h3>
              <p className="text-gray-600">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Identity Data includes first name, last name, username or similar identifier.</li>
                <li>Contact Data includes email address and telephone numbers.</li>
                <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version.</li>
                <li>Profile Data includes your username and password, your interests, preferences, feedback and survey responses.</li>
                <li>Usage Data includes information about how you use our website and services.</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">3. How We Use Your Data</h3>
              <p className="text-gray-600">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">4. Data Security</h3>
              <p className="text-gray-600">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">5. Data Retention</h3>
              <p className="text-gray-600">
                We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
              </p>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">6. Your Legal Rights</h3>
              <p className="text-gray-600">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h3 className="text-xl font-semibold text-gray-800">7. Changes to the Privacy Policy</h3>
              <p className="text-gray-600">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}