'use client';
import { useState, useEffect, useCallback } from 'react';
import { getReferralData } from '@/lib/api';

export default function ReferralPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const walletAddress = typeof window !== 'undefined' ? localStorage.getItem('senkai_wallet') || '' : '';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const fetchData = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const result = await getReferralData(walletAddress);
      setData(result);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [walletAddress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const referralCode = data?.referralCode || walletAddress?.slice(0, 8) || 'LOADING';
  const referralLink = `${baseUrl}/?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = {
    totalReferrals: data?.totalReferrals || 0,
    activeReferrals: data?.activeReferrals || 0,
    totalEarnings: data?.totalEarnings || 0,
    pendingEarnings: data?.pendingEarnings || 0,
    bonusPercent: data?.bonusPercent || 10
  };

  const rewards = data?.rewards || [];

  if (loading) {
    return <div className="page"><div className="loading">Loading...</div></div>;
  }

  return (
    <>
      <div className="page">
        <h1 className="title">Referral Program</h1>

        {/* Referral Link */}
        <div className="card highlight">
          <div className="card-label">Your Referral Link</div>
          <div className="link-box">
            <input type="text" value={referralLink} readOnly />
            <button onClick={copyLink} className="copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bonus-info">
            Earn <span className="bonus">{stats.bonusPercent}%</span> from referral purchases. 
            Upgrade your package to increase bonus!
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.totalReferrals}</span>
            <span className="stat-label">Total Referrals</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.activeReferrals}</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">${stats.totalEarnings.toFixed(2)}</span>
            <span className="stat-label">Total Earned</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">${stats.pendingEarnings.toFixed(2)}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        {/* How It Works */}
        <div className="card">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-text">
                <strong>Share Your Link</strong>
                <p>Send your unique referral link to friends</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-text">
                <strong>They Sign Up</strong>
                <p>Friends create an account using your link</p>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-text">
                <strong>Earn Rewards</strong>
                <p>Get {stats.bonusPercent}% of their subscription payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Tiers */}
        <div className="card">
          <h2>Referral Bonus Tiers</h2>
          <div className="tiers">
            <div className="tier">
              <span className="tier-name">Starter</span>
              <span className="tier-bonus">10%</span>
            </div>
            <div className="tier">
              <span className="tier-name">Trader</span>
              <span className="tier-bonus">12%</span>
            </div>
            <div className="tier">
              <span className="tier-name">Expert</span>
              <span className="tier-bonus">15%</span>
            </div>
            <div className="tier">
              <span className="tier-name">Ultimate</span>
              <span className="tier-bonus">20%</span>
            </div>
          </div>
        </div>

        {/* Rewards History */}
        <div className="card">
          <h2>Reward History</h2>
          {rewards.length === 0 ? (
            <div className="empty">No rewards yet. Start sharing your link!</div>
          ) : (
            <div className="rewards-list">
              {rewards.map((r: any, i: number) => (
                <div key={i} className="reward-item">
                  <div className="reward-info">
                    <span className="reward-user">{r.referredUser?.slice(0, 8)}...{r.referredUser?.slice(-4)}</span>
                    <span className="reward-desc">{r.packageName} subscription</span>
                  </div>
                  <div className="reward-amount">
                    <span className="amount">+${r.amount?.toFixed(2) || '0'}</span>
                    <span className="date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page { min-height: 100vh; background: #000; padding: 32px 24px; max-width: 800px; margin: 0 auto; }
        .title { font-size: 28px; font-weight: 600; margin-bottom: 24px; color: #fff; }
        .loading { text-align: center; padding: 48px; color: #666; }

        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
        .card.highlight { border-color: #333; }
        .card-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 12px; }
        .card h2 { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 16px; }

        .link-box { display: flex; gap: 8px; margin-bottom: 12px; }
        .link-box input { flex: 1; padding: 12px; background: #111; border: 1px solid #222; border-radius: 6px; color: #fff; font-size: 13px; font-family: monospace; }
        .copy-btn { padding: 12px 20px; background: #fff; border: none; border-radius: 6px; color: #000; font-size: 12px; font-weight: 600; cursor: pointer; min-width: 80px; }
        .copy-btn:hover { background: #e0e0e0; }

        .bonus-info { font-size: 12px; color: #666; }
        .bonus { color: #22c55e; font-weight: 600; }

        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
        .stat-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; text-align: center; }
        .stat-value { display: block; font-size: 24px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .stat-label { display: block; font-size: 11px; color: #666; text-transform: uppercase; }

        .steps { display: flex; flex-direction: column; gap: 16px; }
        .step { display: flex; align-items: flex-start; gap: 16px; }
        .step-num { width: 32px; height: 32px; background: #111; border: 1px solid #222; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: #fff; flex-shrink: 0; }
        .step-text strong { display: block; font-size: 14px; color: #fff; margin-bottom: 4px; }
        .step-text p { font-size: 12px; color: #666; margin: 0; }

        .tiers { display: flex; gap: 8px; }
        .tier { flex: 1; padding: 12px; background: #111; border-radius: 6px; text-align: center; }
        .tier-name { display: block; font-size: 12px; color: #888; margin-bottom: 4px; }
        .tier-bonus { display: block; font-size: 18px; font-weight: 600; color: #fff; }

        .rewards-list { display: flex; flex-direction: column; gap: 8px; }
        .reward-item { display: flex; justify-content: space-between; padding: 12px; background: #111; border-radius: 6px; }
        .reward-info { display: flex; flex-direction: column; gap: 2px; }
        .reward-user { font-size: 13px; font-family: monospace; color: #fff; }
        .reward-desc { font-size: 11px; color: #666; }
        .reward-amount { text-align: right; }
        .reward-amount .amount { display: block; font-size: 14px; font-weight: 600; color: #22c55e; }
        .reward-amount .date { display: block; font-size: 11px; color: #666; }

        .empty { text-align: center; padding: 32px; color: #666; font-size: 13px; }

        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .tiers { flex-wrap: wrap; }
          .tier { min-width: calc(50% - 4px); }
        }
      `}</style>
    </>
  );
}
