import React from 'react';
import type { Tool } from '../types';
import { useTools } from '../contexts/ToolContext';
import { useConfigurations } from '../contexts/ConfigurationContext';
import { ToggleSwitch } from './ToggleSwitch';
import { CheckCircleIcon, Cog6ToothIcon } from '../constants';

interface ToolConfigurationCardProps {
  tool: Tool;
  onConfigure: () => void;
}

export function ToolConfigurationCard({ tool, onConfigure }: ToolConfigurationCardProps) {
  const { toggleTool } = useTools();
  const { getConfiguration } = useConfigurations();

  const configuration = getConfiguration(tool.name);
  const isConfigured = configuration && Object.keys(configuration).some(key => configuration[key]);

  return (
    <div className={`bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col transition-opacity ${!tool.enabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <tool.icon className="w-6 h-6 text-sky-400 mr-3" />
          <h3 className="font-semibold text-slate-100">{tool.name}</h3>
        </div>
        <ToggleSwitch
          enabled={tool.enabled}
          onChange={() => toggleTool(tool.name)}
          srLabel={`Enable ${tool.name}`}
        />
      </div>
      <p className="text-sm text-slate-400 flex-1 mb-4">{tool.description}</p>
      <div className="flex items-center justify-between mt-auto">
        {isConfigured ? (
          <div className="flex items-center text-xs text-green-400">
            <CheckCircleIcon className="w-4 h-4 mr-1.5" />
            <span>Connected</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            <span>Not Configured</span>
          </div>
        )}
        <button
          onClick={onConfigure}
          disabled={!tool.enabled}
          className="flex items-center text-sm font-medium text-slate-300 hover:text-sky-400 bg-slate-800/60 hover:bg-slate-800 px-3 py-1 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700/50"
        >
          <Cog6ToothIcon className="w-4 h-4 mr-1.5" />
          {isConfigured ? 'Edit' : 'Configure'}
        </button>
      </div>
    </div>
  );
}