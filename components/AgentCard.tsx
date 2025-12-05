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
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border relative overflow-hidden bg-white ${
        isSelected 
        ? 'border-blue-500 shadow-lg' 
        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-800 truncate pr-4">{agent.name}</p>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${statusConfig.badgeClasses}`}>
          <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
          {statusConfig.label}
        </span>
      </div>
      <p className="text-sm text-slate-500 mt-1 truncate">{agent.goal}</p>

      {agent.tags && agent.tags.length > 0 && (
        <div className="mt-3 flex items-center flex-wrap gap-1.5">
          {agent.tags.slice(0, 3).map(tag => (
            <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
              {tag}
            </span>
          ))}
          {agent.tags.length > 3 && (
            <span className="text-xs font-medium text-slate-500">
              + {agent.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} Tasks</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}