import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Configuration = Record<string, string>; // e.g., { apiKey: "...", secret: "..." }
type AllConfigurations = Record<string, Configuration>; // e.g., { "PagerDutyAPI": { apiKey: "..." } }

const LOCAL_STORAGE_KEY = 'agentic-ai-tool-configs';

interface ConfigurationContextType {
  configurations: AllConfigurations;
  saveConfiguration: (toolName: string, config: Configuration) => void;
  getConfiguration: (toolName: string) => Configuration | null;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
  const [configurations, setConfigurations] = useState<AllConfigurations>(() => {
    try {
      const savedConfigs = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedConfigs ? JSON.parse(savedConfigs) : {};
    } catch (error) {
      console.error("Error reading tool configurations from localStorage:", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configurations));
    } catch (error) {
      console.error("Error saving tool configurations to localStorage:", error);
    }
  }, [configurations]);

  const saveConfiguration = (toolName: string, config: Configuration) => {
    setConfigurations(prev => ({
      ...prev,
      [toolName]: config,
    }));
  };

  const getConfiguration = (toolName: string): Configuration | null => {
    return configurations[toolName] || null;
  };

  return (
    <ConfigurationContext.Provider value={{ configurations, saveConfiguration, getConfiguration }}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfigurations() {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfigurations must be used within a ConfigurationProvider');
  }
  return context;
}