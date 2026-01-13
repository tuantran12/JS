'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Home, Wallet, TrendingUp, Coins, Users } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/copy', label: 'Social Trader' },
  { href: '/token', label: 'Token' },
  { href: '/stake', label: 'Stake' },
  { href: '/referral', label: 'Referral' }
];

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';

export default function Header() {
  const pathname = usePathname();
  const { logout, authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [userData, setUserData] = useState<any>(null);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [refCopied, setRefCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get Privy embedded wallet
  const embeddedWallet = wallets.find(w => w.walletClientType === 'privy');
  const walletAddress = embeddedWallet?.address || userData?.walletAddress || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('senkai_user');
      if (stored) {
        try { setUserData(JSON.parse(stored)); } catch {}
      }
    }
  }, []);

  // Fetch SOL balance with validation
  const fetchSolBalance = useCallback(async () => {
    if (!walletAddress) return;

    try {
      // Validate wallet address before using
      if (!walletAddress || walletAddress.length < 32) {
        console.error('Invalid wallet address format');
        setSolBalance(0);
        return;
      }

      const connection = new Connection(RPC_URL);
      const pubkey = new PublicKey(walletAddress);
      const balance = await connection.getBalance(pubkey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (e: any) {
      console.error('Error fetching SOL balance:', e);
      if (e.message?.includes('Invalid public key')) {
        console.error('Wallet address validation failed');
      }
      setSolBalance(0);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchSolBalance();
      const interval = setInterval(fetchSolBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [walletAddress, fetchSolBalance]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    localStorage.removeItem('senkai_token');
    localStorage.removeItem('senkai_wallet');
    localStorage.removeItem('senkai_user');
    setShowDropdown(false);
    await logout();
    window.location.href = '/';
  };

  const shortAddress = walletAddress 
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-5)}`
    : '';

  const copyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  // Get referral link
  const referralCode = userData?.referralCode || user?.id?.slice(-8) || '0x1587c9';
  const referralLink = typeof window !== 'undefined' 
    ? `${window.location.origin}/invite/${referralCode}`
    : `https://senkai.com/invite/${referralCode}`;

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setRefCopied(true);
      setTimeout(() => setRefCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy referral link:', err);
    }
  };

  const dlowPoints = userData?.dlowPoints || 0;
  
  // Format DLOW with comma (100,000 Token)
  const formatDLOW = (points: number) => {
    return points.toLocaleString('en-US') + ' Token';
  };

  return (
    <>
      <header className="header">
        <Link href="/" className="logo">SENKAI</Link>

        <nav className="nav">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-right">
          {dlowPoints > 0 && (
            <div className="dlow-badge">
              <span className="dlow-value">{dlowPoints.toLocaleString()}</span>
              <span className="dlow-label">DLOW</span>
            </div>
          )}

          {walletAddress && (
            <div className="wallet-dropdown-container" ref={dropdownRef}>
              <button 
                className="wallet-btn"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="wallet-address">{shortAddress}</span>
                <svg 
                  className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                >
                  <path 
                    d="M3 4.5L6 7.5L9 4.5" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {showDropdown && (
                <div className="wallet-dropdown">
                  {/* Header with Wallet ID */}
                  <div className="wallet-id-header">
                    <span className="wallet-id-label">ID Wallet:</span>
                    <div className="wallet-id-right">
                      <span className="wallet-id-address">{shortAddress}</span>
                      <button 
                        className="copy-btn"
                        onClick={copyAddress}
                        title="Copy address"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Balance Section */}
                  <div className="balance-section">
                    {/* DLOW Energy */}
                    <div className="balance-card dlow-card">
                      <div className="balance-icon-container dlow-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
                        </svg>
                      </div>
                      <div className="balance-text">
                        <div className="balance-label">DLOW Energy</div>
                        <div className="balance-value">{formatDLOW(dlowPoints)}</div>
                      </div>
                    </div>

                    {/* Balance SOL */}
                    <div className="balance-card sol-card">
                      <div className="balance-icon-container sol-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="2"/>
                          <path d="M2 10h20"/>
                        </svg>
                      </div>
                      <div className="balance-text">
                        <div className="balance-label">Balance SOL</div>
                        <div className="balance-value sol-value">
                          {solBalance.toFixed(3)}
                          <div className="sol-logo">
                            <div className="sol-bar red"></div>
                            <div className="sol-bar yellow"></div>
                            <div className="sol-bar blue"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons-section">
                    <Link 
                      href="/wallet?tab=add"
                      className="action-btn deposit-btn"
                      onClick={() => setShowDropdown(false)}
                    >
                      Deposit
                    </Link>
                    <Link 
                      href="/wallet?tab=send"
                      className="action-btn withdraw-btn"
                      onClick={() => setShowDropdown(false)}
                    >
                      Withdraw
                    </Link>
                  </div>

                  {/* Menu Items */}
                  <div className="menu-items">
                    <Link 
                      href="/referral" 
                      className="menu-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Referral Management
                    </Link>
                    <div className="menu-item disabled">
                      Event & News
                    </div>
                  </div>

                  {/* Referral Link */}
                  <div className="referral-link-section">
                    <div className="referral-link-wrapper">
                      <span className="referral-link-text">{referralLink}</span>
                      <button 
                        className="copy-btn"
                        onClick={copyReferralLink}
                        title="Copy referral link"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Log Out Button */}
                  <div className="logout-section">
                    <button 
                      className="logout-btn"
                      onClick={handleLogout}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
          <Home />
          <span className="mobile-nav-label">Home</span>
        </Link>
        <Link href="/wallet" className={`mobile-nav-item ${pathname === '/wallet' ? 'active' : ''}`}>
          <Wallet />
          <span className="mobile-nav-label">Wallet</span>
        </Link>
        <Link href="/copy" className={`mobile-nav-item ${pathname === '/copy' ? 'active' : ''}`}>
          <TrendingUp />
          <span className="mobile-nav-label">Copy</span>
        </Link>
        <Link href="/stake" className={`mobile-nav-item ${pathname === '/stake' ? 'active' : ''}`}>
          <Coins />
          <span className="mobile-nav-label">Stake</span>
        </Link>
        <Link href="/referral" className={`mobile-nav-item ${pathname === '/referral' ? 'active' : ''}`}>
          <Users />
          <span className="mobile-nav-label">Referral</span>
        </Link>
      </nav>

      {/* Copied Toast */}
      {(copied || refCopied) && (
        <div className="copied-toast">
          ✓ Copied to clipboard!
        </div>
      )}

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: #000;
          border-bottom: 1px solid #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          z-index: 1000;
        }
        
        .logo {
          font-weight: 700;
          font-size: 20px;
          color: #fff;
          letter-spacing: -0.5px;
          text-decoration: none;
        }
        
        .nav {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        
        .nav-item {
          padding: 10px 20px;
          border-radius: 6px;
          color: #888;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s;
        }
        
        .nav-item:hover {
          color: #fff;
          background: #111;
        }
        
        .nav-item.active {
          color: #000;
          background: #fff;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .dlow-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          font-size: 13px;
        }
        
        .dlow-value {
          font-weight: 600;
          color: #fff;
        }
        
        .dlow-label {
          color: #666;
        }
        
        .wallet-dropdown-container {
          position: relative;
        }
        
        .wallet-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #0a0a0a;
          border: 1px solid #1a1a1a;
          border-radius: 6px;
          color: #fff;
          font-size: 13px;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .wallet-btn:hover {
          background: #111;
          border-color: #333;
        }
        
        .dropdown-arrow {
          color: #666;
          transition: transform 0.2s;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .wallet-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 400px;
          background: #121212;
          border: 1px solid #303030;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
          overflow: hidden;
        }
        
        /* Header with Wallet ID - EXACT from HTML */
        .wallet-id-header {
          height: 56px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #303030;
        }
        
        .wallet-id-label {
          font-size: 14px;
          color: #E2E2E2;
        }
        
        .wallet-id-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .wallet-id-address {
          font-size: 14px;
          color: #FFFFFF;
          font-weight: 500;
          font-family: monospace;
        }
        
        .copy-btn {
          padding: 6px;
          background: transparent;
          border: none;
          color: #E2E2E2;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .copy-btn:hover {
          background: #191919;
          color: #FFFFFF;
        }
        
        .copied-toast {
          position: fixed;
          bottom: 32px;
          right: 32px;
          background: #22c55e;
          color: #FFFFFF;
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          font-size: 14px;
          font-weight: 500;
          animation: fadeIn 0.3s ease-out;
          z-index: 10000;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Balance Section - EXACT from HTML */
        .balance-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 64px;
          border-bottom: 1px solid #303030;
        }
        
        .balance-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 16px;
        }
        
        .dlow-card {
          border-right: 1px solid #303030;
        }
        
        .balance-icon-container {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .dlow-icon {
          border: 1px solid #D453FF;
        }
        
        .dlow-icon svg {
          color: #D453FF;
        }
        
        .sol-icon {
          border: 1px solid #FCFFF6;
        }
        
        .sol-icon svg {
          color: #FCFFF6;
        }
        
        .balance-text {
          display: flex;
          flex-direction: column;
        }
        
        .balance-label {
          font-size: 10px;
          color: #E2E2E2;
          margin-bottom: 2px;
        }
        
        .balance-value {
          font-size: 14px;
          color: #FFFFFF;
          font-weight: 600;
        }
        
        .sol-value {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .sol-logo {
          display: flex;
          gap: 2px;
          align-items: center;
        }
        
        .sol-bar {
          width: 4px;
          height: 12px;
          border-radius: 9999px;
        }
        
        .sol-bar.red {
          background: #ef4444;
        }
        
        .sol-bar.yellow {
          background: #eab308;
        }
        
        .sol-bar.blue {
          background: #3b82f6;
        }
        
        /* Action Buttons - EXACT from HTML */
        .action-buttons-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 48px;
          border-top: 1px solid #303030;
          border-bottom: 1px solid #303030;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
          border: none;
          background: transparent;
          cursor: pointer;
        }
        
        .deposit-btn {
          color: #D453FF;
          border-right: 1px solid #303030;
        }
        
        .deposit-btn:hover {
          background: linear-gradient(to right, #D453FF, #8B5CF6);
          color: #FFFFFF;
        }
        
        .withdraw-btn {
          color: #CEFF53;
        }
        
        .withdraw-btn:hover {
          background: #CEFF53;
          color: #121212;
        }
        
        /* Menu Items - EXACT from HTML */
        .menu-items {
          border-bottom: 1px solid #303030;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          width: 100%;
          height: 52px;
          padding: 0 24px;
          color: #FFFFFF;
          font-size: 14px;
          text-decoration: none;
          transition: background 0.2s;
          border-bottom: 1px solid #303030;
          background: transparent;
          border-left: none;
          border-right: none;
          border-top: none;
          cursor: pointer;
        }
        
        .menu-item:last-child {
          border-bottom: 1px solid #303030;
        }
        
        .menu-item:hover:not(.disabled) {
          background: #191919;
        }
        
        .menu-item.disabled {
          color: #666;
          cursor: default;
        }
        
        /* Referral Link - EXACT from HTML */
        .referral-link-section {
          height: 44px;
          border-bottom: 1px solid #303030;
          display: flex;
          align-items: center;
        }
        
        .referral-link-wrapper {
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .referral-link-text {
          font-size: 14px;
          color: #E2E2E2;
          font-family: monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }
        
        .referral-link-wrapper .copy-btn {
          margin-left: 12px;
        }
        
        /* Log Out - EXACT from HTML */
        .logout-section {
          height: 56px;
          display: flex;
          align-items: center;
        }
        
        .logout-btn {
          width: 100%;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #F12121;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .logout-btn:hover {
          background: #F12121;
          color: #FFFFFF;
        }

        @media (max-width: 768px) {
          .header {
            padding: 0 16px;
            height: 56px;
          }

          .nav {
            display: none;
          }

          .wallet-dropdown {
            width: 360px;
            right: -16px;
          }
        }

        /* Mobile Bottom Navigation */
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: #000;
            border-top: 1px solid #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 0 16px;
            z-index: 1000;
          }

          .mobile-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
            padding: 8px 12px;
            text-decoration: none;
            color: #666;
            transition: all 0.2s;
            border-radius: 8px;
          }

          .mobile-nav-item:hover {
            color: #fff;
          }

          .mobile-nav-item.active {
            color: #fff;
          }

          .mobile-nav-item svg {
            width: 20px;
            height: 20px;
          }

          .mobile-nav-label {
            font-size: 11px;
            font-weight: 500;
          }
        }
      `}</style>
    </>
  );
}
