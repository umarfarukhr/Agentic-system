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
  [TaskStatus.COMPLETED]: { icon: CheckCircleIcon, iconColor: 'text-green-500', ringColor: 'ring-green-500/20' },
  [TaskStatus.FAILED]: { icon: ExclamationCircleIcon, iconColor: 'text-red-500', ringColor: 'ring-red-500/20' },
  [TaskStatus.IN_PROGRESS]: { icon: ClockIcon, iconColor: 'text-blue-500 animate-spin', ringColor: 'ring-blue-500/20' },
  [TaskStatus.AWAITING_APPROVAL]: { icon: HandRaisedIcon, iconColor: 'text-yellow-500', ringColor: 'ring-yellow-500/20' },
  [TaskStatus.PENDING]: { icon: ClockIcon, iconColor: 'text-slate-500', ringColor: 'ring-slate-500/20' },
  [TaskStatus.SKIPPED]: { icon: ExclamationCircleIcon, iconColor: 'text-slate-400', ringColor: 'ring-slate-500/20' },
};

export function Step({ task, stepNumber, onApproval }: StepProps) {
  const config = statusConfig[task.status];
  const Icon = config.icon;
  const ToolIcon = toolLibrary.find(t => t.name === task.tool)?.icon || BeakerIcon;

  const isFinished = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.FAILED;

  return (
    <div className="relative flex items-start pb-8">
      <div className="flex-shrink-0">
        <div className={`relative h-11 w-11 flex items-center justify-center rounded-full bg-white ring-4 ${config.ringColor}`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
      </div>
      <div className="ml-4 min-w-0 flex-1 pt-1.5">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-slate-800">{task.name}</h4>
            <span className="text-xs font-mono bg-slate-100 border border-slate-200 px-2 py-1 rounded-full flex items-center text-slate-600">
              <ToolIcon className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {task.tool}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{task.description}</p>

          {task.status === TaskStatus.AWAITING_APPROVAL && (
            <div className="mt-3 flex space-x-3">
              <button onClick={() => onApproval(task.id, true)} className="flex items-center justify-center text-sm font-semibold px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors">
                <CheckIcon className="w-4 h-4 mr-1.5"/> Approve
              </button>
              <button onClick={() => onApproval(task.id, false)} className="flex items-center justify-center text-sm font-semibold px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors">
                <XMarkIcon className="w-4 h-4 mr-1.5"/> Deny
              </button>
            </div>
          )}
          
          {isFinished && task.result && (
            <div className="mt-3">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200">
                    <p className={`text-xs font-semibold mb-1 ${task.status === TaskStatus.FAILED ? 'text-red-600' : 'text-green-600'}`}>
                        {task.status === TaskStatus.FAILED ? 'Error Details' : 'Result Output'}
                    </p>
                    <pre className="text-xs text-slate-600 whitespace-pre-wrap break-all overflow-x-auto font-mono">
                        {task.result}
                    </pre>
                </div>
            </div>
          )}
      </div>
    </div>
  );
}