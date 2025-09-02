import React from 'react';
import { X, CheckCircle, Send } from 'lucide-react';

interface SkillsSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillCount?: number;
  type?: 'skills' | 'application';
  jobTitle?: string;
  companyName?: string;
}

export default function SkillsSuccessModal({ 
  isOpen, 
  onClose, 
  skillCount = 0, 
  type = 'skills',
  jobTitle,
  companyName 
}: SkillsSuccessModalProps) {
  if (!isOpen) return null;

  const isApplicationSuccess = type === 'application';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 ${isApplicationSuccess ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mb-4`}>
            {isApplicationSuccess ? (
              <Send className="text-blue-500" size={32} />
            ) : (
              <CheckCircle className="text-green-500" size={32} />
            )}
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isApplicationSuccess ? 'Application Submitted Successfully!' : 'Skills Added Successfully!'}
          </h3>
          
          <p className="text-gray-600 mb-6">
            {isApplicationSuccess ? (
              <>
                You have successfully applied for the <span className="font-medium">{jobTitle}</span> position at <span className="font-medium">{companyName}</span>. 
                <br />
                <span className="text-sm text-gray-500 mt-2 block">We'll notify you when the employer responds.</span>
              </>
            ) : (
              `You have successfully added ${skillCount} skill${skillCount !== 1 ? 's' : ''} to your profile.`
            )}
          </p>
          
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior
              onClose(); // Just close the modal without redirection
            }}
            className={`${isApplicationSuccess ? 'bg-[#007BCA]' : 'bg-green-500 hover:bg-green-600'} text-white font-medium py-2 px-6 rounded-lg transition-colors`}
          >
            {isApplicationSuccess ? 'Got it!' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
