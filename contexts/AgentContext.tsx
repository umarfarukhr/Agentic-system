import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Agent } from '../types';
import { sampleAgents } from '../constants';

const LOCAL_STORAGE_KEY = 'agentic-ai-agents';

interface AgentContextType {
  agents: Agent[];
  selectedAgent: Agent | null;
  addAgent: (agent: Agent) => void;
  updateAgent: (updatedAgent: Agent) => void;
  deleteAgent: (agentId: string) => void;
  selectAgent: (agentId: string) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const savedAgents = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedAgents) {
        return JSON.parse(savedAgents);
      }
    } catch (error) {
      console.error("Error reading agents from localStorage:", error);
    }
    return sampleAgents;
  });
  
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(agents));
    } catch (error) {
      console.error("Error saving agents to localStorage:", error);
    }
  }, [agents]);

  useEffect(() => {
    if (!selectedAgent && agents.length > 0) {
      setSelectedAgent(agents[0]);
    } 
    else if (selectedAgent && !agents.some(a => a.id === selectedAgent.id)) {
        setSelectedAgent(agents.length > 0 ? agents[0] : null);
    }
    else if (agents.length === 0) {
        setSelectedAgent(null);
    }
  }, [agents, selectedAgent]);

  const addAgent = (agent: Agent) => {
    setAgents(prev => [agent, ...prev]);
    setSelectedAgent(agent);
  };

  const updateAgent = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
    if (selectedAgent && selectedAgent.id === updatedAgent.id) {
      setSelectedAgent(updatedAgent);
    }
  };

  const deleteAgent = (agentId: string) => {
    setAgents(prev => {
        const newAgents = prev.filter(a => a.id !== agentId);
        if (selectedAgent && selectedAgent.id === agentId) {
            setSelectedAgent(newAgents.length > 0 ? newAgents[0] : null);
        }
        return newAgents;
    });
  };

  const selectAgent = (agentId: string) => {
    const agentToSelect = agents.find(a => a.id === agentId);
    if (agentToSelect) {
      setSelectedAgent(agentToSelect);
    }
  };

  return (
    <AgentContext.Provider value={{ agents, selectedAgent, addAgent, updateAgent, deleteAgent, selectAgent }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgents() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentProvider');
  }
  return context;
}