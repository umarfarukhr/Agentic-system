import React, { useState } from 'react';
import type { Tool } from '../types';
import { useTools } from '../contexts/ToolContext';
import { ToolConfigurationCard } from './ToolConfigurationCard';
import { ConfigurationModal } from './ConfigurationModal';

export function Integrations() {
  const { tools } = useTools();
  const [configuringTool, setConfiguringTool] = useState<Tool | null>(null);

  const handleConfigure = (tool: Tool) => {
    setConfiguringTool(tool);
  };

  const handleCloseModal = () => {
    setConfiguringTool(null);
  };

  return (
    <>
      <div className="p-6">
        <div className="pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Integrations</h2>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Connect and manage the tools available for AI agents to use in their execution plans.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {tools.map((tool) => (
            <ToolConfigurationCard
              key={tool.name}
              tool={tool}
              onConfigure={() => handleConfigure(tool)}
            />
          ))}
        </div>
      </div>
      {configuringTool && (
        <ConfigurationModal
          tool={configuringTool}
          isOpen={!!configuringTool}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}