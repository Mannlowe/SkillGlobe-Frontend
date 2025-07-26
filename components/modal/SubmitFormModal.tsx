'use client';

import { X, CheckCircle } from 'lucide-react';

interface SubmitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function SubmitFormModal({ isOpen, onClose, onSubmit }: SubmitFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">Submission Successful</h3>
          {/* <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X size={20} />
          </button> */}
        </div>

        <div className="p-6 flex flex-col items-center text-center">
          <CheckCircle size={48} className="text-green-500 mb-4" />
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Your form has been submitted!
          </h4>
          <p className="text-sm text-gray-600 mb-6">
            We’ve received your details and will get back to you shortly.
          </p>
          <button
            onClick={() => {
            //   onSubmit();
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
