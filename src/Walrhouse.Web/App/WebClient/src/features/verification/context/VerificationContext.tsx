import { useState, type ReactNode } from 'react';
import { VerificationContext } from './use-verification-context';

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [activeSalesOrderId, setActiveSalesOrderId] = useState<number | null>(null);

  const clearActiveSalesOrder = () => setActiveSalesOrderId(null);

  return (
    <VerificationContext.Provider
      value={{ activeSalesOrderId, setActiveSalesOrderId, clearActiveSalesOrder }}
    >
      {children}
    </VerificationContext.Provider>
  );
}
