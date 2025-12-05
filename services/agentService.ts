import { GoogleGenAI, Type } from '@google/genai';
import type { Agent, Task, HistoryItem } from '../types';
import { TaskStatus, HistoryItemRole, AgentStatus } from '../types';
import { toolLibrary } from '../constants';

// This is a mock service. In a real application, process.env.API_KEY would be set.
const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const availableTools = toolLibrary.map(t => t.name);

/**
 * Generates a multi-step plan for an agent using the Gemini API.
 * @param goal The natural language goal for the agent.
 * @returns A promise that resolves to an array of tasks.
 */
export async function createAgentPlan(goal: string): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  if (!ai) {
    console.warn("Gemini API key not configured. Returning mock plan.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve([
        { name: 'Mock Task 1: Research', description: 'Gather information for the goal.', tool: 'GoogleSearch', requiresApproval: false },
        { name: 'Mock Task 2: Critical Action', description: 'Perform a critical action that needs review.', tool: 'GenericAPI', requiresApproval: true },
        { name: 'Mock Task 3: Summarize', description: 'Summarize the results.', tool: 'SlackAPI', requiresApproval: false },
    ]);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Based on the following goal, create a multi-step plan for an autonomous AI agent.
Goal: "${goal}"

The plan should be a sequence of tasks. For each task, provide:
1. A short, imperative 'name' (e.g., "Query Database").
2. A 'description' of what the task entails.
3. The most appropriate 'tool' from this list: ${availableTools.join(', ')}. Start by creating a task to gather context or information if necessary (e.g., using GoogleSearch or DatabaseAPI).
4. A boolean 'requiresApproval' flag, which should be true for tasks that are irreversible, costly, or sensitive.

Return ONLY the JSON array of tasks.
`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              tool: { type: Type.STRING, enum: availableTools },
              requiresApproval: { type: Type.BOOLEAN },
            },
            required: ['name', 'description', 'tool', 'requiresApproval'],
          },
        },
      },
    });

    const planJson = response.text.trim();
    if (!planJson) throw new Error("The model returned an empty plan. Try rephrasing your goal.");
    const plan = JSON.parse(planJson);
    return plan;
  } catch (error) {
    console.error("Error generating agent plan with Gemini:", error);
    if (error instanceof Error && error.message.includes('JSON')) throw new Error("The model returned an invalid plan format. Please try again.");
    throw new Error("Failed to generate a plan. The model may be unavailable or the request may have timed out.");
  }
}

/**
 * Generates follow-up tasks based on a new user prompt and conversation history.
 */
export async function generateFollowUpTasks(agent: Agent, userPrompt: string): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  if (!ai) {
    console.warn("Gemini API key not configured. Returning mock follow-up tasks.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Promise.resolve([
      { name: `Address: "${userPrompt.substring(0, 20)}..."`, description: `Perform a new action based on the user's latest instruction.`, tool: 'GenericAPI', requiresApproval: false },
    ]);
  }
  
  const history = agent.history.map(h => `[${h.role}] ${h.content}`).join('\n');
  
  const prompt = `An AI agent is in an interactive session with a user. Based on the original goal, the conversation so far, and the user's latest message, generate the next set of tasks to perform.

Original Goal: "${agent.goal}"

Conversation & Activity History:
${history}

User's Latest Message: "${userPrompt}"

Based on the user's message, generate a new sequence of tasks to append to the current plan.
- The tasks should directly address the user's request while staying within the context of the original goal.
- Use the same JSON output format as before: 'name', 'description', 'tool', and 'requiresApproval'.
- Available tools: ${availableTools.join(', ')}.

Return ONLY the JSON array for the new tasks. If no new tool-based actions are required, return an empty array.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                tool: { type: Type.STRING, enum: availableTools },
                requiresApproval: { type: Type.BOOLEAN },
              },
              required: ['name', 'description', 'tool', 'requiresApproval'],
            },
          },
        },
      });

      const planJson = response.text.trim();
      const plan = planJson ? JSON.parse(planJson) : [];
      return plan;
  } catch (error) {
    console.error("Error generating follow-up tasks with Gemini:", error);
    throw new Error("Failed to generate follow-up tasks.");
  }
}

/**
 * Generates a new plan for an agent that has encountered an error.
 */
export async function replanAgentTasks(agent: Agent): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  if (!ai) {
    console.warn("Gemini API key not configured. Returning mock replan.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const failedTask = agent.tasks.find(t => t.status === TaskStatus.FAILED);
    return Promise.resolve([
        { name: `Corrective Action for '${failedTask?.name}'`, description: 'A new step to fix the previous error.', tool: 'GenericAPI', requiresApproval: false },
        { name: 'Resume Goal', description: 'Continue with the original plan.', tool: 'SlackAPI', requiresApproval: false },
    ]);
  }

  const failedTaskIndex = agent.tasks.findIndex(t => t.status === TaskStatus.FAILED);
  if (failedTaskIndex === -1) throw new Error("Cannot replan, no failed task found.");
  const failedTask = agent.tasks[failedTaskIndex];
  const previousTasks = agent.tasks.slice(0, failedTaskIndex).map(t => ` - [COMPLETED] ${t.name}: ${t.description}`).join('\n');
  
  const prompt = `An AI agent has encountered an error while executing a plan. Your task is to create a new, revised plan to achieve the original goal, starting from the point of failure.

Original Goal: "${agent.goal}"

Execution History (Completed Tasks):
${previousTasks || 'No tasks were completed before failure.'}

Failed Task:
- Name: ${failedTask.name}
- Description: ${failedTask.description}
- Tool Used: ${failedTask.tool}
- Error Message: ${failedTask.result}

Based on this failure, generate a new sequence of tasks to overcome the error and complete the original goal.
- The new plan should replace the failed task and all subsequent tasks.
- Use the same JSON output format as before.
- Available tools: ${availableTools.join(', ')}.

Return ONLY the JSON array for the new tasks.`;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                tool: { type: Type.STRING, enum: availableTools },
                requiresApproval: { type: Type.BOOLEAN },
              },
              required: ['name', 'description', 'tool', 'requiresApproval'],
            },
          },
        },
      });

      const planJson = response.text.trim();
      if (!planJson) throw new Error("The model returned an empty replan. The agent will remain in an error state.");
      const plan = JSON.parse(planJson);
      return plan;
  } catch (error) {
    console.error("Error generating agent replan with Gemini:", error);
    throw new Error("Failed to generate a new plan. The agent requires manual intervention.");
  }
}

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