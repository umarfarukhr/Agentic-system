import React, { Fragment } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
  // FIX: Changed confirmText type from `string` to `React.ReactNode` to allow for JSX content in the button.
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
      
      <div className={`relative bg-slate-900 rounded-lg shadow-xl border border-slate-800 w-full m-4 ${sizeClasses[size]}`}>
        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold leading-6 text-white" id="modal-title">
            {title}
          </h3>
          <div className="mt-2">
            {children}
          </div>
        </div>
        <div className="bg-slate-900/50 px-6 py-3 flex flex-row-reverse space-x-2 space-x-reverse rounded-b-lg">
          <button
            type="button"
            className={`inline-flex items-center w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto transition-colors
              ${isDestructive 
                ? 'bg-red-600 hover:bg-red-500' 
                : 'bg-sky-600 hover:bg-sky-500'}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-slate-800/50 px-3 py-2 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-700 sm:mt-0 sm:w-auto transition-colors"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}