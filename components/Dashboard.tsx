import React, { useState } from 'react';
import { AgentCard } from './AgentCard';
import { PlusIcon, BeakerIcon, MagnifyingGlassIcon } from '../constants';
import { useAgents } from '../contexts/AgentContext';
import { CreateAgentModal } from './CreateAgentModal';

export function Dashboard() {
  const { agents, selectedAgent, selectAgent } = useAgents();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.toLowerCase();
    return agent.name.toLowerCase().includes(query) ||
           agent.goal.toLowerCase().includes(query) ||
           (agent.tags && agent.tags.some(tag => tag.toLowerCase().includes(query)));
  });
  
  return (
    <>
    <div className="p-4 flex flex-col h-full">
      <div className="flex-shrink-0 pb-4 border-b border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-slate-800">Active Agents</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center font-semibold text-sm py-2 px-3 rounded-md transition-colors duration-200 text-white bg-blue-600 hover:bg-blue-500 shadow-md hover:shadow-lg"
            >
              <PlusIcon className="w-5 h-5 mr-1.5" />
              New Agent
            </button>
          </div>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-md border-0 bg-white py-1.5 pl-9 text-slate-800 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Search agents or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>
      
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 -mr-4 mt-4 pl-1">
          {filteredAgents.length > 0 ? (
            filteredAgents.map(agent => (
                <AgentCard
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent?.id === agent.id}
                onClick={() => selectAgent(agent.id)}
                />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-4 border-2 border-dashed border-slate-300 rounded-lg">
                {agents.length > 0 && searchQuery ? (
                    <>
                        <MagnifyingGlassIcon className="w-12 h-12 text-slate-400 mb-2" />
                        <h3 className="font-semibold text-slate-600">No Agents Found</h3>
                        <p className="text-sm">Your search for "{searchQuery}" did not match any agents.</p>
                    </>
                ) : (
                    <>
                        <BeakerIcon className="w-12 h-12 text-slate-400 mb-2" />
                        <h3 className="font-semibold text-slate-600">No active agents</h3>
                        <p className="text-sm">Create an agent to get started.</p>
                    </>
                )}
            </div>
          )}
        </div>
    </div>
    <CreateAgentModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  );
}