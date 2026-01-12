'use client';
import { PrivyProvider as BasePrivyProvider, PrivyClientConfig } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { ReactNode, useMemo, useCallback } from 'react';

// Create connectors with error handling
let solanaConnectors: any;
try {
  solanaConnectors = toSolanaWalletConnectors({
    shouldAutoConnect: true
  });
} catch (error) {
  console.error('Error initializing Solana wallet connectors:', error);
  solanaConnectors = [];
}

interface Props {
  children: ReactNode;
}

export default function PrivyProvider({ children }: Props) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  // Wallet error handler
  const handleError = useCallback((error: Error) => {
    console.error('Privy wallet error:', error);

    // Check for specific wallet proxy errors
    if (error.message?.includes('proxy') || error.message?.includes('not initialized')) {
      console.warn('Wallet proxy not initialized. Please ensure wallet extension is installed and enabled.');
    }

    // Check for connection errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
      console.error('Network error connecting to Privy. Please check your connection.');
    }
  }, []);

  // Memoize config to prevent unnecessary re-renders
  const config: PrivyClientConfig = useMemo(() => ({
    loginMethods: ['wallet', 'email'],
    appearance: {
      theme: 'dark',
      accentColor: '#a855f7',
      showWalletLoginFirst: true
    },
    embeddedWallets: {
      solana: {
        createOnLogin: 'all-users'
      }
    },
    externalWallets: {
      solana: { connectors: solanaConnectors }
    },
    walletChainType: 'solana-only'
  }), []);

  if (!appId) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        color: '#ef4444'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Configuration Error</h1>
          <p>NEXT_PUBLIC_PRIVY_APP_ID is not set</p>
        </div>
      </div>
    );
  }

  try {
    return (
      <BasePrivyProvider appId={appId} config={config}>
        {children}
      </BasePrivyProvider>
    );
  } catch (error: any) {
    handleError(error);
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0f',
        color: '#ef4444'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Wallet Connection Error</h1>
          <p>{error?.message || 'Failed to initialize wallet provider'}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#a855f7',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
}
