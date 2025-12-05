import React, { useState, useEffect, useRef } from 'react';
import type { Agent, Task, HistoryItem } from '../types';
import { AgentStatus, TaskStatus, HistoryItemRole } from '../types';
import { simulateAgentExecution } from '../services/orchestratorService';
import { replanAgentTasks, generateFollowUpTasks } from '../services/plannerService';
import { useAgents } from '../contexts/AgentContext';
import { useTools } from '../contexts/ToolContext';
import { Step } from './Step';
import { HistoryEntry } from './LogEntry';
import { Modal } from './Modal';
import { TagInput } from './TagInput';
import { statusDisplayConfig, PlayIcon, PauseIcon, StopIcon, TrashIcon, ArrowPathIcon, DocumentArrowDownIcon, PaperAirplaneIcon, PencilIcon, CheckIcon, XMarkIcon } from '../constants';

type DetailTab = 'plan' | 'activity';

export function AgentDetail() {
  const { selectedAgent, updateAgent, deleteAgent } = useAgents();
  const { tools } = useTools();
  const [agent, setAgent] = useState<Agent | null>(selectedAgent);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<DetailTab>('plan');
  
  const simulationControl = useRef<{ stop: () => void } | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAgent(selectedAgent);
    if (selectedAgent) {
        setEditedTags(selectedAgent.tags || []);
        setIsEditingTags(false);
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [agent?.history]);
  
  useEffect(() => {
    if (agent?.status === AgentStatus.RUNNING && !simulationControl.current) {
      simulationControl.current = simulateAgentExecution(agent, (updatedAgent) => {
        setAgent(updatedAgent);
        updateAgent(updatedAgent);
      });
    }

    return () => {
      if (simulationControl.current) {
        simulationControl.current.stop();
        simulationControl.current = null;
      }
    };
  }, [agent, updateAgent]);
  
  useEffect(() => {
    const handleReplanning = async () => {
        if (agent?.status === AgentStatus.REPLANNING && !isThinking) {
            setIsThinking(true);
            try {
                const newPlanTasks = await replanAgentTasks(agent, tools);
                
                const failedTaskIndex = agent.tasks.findIndex(t => t.status === TaskStatus.FAILED);
                if (failedTaskIndex === -1) throw new Error("Could not find failed task to replan from.");

                const newTasks: Task[] = newPlanTasks.map((task, index) => ({
                    ...task,
                    id: `task-${Date.now()}-${index}`,
                    status: TaskStatus.PENDING,
                    history: [],
                }));
                
                const updatedTasks = [...agent.tasks.slice(0, failedTaskIndex), ...newTasks];
                
                let replannedAgent: Agent = { ...agent, tasks: updatedTasks, status: AgentStatus.RUNNING };
                replannedAgent = addHistory(replannedAgent, HistoryItemRole.AGENT, "I've created a new plan to overcome the error.");

                setAgent(replannedAgent);
                updateAgent(replannedAgent);

            } catch (error) {
                console.error("Replanning failed:", error);
                let errorAgent: Agent = { ...agent, status: AgentStatus.ERROR };
                errorAgent = addHistory(errorAgent, HistoryItemRole.AGENT, `I failed to create a new plan. Error: ${error instanceof Error ? error.message : 'Unknown'}. I will stop execution.`);
                setAgent(errorAgent);
                updateAgent(errorAgent);
            } finally {
                setIsThinking(false);
            }
        }
    };

    handleReplanning();
  }, [agent, isThinking, updateAgent, tools]);

  if (!agent) {
    return <div className="flex-1 flex items-center justify-center"><p className="text-slate-500">No agent data available.</p></div>;
  }
  
  const addHistory = (currentAgent: Agent, role: HistoryItemRole, content: string): Agent => {
      const newHistoryItem: HistoryItem = { id: `hist-${Date.now()}`, timestamp: new Date().toISOString(), role, content };
      return { ...currentAgent, history: [...currentAgent.history, newHistoryItem] };
  };

  const handleControlClick = (newStatus: AgentStatus) => {
    let updatedAgent: Agent = { ...agent, status: newStatus };
    if (newStatus === AgentStatus.IDLE) { // Resetting/Stopping
      updatedAgent = {
        ...updatedAgent,
        tasks: agent.tasks.map(t => ({
          ...t,
          status: t.status === TaskStatus.COMPLETED ? TaskStatus.COMPLETED : TaskStatus.PENDING,
          history: [],
          result: undefined,
        })),
      };
      updatedAgent = addHistory(updatedAgent, HistoryItemRole.SYSTEM, "Agent execution stopped and reset by user.");
    }
    setAgent(updatedAgent);
    updateAgent(updatedAgent);
    if (simulationControl.current) {
      simulationControl.current.stop();
      simulationControl.current = null;
    }
  };

  const handleApproval = (taskId: string, approved: boolean) => {
    let updatedAgent: Agent = JSON.parse(JSON.stringify(agent));
    const task = updatedAgent.tasks.find((t: Task) => t.id === taskId);
    if (task) {
      task.status = approved ? TaskStatus.PENDING : TaskStatus.SKIPPED;
      updatedAgent.status = AgentStatus.RUNNING; // Resume execution
      updatedAgent = addHistory(updatedAgent, HistoryItemRole.SYSTEM, `Action for task "${task.name}" ${approved ? 'approved' : 'denied'} by user.`);
      setAgent(updatedAgent);
      updateAgent(updatedAgent);
    }
  };

  const handleDeleteConfirm = () => {
    deleteAgent(agent.id);
    setIsDeleteModalOpen(false);
  };

  const handleExportLogs = () => {
    let logContent = `Agent Name: ${agent.name}\nGoal: ${agent.goal}\nExported At: ${new Date().toISOString()}\n\n--- CHAT & ACTIVITY LOG ---\n\n`;
    agent.history.forEach(item => {
      logContent += `[${item.timestamp}] [${item.role}] ${item.content}\n`;
    });
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agent_${agent.name.replace(/\s+/g, '_')}_logs_${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = chatInput.trim();
    if (!message || isThinking) return;

    setIsThinking(true);
    setChatInput('');
    setActiveTab('activity');
    
    let updatedAgent = addHistory(agent, HistoryItemRole.USER, message);
    setAgent(updatedAgent);
    updateAgent(updatedAgent);

    try {
        const followUpTasks = await generateFollowUpTasks(updatedAgent, message, tools);
        const newTasks: Task[] = followUpTasks.map((task, index) => ({
            ...task,
            id: `task-${Date.now()}-${index}`,
            status: TaskStatus.PENDING,
            history: [],
        }));

        updatedAgent = { ...updatedAgent, tasks: [...updatedAgent.tasks, ...newTasks] };
        
        if (newTasks.length > 0) {
            updatedAgent = addHistory(updatedAgent, HistoryItemRole.AGENT, `Okay, I've added ${newTasks.length} new task(s) to my plan based on your request.`);
        } else {
             const enabledTools = tools.filter(t => t.enabled).length > 0;
             if (enabledTools) {
                updatedAgent = addHistory(updatedAgent, HistoryItemRole.AGENT, "I've received your message. I will continue with my current plan as no new actions are needed.");
             } else {
                updatedAgent = addHistory(updatedAgent, HistoryItemRole.AGENT, "I received your message, but I cannot perform any new actions because all tools are currently disabled.");
             }
        }

        setAgent(updatedAgent);
        updateAgent(updatedAgent);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        updatedAgent = addHistory(updatedAgent, HistoryItemRole.AGENT, `I'm sorry, I encountered an error trying to process that: ${errorMessage}`);
        setAgent(updatedAgent);
        updateAgent(updatedAgent);
    } finally {
        setIsThinking(false);
    }
  };

  const handleSaveTags = () => {
    if (agent) {
        const updatedAgent = { ...agent, tags: editedTags };
        updateAgent(updatedAgent);
        setAgent(updatedAgent);
        setIsEditingTags(false);
    }
  };

  const handleCancelEditTags = () => {
    if(agent) {
        setEditedTags(agent.tags || []);
    }
    setIsEditingTags(false);
  }

  const renderPlan = () => (
    <div className="p-6 relative">
      {isThinking && agent.status === AgentStatus.REPLANNING && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg">
              <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="mt-4 text-lg font-semibold text-slate-700">Re-planning...</p>
              <p className="text-sm text-slate-500">An error occurred. The agent is creating a new plan.</p>
          </div>
      )}
      <div className="relative pl-6">
           <div className="absolute left-[30px] top-0 bottom-0 w-0.5 bg-slate-200" aria-hidden="true"></div>
           {agent.tasks.map((task, index) => (
              <Step key={task.id} task={task} stepNumber={index + 1} onApproval={handleApproval} />
          ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="p-6 flex flex-col h-full">
        <div ref={chatHistoryRef} className="flex-1 space-y-4 overflow-y-auto pr-2 pb-4 -mr-2">
            {agent.history.length > 0 ? agent.history.map(item => <HistoryEntry key={item.id} item={item} />) : <p className="text-slate-500 text-sm p-4 text-center">No activity yet. Run the agent or send a message to get started.</p>}
            {isThinking && agent.status !== AgentStatus.REPLANNING && (
            <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3 flex-shrink-0"></div>
                <div className="flex flex-col items-start max-w-lg w-full">
                <div className="bg-slate-200 rounded-lg rounded-bl-none px-3 py-2 w-full animate-pulse">
                    <div className="h-4 bg-slate-300 rounded w-1/3"></div>
                </div>
                </div>
            </div>
            )}
        </div>
        <div className="mt-auto pt-4 border-t border-slate-200">
            <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
            <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={isThinking ? "Agent is thinking..." : "Ask a follow-up or give a new instruction..."}
                className="flex-1 w-full rounded-md border-0 bg-slate-100 py-1.5 px-3 text-slate-800 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
                disabled={isThinking}
            />
            <button type="submit" disabled={!chatInput.trim() || isThinking} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                <PaperAirplaneIcon className="w-5 h-5"/>
            </button>
            </form>
        </div>
    </div>
  );
  
  const statusConfig = statusDisplayConfig[agent.status];
  const StatusIcon = statusConfig.icon;

  return (
    <>
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-shrink-0 p-6 border-b border-slate-200">
          <div className="flex justify-between items-start">
              <div>
                  <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-bold text-slate-800">{agent.name}</h2>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border ${statusConfig.badgeClasses}`}>
                        <StatusIcon className="w-4 h-4 mr-1.5" />
                        {statusConfig.label}
                      </span>
                  </div>
                  <p className="text-slate-500 mt-1 max-w-2xl">{agent.goal}</p>
                  <div className="mt-3 flex items-center gap-3">
                    {isEditingTags ? (
                        <div className="flex-1">
                            <TagInput tags={editedTags} onTagsChange={setEditedTags} />
                        </div>
                    ) : (
                        <div className="flex items-center flex-wrap gap-2">
                            {(agent.tags && agent.tags.length > 0) ? agent.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                                    {tag}
                                </span>
                            )) : <p className="text-sm text-slate-500">No tags assigned.</p>}
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                    {isEditingTags ? (
                        <>
                            <button onClick={handleSaveTags} className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"><CheckIcon className="w-4 h-4"/></button>
                            <button onClick={handleCancelEditTags} className="p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"><XMarkIcon className="w-4 h-4"/></button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditingTags(true)} className="p-1.5 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 transition-colors"><PencilIcon className="w-4 h-4"/></button>
                    )}
                    </div>
                  </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button onClick={() => handleControlClick(AgentStatus.RUNNING)} disabled={agent.status === AgentStatus.RUNNING || agent.status === AgentStatus.FINISHED || isThinking} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><PlayIcon className="w-5 h-5"/></button>
                <button onClick={() => handleControlClick(AgentStatus.PAUSED)} disabled={agent.status !== AgentStatus.RUNNING} className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><PauseIcon className="w-5 h-5"/></button>
                <button onClick={() => handleControlClick(AgentStatus.IDLE)} disabled={agent.status === AgentStatus.IDLE} className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><StopIcon className="w-5 h-5"/></button>
                <div className="border-l border-slate-200 h-6 mx-2"></div>
                <button onClick={handleExportLogs} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"><DocumentArrowDownIcon className="w-5 h-5"/></button>
                <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"><TrashIcon className="w-5 h-5"/></button>
              </div>
          </div>
        </div>

        <div className="border-b border-slate-200 px-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button
                onClick={() => setActiveTab('plan')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === 'plan'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                >
                Execution Plan
                </button>
                <button
                onClick={() => setActiveTab('activity')}
                className={`whitespace-nowrap py-3 px-1 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === 'activity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                >
                Chat & Activity
                </button>
            </nav>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {activeTab === 'plan' ? renderPlan() : renderActivity()}
        </div>
      </div>
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteConfirm} title="Delete Agent" confirmText="Delete" isDestructive>
        <p className="text-sm text-slate-600">Are you sure you want to delete the agent "{agent.name}"? This action is permanent and cannot be undone.</p>
      </Modal>
    </>
  );
}