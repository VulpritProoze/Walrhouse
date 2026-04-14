import { createContext, useContext } from 'react';

export interface VerificationContextType {
  activeSalesOrderId: number | null;
  setActiveSalesOrderId: (id: number | null) => void;
  clearActiveSalesOrder: () => void;
}

export const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function useVerificationContext() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerificationContext must be used within a VerificationProvider');
  }
  return context;
}
