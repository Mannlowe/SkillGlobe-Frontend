'use client';

import { X, CheckCircle } from 'lucide-react';

interface SubmitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  portfolioData?: any;
}

export default function SubmitFormModal({ isOpen, onClose, onSubmit, portfolioData }: SubmitFormModalProps) {
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
          
          {/* {portfolioData && (
            <div className="w-full text-left bg-gray-50 p-4 rounded-lg mb-4 overflow-auto max-h-60">
              <h5 className="font-medium text-gray-700 mb-2">Portfolio Data Summary:</h5>
              <div className="text-xs text-gray-600 font-mono">

                {typeof portfolioData.message === 'object' ? (
                  <p className="text-green-600 mb-2">
                    {portfolioData.message?.status || ''}
                    {portfolioData.message?.message_text ? `: ${portfolioData.message.message_text}` : ''}
                  </p>
                ) : typeof portfolioData.message === 'string' ? (
                  <p className="text-green-600 mb-2">{portfolioData.message}</p>
                ) : null}
                

                <p className="mb-2">Status: <span className="font-medium">{portfolioData.status || 'Unknown'}</span></p>
                
                
                {portfolioData.data && typeof portfolioData.data === 'object' && (
                  <div className="mt-2">
                    <p className="font-medium mb-1">Data:</p>
                    <ul className="space-y-1 pl-2">
                      {Object.entries(portfolioData.data).map(([key, value]: [string, any]) => (
                        <li key={key} className="flex flex-wrap">
                          <span className="font-medium mr-2">{key}:</span>
                          <span>
                            {typeof value === 'object' 
                              ? JSON.stringify(value).substring(0, 50) + (JSON.stringify(value).length > 50 ? '...' : '')
                              : String(value)
                            }
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
          
                {portfolioData.exception && (
                  <div className="mt-2 text-red-500">
                    <p className="font-medium">Error:</p>
                    <p>{portfolioData.exception}</p>
                    {portfolioData.exc_type && <p>Type: {portfolioData.exc_type}</p>}
                  </div>
                )}
              </div>
            </div>
          )} */}
          
          <p className="text-sm text-gray-600 mb-6">
            We&apos;ve received your details and will process it.
          </p>
          <div className="flex space-x-4">
            {/* <button
              onClick={() => {
                onSubmit();
                onClose();
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Continue
            </button> */}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white text-white bg-orange-500  rounded-lg hover:bg-white hover:text-orange-500 hover:border-orange-500 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
