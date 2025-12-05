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
    const newHistoryItem: HistoryItem = { id: `hist-${Date.now()}-${Math.random()}`, timestamp: new Date().toISOString(), role, content, taskId };
    const newAgent = JSON.parse(JSON.stringify(agent));
    
    const task = taskId ? newAgent.tasks.find((t: any) => t.id === taskId) : null;
    if (task) {
      task.history.push(newHistoryItem);
    }
    newAgent.history.push(newHistoryItem);
    return newAgent;
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
      let stateAfterFirstTimeout = JSON.parse(JSON.stringify(agentState));

      if (task.requiresApproval) {
        task.status = TaskStatus.AWAITING_APPROVAL;
        stateAfterFirstTimeout.status = AgentStatus.PAUSED;
        stateAfterFirstTimeout = addHistory(stateAfterFirstTimeout, HistoryItemRole.SYSTEM, `Human approval required to proceed.`, task.id);
        onUpdate(stateAfterFirstTimeout);
      } else {
        stateAfterFirstTimeout = addHistory(stateAfterFirstTimeout, HistoryItemRole.TOOL_INPUT, `Executing tool ${task.tool} with params...`, task.id);
        onUpdate(stateAfterFirstTimeout);
        
        timeoutId = window.setTimeout(() => {
            let stateAfterSecondTimeout = JSON.parse(JSON.stringify(stateAfterFirstTimeout));
            const currentTaskInState = stateAfterSecondTimeout.tasks[currentTaskIndex];
            
            const success = Math.random() > 0.15; // 85% success rate
            if (success) {
                currentTaskInState.status = TaskStatus.COMPLETED;
                currentTaskInState.result = `Tool ${task.tool} executed successfully. Output: { "status": "ok" }`;
                stateAfterSecondTimeout = addHistory(stateAfterSecondTimeout, HistoryItemRole.TOOL_OUTPUT, currentTaskInState.result, task.id);
                stateAfterSecondTimeout = addHistory(stateAfterSecondTimeout, HistoryItemRole.SYSTEM, 'Task completed successfully.', task.id);
            } else {
                currentTaskInState.status = TaskStatus.FAILED;
                currentTaskInState.result = `Tool ${task.tool} failed. Error: Connection timed out.`;
                stateAfterSecondTimeout = addHistory(stateAfterSecondTimeout, HistoryItemRole.SYSTEM, currentTaskInState.result, task.id);
                stateAfterSecondTimeout.status = AgentStatus.REPLANNING;
            }
            onUpdate(stateAfterSecondTimeout);
            
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