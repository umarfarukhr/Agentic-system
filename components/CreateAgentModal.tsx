import React, { useState, useEffect } from 'react';
import type { Agent } from '../types';
import { AgentStatus, TaskStatus, HistoryItemRole } from '../types';
import { createAgentPlan } from '../services/plannerService';
import { agentTemplates, ExclamationCircleIcon, CheckCircleIcon, PlusIcon } from '../constants';
import { useAgents } from '../contexts/AgentContext';
import { useTools } from '../contexts/ToolContext';
import { TagInput } from './TagInput';
import { Modal } from './Modal';

const MIN_PROMPT_LENGTH = 20;
const MAX_PROMPT_LENGTH = 280;

interface CreateAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAgentModal({ isOpen, onClose }: CreateAgentModalProps) {
  const { addAgent } = useAgents();
  const { tools } = useTools();
  const [prompt, setPrompt] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!isOpen) {
        // Reset state when modal is closed
        setTimeout(() => {
            setPrompt('');
            setTags([]);
            setError(null);
            setIsLoading(false);
            setIsSuccess(false);
        }, 300); // Allow for closing animation
    }
  }, [isOpen]);

  useEffect(() => {
    if (prompt.trim().length >= MIN_PROMPT_LENGTH && error) {
      setError(null);
    }
  }, [prompt, error]);

  const handleCreateAgent = async () => {
    setError(null);
    const trimmedPrompt = prompt.trim();
    
    if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
      setError(`Please provide a more detailed goal (at least ${MIN_PROMPT_LENGTH} characters).`);
      return;
    }
    if (isLoading || isSuccess) return;

    setIsLoading(true);
    try {
      const planTasks = await createAgentPlan(trimmedPrompt, tools);
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: trimmedPrompt.substring(0, 30) + (trimmedPrompt.length > 30 ? '...' : ''),
        goal: trimmedPrompt,
        status: AgentStatus.IDLE,
        createdAt: new Date().toISOString(),
        tasks: planTasks.map((task, index) => ({
          ...task,
          id: `task-${Date.now()}-${index}`,
          status: TaskStatus.PENDING,
          history: [],
        })),
        history: [
            {
                id: `hist-${Date.now()}`,
                timestamp: new Date().toISOString(),
                role: HistoryItemRole.SYSTEM,
                content: `Agent created with goal: "${trimmedPrompt}"`,
            }
        ],
        tags: tags,
      };
      addAgent(newAgent);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500); // Close modal after success animation
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  const isPromptValid = prompt.trim().length >= MIN_PROMPT_LENGTH;

  const confirmButtonContent = () => {
    if (isLoading) {
        return (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Plan...
          </>
        );
    }
    if (isSuccess) {
        return (
            <>
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                Agent Created!
            </>
        );
    }
    return (
        <>
            <PlusIcon className="w-5 h-5 mr-2" />
            Create Agent
        </>
    );
  };
  
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={handleCreateAgent}
        title="Create New Agent"
        confirmText={confirmButtonContent()}
        size="lg"
    >
        <div className="space-y-4">
            <div>
                <label htmlFor="agent-goal" className="block text-sm font-medium text-slate-700 mb-1">Agent Goal</label>
                <textarea
                    id="agent-goal"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a detailed goal for your agent..."
                    className={`w-full p-2 bg-white border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 text-sm resize-none transition-colors ${
                        error ? 'border-red-500/70' : 'border-slate-300'
                    }`}
                    rows={4}
                    disabled={isLoading || isSuccess}
                    maxLength={MAX_PROMPT_LENGTH}
                    aria-invalid={!!error}
                    aria-describedby="prompt-error"
                />
                 <div id="prompt-error" className="flex justify-between items-center mt-1 px-1 min-h-[16px]">
                    {error ? (
                        <p className="text-red-600 text-xs flex items-center flex-1">
                            <ExclamationCircleIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                            <span>{error}</span>
                        </p>
                    ) : <div className="flex-1" />}
                    <span className={`text-xs font-mono ${prompt.length > MAX_PROMPT_LENGTH - 20 ? 'text-yellow-600' : 'text-slate-500'}`}>
                        {prompt.length}/{MAX_PROMPT_LENGTH}
                    </span>
                </div>
            </div>
             <div>
                <label htmlFor="agent-tags" className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <TagInput tags={tags} onTagsChange={setTags} placeholder="Add tags... (e.g., sre, prod)" />
             </div>
             <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Or, start with a template</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                    {agentTemplates.map((template) => (
                    <button
                        key={template.name}
                        onClick={() => {
                        setPrompt(template.goal);
                        setError(null);
                        }}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading || isSuccess}
                    >
                        <p className="font-semibold text-sm text-slate-700">{template.name}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">{template.goal}</p>
                    </button>
                    ))}
                </div>
            </div>
        </div>
    </Modal>
  );
}