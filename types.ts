import type React from 'react';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export enum HistoryItemRole {
  USER = 'USER',
  AGENT = 'AGENT',
  SYSTEM = 'SYSTEM',
  TOOL_INPUT = 'TOOL_INPUT',
  TOOL_OUTPUT = 'TOOL_OUTPUT',
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  role: HistoryItemRole;
  content: string;
  taskId?: string; // Link history to a specific task
}

export interface ConfigurationField {
    name: string;
    label: string;
    type: 'text' | 'password';
    placeholder?: string;
}

export interface Tool {
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  configurationFields: ConfigurationField[];
}

export interface Task {
  id: string;
  name: string;
  description: string;
  tool: string;
  status: TaskStatus;
  requiresApproval: boolean;
  history: HistoryItem[];
  result?: string;
}

export enum AgentStatus {
    IDLE = 'IDLE',
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    FINISHED = 'FINISHED',
    ERROR = 'ERROR',
    REPLANNING = 'REPLANNING',
}

export interface Agent {
  id: string;
  name: string;
  goal: string;
  status: AgentStatus;
  tasks: Task[];
  createdAt: string;
  history: HistoryItem[]; // Agent-level conversation history
  tags: string[];
}