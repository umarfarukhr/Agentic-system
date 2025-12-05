import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: React.ReactNode;
  cancelText?: string;
  isDestructive?: boolean;
  size?: 'md' | 'lg' | 'xl';
}

export function Modal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  isDestructive = false,
  size = 'md'
}: ModalProps) {
  if (!isOpen) {
    return null;
  }
  
  const sizeClasses: Record<typeof size, string> = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
      
      <div className={`relative bg-white rounded-lg shadow-xl border border-slate-200 w-full m-4 ${sizeClasses[size]}`}>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold leading-6 text-slate-900" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            {children}
          </div>
        </div>
        <div className="bg-slate-50 px-6 py-3 flex flex-row-reverse space-x-2 space-x-reverse rounded-b-lg">
          <button
            type="button"
            className={`inline-flex items-center w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors
              ${isDestructive 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-blue-600 hover:bg-blue-500'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}