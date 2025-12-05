import React from 'react';
import type { HistoryItem } from '../types';
import { HistoryItemRole } from '../types';
import { UserIcon, BotIcon } from '../constants';

interface HistoryEntryProps {
  item: HistoryItem;
}

const roleConfig: Record<HistoryItemRole, { color: string; label: string }> = {
  [HistoryItemRole.USER]: { color: 'text-slate-800', label: 'USER' },
  [HistoryItemRole.AGENT]: { color: 'text-slate-800', label: 'AGENT' },
  [HistoryItemRole.SYSTEM]: { color: 'text-purple-600', label: 'SYSTEM' },
  [HistoryItemRole.TOOL_INPUT]: { color: 'text-cyan-600', label: 'TOOL_INPUT' },
  [HistoryItemRole.TOOL_OUTPUT]: { color: 'text-green-600', label: 'TOOL_OUTPUT' },
};

export function HistoryEntry({ item }: HistoryEntryProps) {
  const timestamp = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (item.role === HistoryItemRole.USER) {
    return (
      <div className="flex items-start justify-end">
        <div className="flex flex-col items-end max-w-lg">
          <div className="bg-blue-600 rounded-2xl rounded-br-lg px-4 py-2">
            <p className="text-sm text-white">{item.content}</p>
          </div>
          <span className="text-xs text-slate-400 mt-1">{timestamp}</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ml-3 flex-shrink-0">
          <UserIcon className="w-5 h-5 text-slate-500" />
        </div>
      </div>
    );
  }

  if (item.role === HistoryItemRole.AGENT) {
    return (
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 flex-shrink-0">
          <BotIcon className="w-5 h-5 text-slate-500" />
        </div>
        <div className="flex flex-col items-start max-w-lg">
          <div className="bg-slate-200 rounded-2xl rounded-bl-lg px-4 py-2">
            <p className="text-sm text-slate-700">{item.content}</p>
          </div>
          <span className="text-xs text-slate-400 mt-1">{timestamp}</span>
        </div>
      </div>
    );
  }

  const { color, label } = roleConfig[item.role];
  return (
    <div className="text-xs text-slate-500 flex items-start font-mono px-4">
      <span className="mr-3 mt-0.5">{timestamp}</span>
      <span className={`font-bold w-[75px] flex-shrink-0 ${color}`}>[{label}]</span>
      <p className={`flex-1 whitespace-pre-wrap break-all ${color}`}>{item.content}</p>
    </div>
  );
}