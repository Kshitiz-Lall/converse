import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AIOperation {
  id: string;
  type: 'analyzing' | 'converting' | 'formatting' | 'processing';
  description: string;
  startTime: number;
}

interface AIContextType {
  activeOperations: AIOperation[];
  startOperation: (type: AIOperation['type'], description: string) => string;
  completeOperation: (id: string) => void;
  isAnyOperationActive: boolean;
  getCurrentOperation: () => AIOperation | null;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [activeOperations, setActiveOperations] = useState<AIOperation[]>([]);

  const startOperation = useCallback((type: AIOperation['type'], description: string): string => {
    const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const operation: AIOperation = {
      id,
      type,
      description,
      startTime: Date.now()
    };

    setActiveOperations(prev => [...prev, operation]);
    return id;
  }, []);

  const completeOperation = useCallback((id: string) => {
    setActiveOperations(prev => prev.filter(op => op.id !== id));
  }, []);

  const isAnyOperationActive = activeOperations.length > 0;
  
  const getCurrentOperation = useCallback((): AIOperation | null => {
    return activeOperations.length > 0 ? activeOperations[activeOperations.length - 1] : null;
  }, [activeOperations]);

  const value: AIContextType = {
    activeOperations,
    startOperation,
    completeOperation,
    isAnyOperationActive,
    getCurrentOperation
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

// Hook for managing AI operations with automatic cleanup
export function useAIOperation() {
  const { startOperation, completeOperation } = useAI();

  const executeWithAI = useCallback(
    async (
      type: AIOperation['type'],
      description: string,
      operation: () => Promise<any>
    ): Promise<any> => {
      const operationId = startOperation(type, description);
      
      try {
        const result = await operation();
        return result;
      } finally {
        completeOperation(operationId);
      }
    }, 
    [startOperation, completeOperation]
  );

  return { executeWithAI };
}