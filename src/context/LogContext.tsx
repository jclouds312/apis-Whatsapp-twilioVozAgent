'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { Log } from '@/lib/types';
import { logs as initialLogs } from '@/lib/data';

type LogContextType = {
  logs: Log[];
  addLog: (log: Omit<Log, 'id' | 'timestamp'>) => void;
};

const LogContext = createContext<LogContextType | undefined>(undefined);

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);

  const addLog = (log: Omit<Log, 'id' | 'timestamp'>) => {
    const newLog: Log = {
      ...log,
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
