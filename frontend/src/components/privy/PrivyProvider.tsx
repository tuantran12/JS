'use client';
import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';
import { ReactNode, useMemo } from 'react';

// Create connectors ONCE outside component to prevent re-initialization
const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true
});

interface Props {
  children: ReactNode;
}

export default function PrivyProvider({ children }: Props) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

  // Memoize config to prevent unnecessary re-renders
  const config = useMemo(() => ({
    loginMethods: ['wallet', 'email'] as const,
    appearance: {
      theme: 'dark' as const,
      accentColor: '#a855f7',
      showWalletLoginFirst: true
    },
    embeddedWallets: {
      createOnLogin: 'all-users' as const,
      requireUserPasswordOnCreate: false
    },
    externalWallets: {
      solana: { connectors: solanaConnectors }
    },
    walletChainType: 'solana-only' as const
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

  return (
    <BasePrivyProvider appId={appId} config={config}>
      {children}
    </BasePrivyProvider>
  );
}
