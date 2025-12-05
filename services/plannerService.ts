import type { Agent, Task, Tool } from '../types';
import { TaskStatus } from '../types';

/**
 * Generates a multi-step plan for an agent.
 * This is a mock implementation and returns a predefined plan.
 * @param goal The natural language goal for the agent.
 * @param availableTools The list of all possible tools, including their enabled status.
 * @returns A promise that resolves to an array of tasks.
 */
export async function createAgentPlan(goal: string, availableTools: Tool[]): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  const enabledToolNames = availableTools.filter(t => t.enabled).map(t => t.name);
  
  console.log("Creating a mock agent plan for goal:", goal);
  
  if (enabledToolNames.length === 0) {
      throw new Error("No tools are enabled. Please enable at least one tool from the Integrations page to create a plan.");
  }

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  // Return a generic, dynamic mock plan
  return Promise.resolve([
      { name: `Step 1: Research for "${goal.substring(0, 20)}..."`, description: 'Gather information and context related to the goal.', tool: 'GoogleSearch', requiresApproval: false },
      { name: 'Step 2: Perform Critical Action', description: 'Perform a critical action that requires user review before execution.', tool: 'GenericAPI', requiresApproval: true },
      { name: 'Step 3: Notify Stakeholders', description: 'Summarize the results and post them to a communication channel.', tool: 'SlackAPI', requiresApproval: false },
  ]);
}

/**
 * Generates follow-up tasks based on a new user prompt and conversation history.
 * This is a mock implementation.
 */
export async function generateFollowUpTasks(agent: Agent, userPrompt: string, availableTools: Tool[]): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  console.warn("Generating mock follow-up tasks.");
  await new Promise(resolve => setTimeout(resolve, 1500));

  const enabledToolNames = availableTools.filter(t => t.enabled).map(t => t.name);
  if (enabledToolNames.length === 0) {
    return [];
  }

  return Promise.resolve([
    { name: `Follow-up: "${userPrompt.substring(0, 30)}..."`, description: `Perform a new action based on the user's latest instruction.`, tool: 'GenericAPI', requiresApproval: false },
  ]);
}

/**
 * Generates a new plan for an agent that has encountered an error.
 * This is a mock implementation.
 */
export async function replanAgentTasks(agent: Agent, availableTools: Tool[]): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  console.warn("Generating mock replan.");
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const enabledToolNames = availableTools.filter(t => t.enabled).map(t => t.name);
  if (enabledToolNames.length === 0) {
    throw new Error("Cannot replan because no tools are enabled.");
  }

  const failedTask = agent.tasks.find(t => t.status === TaskStatus.FAILED);
  return Promise.resolve([
      { name: `Corrective Action for '${failedTask?.name}'`, description: 'A new step to fix the previous error by trying an alternative method.', tool: 'GenericAPI', requiresApproval: false },
      { name: 'Resume Goal', description: 'Continue with the original plan from a safe state.', tool: 'SlackAPI', requiresApproval: false },
  ]);
}