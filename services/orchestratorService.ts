import type { Agent, HistoryItem } from '../types';
import { TaskStatus, HistoryItemRole, AgentStatus } from '../types';

/**
 * Simulates the execution of an agent's task list.
 */
export function simulateAgentExecution(
  agent: Agent,
  onUpdate: (updatedAgent: Agent) => void
) {
  let currentTaskIndex = agent.tasks.findIndex(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.IN_PROGRESS);
  if (currentTaskIndex === -1) currentTaskIndex = 0;

  let isRunning = true;
  let timeoutId: number | null = null;

  const addHistory = (agent: Agent, role: HistoryItemRole, content: string, taskId?: string): Agent => {
    const newHistoryItem: HistoryItem = { id: `hist-${Date.now()}`, timestamp: new Date().toISOString(), role, content, taskId };
    const task = taskId ? agent.tasks.find(t => t.id === taskId) : null;
    if (task) {
      task.history.push(newHistoryItem);
    }
    agent.history.push(newHistoryItem);
    return agent;
  };
  
  const runStep = () => {
    let agentState: Agent = JSON.parse(JSON.stringify(agent));
    
    if (!isRunning || currentTaskIndex >= agentState.tasks.length) {
      agentState.status = currentTaskIndex >= agentState.tasks.length ? AgentStatus.FINISHED : AgentStatus.PAUSED;
      if (agentState.status === AgentStatus.FINISHED) {
        agentState = addHistory(agentState, HistoryItemRole.SYSTEM, 'All tasks completed.');
      }
      onUpdate(agentState);
      return;
    }

    const task = agentState.tasks[currentTaskIndex];

    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.SKIPPED || task.status === TaskStatus.FAILED) {
        currentTaskIndex++;
        runStep();
        return;
    }

    task.status = TaskStatus.IN_PROGRESS;
    agentState = addHistory(agentState, HistoryItemRole.SYSTEM, `Task started: ${task.name}`, task.id);
    onUpdate(agentState);

    timeoutId = window.setTimeout(() => {
      if (task.requiresApproval) {
        task.status = TaskStatus.AWAITING_APPROVAL;
        agentState = addHistory(agentState, HistoryItemRole.SYSTEM, `Human approval required to proceed.`, task.id);
        onUpdate(agentState);
      } else {
        agentState = addHistory(agentState, HistoryItemRole.TOOL_INPUT, `Executing tool ${task.tool} with params...`, task.id);
        onUpdate(agentState);
        
        timeoutId = window.setTimeout(() => {
            const success = Math.random() > 0.15; // 85% success rate
            if (success) {
                task.status = TaskStatus.COMPLETED;
                task.result = `Tool ${task.tool} executed successfully. Output: { "status": "ok" }`;
                agentState = addHistory(agentState, HistoryItemRole.TOOL_OUTPUT, task.result, task.id);
                agentState = addHistory(agentState, HistoryItemRole.SYSTEM, 'Task completed successfully.', task.id);
            } else {
                task.status = TaskStatus.FAILED;
                task.result = `Tool ${task.tool} failed. Error: Connection timed out.`;
                agentState = addHistory(agentState, HistoryItemRole.SYSTEM, task.result, task.id);
                agentState.status = AgentStatus.REPLANNING;
            }
            onUpdate(agentState);
            
            if (success) {
                currentTaskIndex++;
                timeoutId = window.setTimeout(runStep, 1500);
            }
        }, 2000);
      }
    }, 1500);
  };

  runStep();

  return {
    stop: () => {
      isRunning = false;
      if (timeoutId) clearTimeout(timeoutId);
    },
  };
}
