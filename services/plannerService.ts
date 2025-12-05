import { GoogleGenAI, Type } from '@google/genai';
import type { Agent, Task, Tool } from '../types';
import { TaskStatus } from '../types';

// This is a mock service. In a real application, process.env.API_KEY would be set.
const API_KEY = process.env.API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/**
 * Generates a multi-step plan for an agent using the Gemini API.
 * @param goal The natural language goal for the agent.
 * @param availableTools The list of all possible tools, including their enabled status.
 * @returns A promise that resolves to an array of tasks.
 */
export async function createAgentPlan(goal: string, availableTools: Tool[]): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  const enabledToolNames = availableTools.filter(t => t.enabled).map(t => t.name);
  
  if (!ai) {
    console.warn("Gemini API key not configured. Returning mock plan.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve([
        { name: 'Mock Task 1: Research', description: 'Gather information for the goal.', tool: 'GoogleSearch', requiresApproval: false },
        { name: 'Mock Task 2: Critical Action', description: 'Perform a critical action that needs review.', tool: 'GenericAPI', requiresApproval: true },
        { name: 'Mock Task 3: Summarize', description: 'Summarize the results.', tool: 'SlackAPI', requiresApproval: false },
    ]);
  }

  if (enabledToolNames.length === 0) {
      throw new Error("No tools are enabled. Please enable at least one tool from the Tool Library to create a plan.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Based on the following goal, create a multi-step plan for an autonomous AI agent.
Goal: "${goal}"

The plan should be a sequence of tasks. For each task, provide:
1. A short, imperative 'name' (e.g., "Query Database").
2. A 'description' of what the task entails.
3. The most appropriate 'tool' from this list: ${enabledToolNames.join(', ')}. Start by creating a task to gather context or information if necessary (e.g., using GoogleSearch or DatabaseAPI).
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
              tool: { type: Type.STRING, enum: enabledToolNames },
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
export async function generateFollowUpTasks(agent: Agent, userPrompt: string, availableTools: Tool[]): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  const enabledToolNames = availableTools.filter(t => t.enabled).map(t => t.name);

  if (!ai) {
    console.warn("Gemini API key not configured. Returning mock follow-up tasks.");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return Promise.resolve([
      { name: `Address: "${userPrompt.substring(0, 20)}..."`, description: `Perform a new action based on the user's latest instruction.`, tool: 'GenericAPI', requiresApproval: false },
    ]);
  }
  
  if (enabledToolNames.length === 0) {
      // Return an empty array but the agent will respond that no tools are available.
      return [];
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
- Available tools: ${enabledToolNames.join(', ')}.

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
                tool: { type: Type.STRING, enum: enabledToolNames },
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
export async function replanAgentTasks(agent: Agent, availableTools: Tool[]): Promise<Omit<Task, 'id' | 'status' | 'history'>[]> {
  const enabledToolNames = availableTools.filter(t => t.enabled).map(t => t.name);

  if (!ai) {
    console.warn("Gemini API key not configured. Returning mock replan.");
    await new Promise(resolve => setTimeout(resolve, 2000));
    const failedTask = agent.tasks.find(t => t.status === TaskStatus.FAILED);
    return Promise.resolve([
        { name: `Corrective Action for '${failedTask?.name}'`, description: 'A new step to fix the previous error.', tool: 'GenericAPI', requiresApproval: false },
        { name: 'Resume Goal', description: 'Continue with the original plan.', tool: 'SlackAPI', requiresApproval: false },
    ]);
  }

  if (enabledToolNames.length === 0) {
    throw new Error("Cannot replan because no tools are enabled. Please enable tools from the Tool Library.");
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
- Available tools: ${enabledToolNames.join(', ')}.

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
                tool: { type: Type.STRING, enum: enabledToolNames },
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