import React from 'react';
import { X, CheckCircle } from 'lucide-react';

interface BusinessProfileSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function BusinessProfileSuccessModal({ 
  isOpen, 
  onClose, 
  message = "Business Profile added successfully" 
}: BusinessProfileSuccessModalProps) {
  if (!isOpen) return null;

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
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="text-green-500" size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Success!
          </h3>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <button
            onClick={(e) => {
              e.preventDefault(); // Prevent default behavior
              onClose(); // Just close the modal without redirection
            }}
            className="bg-blue-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
