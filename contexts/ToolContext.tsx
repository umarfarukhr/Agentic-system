import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Tool } from '../types';
import { toolLibrary as defaultTools } from '../constants';

const LOCAL_STORAGE_KEY = 'agentic-ai-tools';

interface ToolContextType {
  tools: Tool[];
  toggleTool: (toolName: string) => void;
}

const ToolContext = createContext<ToolContextType | undefined>(undefined);

export function ToolProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<Tool[]>(() => {
    try {
      const savedTools = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedTools) {
        // Hydrate state and ensure it matches the default tool list
        const parsedTools = JSON.parse(savedTools) as Tool[];
        return defaultTools.map(defaultTool => {
          const savedTool = parsedTools.find(st => st.name === defaultTool.name);
          // Use the saved 'enabled' state, but keep the code-defined description/icon
          return savedTool ? { ...defaultTool, enabled: savedTool.enabled } : defaultTool;
        });
      }
    } catch (error) {
      console.error("Error reading tools from localStorage:", error);
    }
    return defaultTools;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tools));
    } catch (error) {
      console.error("Error saving tools to localStorage:", error);
    }
  }, [tools]);

  const toggleTool = (toolName: string) => {
    setTools(prevTools =>
      prevTools.map(tool =>
        tool.name === toolName ? { ...tool, enabled: !tool.enabled } : tool
      )
    );
  };

  return (
    <ToolContext.Provider value={{ tools, toggleTool }}>
      {children}
    </ToolContext.Provider>
  );
}

export function useTools() {
  const context = useContext(ToolContext);
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolProvider');
  }
  return context;
}
