import React from 'react';
import type { MainView } from '../App';
import { BeakerIcon, Squares2X2Icon, CpuChipIcon } from '../constants';

interface SidebarProps {
  activeView: MainView;
  setActiveView: (view: MainView) => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`w-full flex flex-col items-center justify-center p-3 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
        aria-current={isActive ? 'page' : undefined}
    >
        <Icon className="h-6 w-6" />
        <span className="text-xs font-semibold mt-1.5">{label}</span>
    </button>
);

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  return (
    <div className="flex-shrink-0 w-24 bg-slate-900 border-r border-slate-800 p-3 flex flex-col items-center">
      <div className="mb-6">
        <BeakerIcon className="h-10 w-10 text-sky-500" />
      </div>
      <nav className="flex flex-col items-center space-y-3 w-full">
        <NavItem 
            icon={Squares2X2Icon}
            label="Agents"
            isActive={activeView === 'agents'}
            onClick={() => setActiveView('agents')}
        />
        <NavItem 
            icon={CpuChipIcon}
            label="Integrations"
            isActive={activeView === 'integrations'}
            onClick={() => setActiveView('integrations')}
        />
      </nav>
      <div className="mt-auto">
        <button className="p-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
        </button>
      </div>
    </div>
  );
}
