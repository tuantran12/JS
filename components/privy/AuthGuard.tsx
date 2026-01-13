'use client';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { authenticateWithPrivy } from '../../lib/api';

interface AuthGuardProps {
  children: ReactNode;
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated' | 'creating-wallet';

export default function AuthGuard({ children }: AuthGuardProps) {
  const { ready, authenticated, login, logout, user, createWallet } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  
  const authAttempted = useRef(false);
  const walletCreationAttempted = useRef(false);

  useEffect(() => {
    if (!authenticated) {
      authAttempted.current = false;
      walletCreationAttempted.current = false;
    }
  }, [authenticated]);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      setAuthStatus('unauthenticated');
      return;
    }

    if (!walletsReady) return;

    if (wallets.length === 0) {
      if (!walletCreationAttempted.current) {
        walletCreationAttempted.current = true;
        setAuthStatus('creating-wallet');
        createWallet().catch((err) => {
          console.error('Failed to create wallet:', err);
          setError('Failed to create wallet');
        });
      }
      return;
    }

    const privyWallet = wallets.find(w => w.walletClientType === 'privy');
    const walletAddress = privyWallet?.address || wallets[0]?.address;

    if (!walletAddress) {
      setAuthStatus('creating-wallet');
      return;
    }

    if (!authAttempted.current) {
      authAttempted.current = true;
      
      const authenticate = async () => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const referralCode = urlParams.get('ref') || undefined;
          const privyUserId = user?.id;

          const result = await authenticateWithPrivy(walletAddress, referralCode, privyUserId);

          if (result.token) {
            localStorage.setItem('senkai_token', result.token);
            localStorage.setItem('senkai_wallet', walletAddress);
            localStorage.setItem('senkai_user', JSON.stringify(result.user));
            setAuthStatus('authenticated');
          } else {
            setError(result.error || 'Authentication failed');
            setAuthStatus('unauthenticated');
          }
        } catch (e: any) {
          console.error('Auth error:', e);
          localStorage.setItem('senkai_wallet', walletAddress);
          setAuthStatus('authenticated');
        }
      };

      authenticate();
    }
  }, [ready, authenticated, walletsReady, wallets, user, createWallet]);

  const handleLogin = useCallback(async () => {
    if (authenticated) return;
    setError(null);
    try {
      await login();
    } catch (e: any) {
      if (!e.message?.includes('already logged in')) {
        setError(e.message || 'Login failed');
      }
    }
  }, [authenticated, login]);

  const handleLogout = useCallback(async () => {
    localStorage.removeItem('senkai_token');
    localStorage.removeItem('senkai_wallet');
    localStorage.removeItem('senkai_user');
    authAttempted.current = false;
    walletCreationAttempted.current = false;
    await logout();
    setAuthStatus('unauthenticated');
  }, [logout]);

  if (!ready || authStatus === 'loading') {
    return (
      <div className="auth-screen">
        <div className="spinner" />
        <p>Loading...</p>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (authStatus === 'creating-wallet') {
    return (
      <div className="auth-screen">
        <div className="spinner" />
        <h2>Creating Wallet</h2>
        <p>Setting up your embedded wallet...</p>
        <button onClick={handleLogout} className="btn-secondary">Cancel</button>
        <style jsx>{styles}</style>
      </div>
    );
  }

  if (authStatus === 'unauthenticated') {
    return (
      <div className="auth-screen">
        <h1 className="logo">SENKAI</h1>
        <p className="tagline">AI-Powered Copy Trading on Solana</p>
        
        {error && <div className="error">{error}</div>}

        <button onClick={handleLogin} className="btn-primary">
          Connect Wallet
        </button>
        
        <p className="hint">Privy wallet enables 24/7 auto-trading</p>
        <style jsx>{styles}</style>
      </div>
    );
  }

  return <>{children}</>;
}

const styles = `
  .auth-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #000;
    color: #fff;
    text-align: center;
    padding: 24px;
  }
  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #222;
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .logo {
    font-size: 40px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
    letter-spacing: -1px;
  }
  .tagline {
    color: #555;
    font-size: 14px;
    margin-bottom: 40px;
  }
  h2 {
    font-size: 18px;
    margin-bottom: 8px;
  }
  p {
    color: #666;
    font-size: 13px;
    margin-bottom: 16px;
  }
  .error {
    padding: 12px 20px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 6px;
    color: #ef4444;
    font-size: 13px;
    margin-bottom: 24px;
    max-width: 300px;
  }
  .btn-primary {
    padding: 14px 40px;
    background: #fff;
    border: none;
    border-radius: 6px;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    min-width: 200px;
  }
  .btn-primary:hover {
    background: #e0e0e0;
  }
  .btn-secondary {
    padding: 10px 20px;
    background: transparent;
    border: 1px solid #333;
    border-radius: 6px;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    margin-top: 16px;
  }
  .btn-secondary:hover {
    border-color: #555;
    color: #fff;
  }
  .hint {
    margin-top: 32px;
    color: #333;
    font-size: 11px;
  }
`;
