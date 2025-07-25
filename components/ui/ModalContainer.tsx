'use client';

import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModals } from '@/store/uiStore';

export function ModalContainer() {
  const { modals, closeModal } = useModals();

  if (modals.length === 0) return null;

  return (
    <>
      {modals.map((modal, index) => (
        <div key={modal.id} className="relative z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={modal.closable !== false ? () => closeModal(modal.id) : undefined}
            style={{ zIndex: 50 + index }}
          />
          
          {/* Modal */}
          <div 
            className="fixed inset-0 overflow-y-auto"
            style={{ zIndex: 51 + index }}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className={cn(
                "relative bg-white rounded-lg shadow-xl transform transition-all",
                "animate-in fade-in zoom-in-95 duration-200",
                {
                  'max-w-sm': modal.size === 'sm',
                  'max-w-md': modal.size === 'md',
                  'max-w-lg': modal.size === 'lg',
                  'max-w-4xl': modal.size === 'xl',
                  'max-w-full h-full': modal.size === 'full'
                }
              )}>
                {/* Close button */}
                {modal.closable !== false && (
                  <button
                    onClick={() => closeModal(modal.id)}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                
                {/* Modal content */}
                <modal.component {...modal.props} onClose={() => closeModal(modal.id)} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}