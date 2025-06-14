import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface WalletContextType {
  isConnecting: boolean;
  connectionError: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWalletConnection() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletConnection must be used within a WalletConnectionProvider');
  }
  return context;
}

interface WalletConnectionProviderProps {
  children: ReactNode;
}

export function WalletConnectionProvider({ children }: WalletConnectionProviderProps) {
  const { connecting, connected, disconnecting } = useWallet();
  const [connectionError, setConnectionError] = React.useState<string | null>(null);

  const isConnecting = connecting || disconnecting;

  useEffect(() => {
    if (connected) {
      setConnectionError(null);
    }
  }, [connected]);

  return (
    <WalletContext.Provider value={{
      isConnecting,
      connectionError
    }}>
      {children}
    </WalletContext.Provider>
  );
}
