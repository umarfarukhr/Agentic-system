import React from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import {
  CheckCircleIcon, ExclamationCircleIcon, ClockIcon, HandRaisedIcon, CheckIcon, XMarkIcon, BeakerIcon, toolLibrary
} from '../constants';

interface StepProps {
  task: Task;
  stepNumber: number;
  onApproval: (taskId: string, approved: boolean) => void;
}

const statusConfig = {
  [TaskStatus.COMPLETED]: { icon: CheckCircleIcon, iconColor: 'text-green-400', ringColor: 'ring-green-500/30' },
  [TaskStatus.FAILED]: { icon: ExclamationCircleIcon, iconColor: 'text-red-400', ringColor: 'ring-red-500/30' },
  [TaskStatus.IN_PROGRESS]: { icon: ClockIcon, iconColor: 'text-sky-400 animate-spin', ringColor: 'ring-sky-500/30' },
  [TaskStatus.AWAITING_APPROVAL]: { icon: HandRaisedIcon, iconColor: 'text-yellow-400', ringColor: 'ring-yellow-500/30' },
  [TaskStatus.PENDING]: { icon: ClockIcon, iconColor: 'text-slate-500', ringColor: 'ring-slate-500/30' },
  [TaskStatus.SKIPPED]: { icon: ExclamationCircleIcon, iconColor: 'text-slate-400', ringColor: 'ring-slate-500/30' },
};

export function Step({ task, stepNumber, onApproval }: StepProps) {
  const config = statusConfig[task.status];
  const Icon = config.icon;
  const ToolIcon = toolLibrary.find(t => t.name === task.tool)?.icon || BeakerIcon;

  const isFinished = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED;

  return (
    <div className="relative flex items-start pb-8">
      <div className="flex-shrink-0">
        <div className={`relative h-11 w-11 flex items-center justify-center rounded-full bg-slate-800 ring-4 ${config.ringColor}`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
      </div>
      <div className="ml-4 min-w-0 flex-1 pt-1.5">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-100">{task.name}</h4>
            <span className="text-xs font-mono bg-slate-800 border border-slate-700/50 px-2 py-1 rounded-full flex items-center text-slate-300">
              <ToolIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {task.tool}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">{task.description}</p>

          {task.status === TaskStatus.AWAITING_APPROVAL && (
            <div className="mt-3 flex space-x-3">
              <button onClick={() => onApproval(task.id, true)} className="flex items-center justify-center text-sm font-semibold px-3 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-300 rounded-md transition-colors">
                <CheckIcon className="w-4 h-4 mr-1.5"/> Approve
              </button>
              <button onClick={() => onApproval(task.id, false)} className="flex items-center justify-center text-sm font-semibold px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-md transition-colors">
                <XMarkIcon className="w-4 h-4 mr-1.5"/> Deny
              </button>
            </div>
          )}
          
          {isFinished && task.result && (
            <div className="mt-3">
                <div className="bg-slate-900/70 p-3 rounded-md border border-slate-800">
                    <p className={`text-xs font-semibold mb-1 ${task.status === TaskStatus.FAILED ? 'text-red-400' : 'text-green-400'}`}>
                        {task.status === TaskStatus.FAILED ? 'Error Details' : 'Result Output'}
                    </p>
                    <pre className="text-xs text-slate-300 whitespace-pre-wrap break-all overflow-x-auto font-mono">
                        {task.result}
                    </pre>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}