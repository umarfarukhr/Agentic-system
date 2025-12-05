import React from 'react';
import type { MainView } from '../App';

interface HeaderProps {
    activeView: MainView;
}

export function Header({ activeView }: HeaderProps) {
  const viewTitles: Record<MainView, string> = {
    agents: 'Agents',
    integrations: 'Integrations',
  };

  return (
    <header className="flex-shrink-0 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold tracking-tight text-slate-100">{viewTitles[activeView]}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </button>
            <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User profile"/>
          </div>
        </div>
      </div>
    </header>
  );
}