import React, { useState } from 'react';
import { AgentDetail } from './components/AgentDetail';
import { Header } from './components/Header';
import { AgentProvider, useAgents } from './contexts/AgentContext';
import { ToolProvider } from './contexts/ToolContext';
import { ConfigurationProvider } from './contexts/ConfigurationContext';
import { Integrations } from './components/Integrations';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BeakerIcon } from './constants';

export type MainView = 'agents' | 'integrations';

function AppContent() {
  const { selectedAgent } = useAgents();
  const [activeView, setActiveView] = useState<MainView>('agents');

  const renderMainContent = () => {
    if (activeView === 'integrations') {
      return <Integrations />;
    }

    if (activeView === 'agents') {
      if (selectedAgent) {
        return <AgentDetail key={selectedAgent.id} />;
      }
      return (
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-center">
             <BeakerIcon className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-400">No Agent Selected</h2>
            <p className="text-slate-500 mt-2 max-w-sm">Select an agent from the list to see its details, or create a new one to get started.</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full bg-slate-950/80 text-slate-100 font-sans antialiased">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      {activeView === 'agents' && (
        <div className="w-[350px] flex-shrink-0 border-r border-slate-800 overflow-y-auto">
          <Dashboard />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeView={activeView} />
        <main className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToolProvider>
      <ConfigurationProvider>
        <AgentProvider>
          <AppContent />
        </AgentProvider>
      </ConfigurationProvider>
    </ToolProvider>
  );
}