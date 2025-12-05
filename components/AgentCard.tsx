import React from 'react';
import type { Agent } from '../types';
import { statusDisplayConfig } from '../constants';

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onClick: () => void;
}

export function AgentCard({ agent, isSelected, onClick }: AgentCardProps) {
  const completedTasks = agent.tasks.filter(t => t.status === 'COMPLETED').length;
  const totalTasks = agent.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const statusConfig = statusDisplayConfig[agent.status];
  const StatusIcon = statusConfig.icon;

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 relative overflow-hidden ${
        isSelected 
        ? 'bg-slate-700/50 border-sky-500 shadow-2xl shadow-sky-900/50' 
        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50'
      }`}
    >
      {isSelected && (
         <div className="absolute -top-1 -left-1 w-1/2 h-1/2 bg-sky-500/20 blur-3xl" />
      )}
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-100 truncate pr-4">{agent.name}</p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.badgeClasses}`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
          {statusConfig.label}
        </span>
      </div>
      <p className="text-sm text-slate-400 mt-1 truncate">{agent.goal}</p>

      {agent.tags && agent.tags.length > 0 && (
        <div className="mt-3 flex items-center flex-wrap gap-1.5">
          {agent.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="text-xs font-medium text-slate-400">
              + {agent.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} Tasks</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="bg-sky-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}