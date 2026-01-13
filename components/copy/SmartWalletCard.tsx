'use client';

interface SmartWalletCardProps {
  wallet: any;
  simulatorMode: boolean;
  onFollow: () => void;
}

export default function SmartWalletCard({ wallet, simulatorMode, onFollow }: SmartWalletCardProps) {
  const formatNumber = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(2) + 'K';
    return n?.toFixed(2) || '0';
  };

  const isPositive = (wallet.roi30d || 0) >= 0;

  return (
    <>
      <div className="card">
        <div className="header">
          <div className="avatar" />
          <div className="info">
            <div className="address">
              {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-4)}
              {simulatorMode && <span className="sim-tag">SIM</span>}
            </div>
            <div className="followers">{wallet.followers || 0} followers</div>
          </div>
        </div>

        <div className="stats">
          <div className="stat">
            <span className="label">30d PNL</span>
            <span className={`value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}${formatNumber(wallet.pnl30d || 0)}
            </span>
          </div>
          <div className="stat">
            <span className="label">ROI</span>
            <span className={`value ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{wallet.roi30d?.toFixed(1) || 0}%
            </span>
          </div>
          <div className="stat">
            <span className="label">Win Rate</span>
            <span className="value">{wallet.winRate?.toFixed(1) || 0}%</span>
          </div>
        </div>

        <div className="sparkline">
          <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={isPositive ? '#22c55e' : '#ef4444'}
              strokeWidth="1.5"
              points="0,18 10,16 20,19 30,14 40,15 50,10 60,11 70,8 80,6 90,7 100,4"
            />
          </svg>
        </div>

        <div className="footer">
          <div className="meta">
            <span>AUM: ${formatNumber(wallet.aum || 0)}</span>
            <span>MDD: {wallet.mdd30d?.toFixed(1) || 0}%</span>
          </div>
          <button onClick={onFollow} className="follow-btn">Follow</button>
        </div>
      </div>

      <style jsx>{`
        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; }
        .header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #333, #111); }
        .info { flex: 1; }
        .address { font-size: 13px; font-weight: 600; color: #fff; font-family: monospace; display: flex; align-items: center; gap: 8px; }
        .sim-tag { font-size: 9px; padding: 2px 6px; background: #22c55e; color: #000; border-radius: 4px; font-family: sans-serif; font-weight: 600; }
        .followers { font-size: 11px; color: #555; margin-top: 2px; }

        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px; }
        .stat .label { display: block; font-size: 10px; color: #555; text-transform: uppercase; margin-bottom: 4px; }
        .stat .value { display: block; font-size: 14px; font-weight: 600; color: #fff; }
        .stat .value.positive { color: #22c55e; }
        .stat .value.negative { color: #ef4444; }

        .sparkline { height: 24px; margin-bottom: 12px; opacity: 0.6; }

        .footer { display: flex; align-items: center; justify-content: space-between; }
        .meta { display: flex; gap: 12px; font-size: 11px; color: #555; }
        .follow-btn { padding: 8px 16px; background: transparent; border: 1px solid #333; border-radius: 6px; color: #888; font-size: 12px; font-weight: 500; cursor: pointer; }
        .follow-btn:hover { border-color: #fff; color: #fff; }
      `}</style>
    </>
  );
}
