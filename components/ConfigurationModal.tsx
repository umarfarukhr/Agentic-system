import React, { useState, useEffect } from 'react';
import type { Tool } from '../types';
import { Modal } from './Modal';
import { useConfigurations } from '../contexts/ConfigurationContext';

interface ConfigurationModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigurationModal({ tool, isOpen, onClose }: ConfigurationModalProps) {
  const { saveConfiguration, getConfiguration } = useConfigurations();
  const [formState, setFormState] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const existingConfig = getConfiguration(tool.name) || {};
      const initialState = tool.configurationFields.reduce((acc, field) => {
        acc[field.name] = existingConfig[field.name] || '';
        return acc;
      }, {} as Record<string, string>);
      setFormState(initialState);
    }
  }, [isOpen, tool, getConfiguration]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    saveConfiguration(tool.name, formState);
    onClose();
  };

  if (tool.configurationFields.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onClose}
        title={`Configure ${tool.name}`}
        confirmText="Done"
      >
        <p className="text-sm text-slate-300">This tool does not require any specific client-side configuration. It is managed by the system administrator on the backend.</p>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={`Configure ${tool.name}`}
      confirmText="Save Configuration"
    >
      <div className="space-y-4">
        <p className="text-sm text-slate-400">
          Enter the required credentials to connect to the {tool.name} API. Credentials are saved securely in your browser's local storage.
        </p>
        {tool.configurationFields.map(field => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-300">
              {field.label}
            </label>
            <div className="mt-1">
              <input
                type={field.type}
                name={field.name}
                id={field.name}
                className="block w-full rounded-md border-0 bg-slate-800 py-1.5 px-3 text-slate-200 ring-1 ring-inset ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm"
                placeholder={field.placeholder || ''}
                value={formState[field.name] || ''}
                onChange={handleChange}
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}