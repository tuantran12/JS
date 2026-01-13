'use client';

interface BottomStatsProps {
  metrics: any;
  config: any;
}

export default function BottomStats({ metrics, config }: BottomStatsProps) {
  if (!metrics) return null;

  return (
    <>
      <div className="bottom-stats">
        <div className="group">
          <span className="group-label">Live</span>
          <div className="stat"><span className="label">Balance</span><span className="value">${metrics.totalBalance?.toFixed(2) || '0'}</span></div>
          <div className="stat"><span className="label">PnL</span><span className={`value ${(metrics.pnlLive || 0) >= 0 ? 'positive' : 'negative'}`}>{metrics.pnlLive >= 0 ? '+' : ''}${metrics.pnlLive?.toFixed(2) || '0'}</span></div>
          <div className="stat"><span className="label">Win</span><span className="value">{metrics.winRateLive?.toFixed(1) || '0'}%</span></div>
        </div>
        <div className="divider" />
        <div className="group">
          <span className="group-label">Simulator</span>
          <div className="stat"><span className="label">Balance</span><span className="value">${metrics.totalBalanceSim?.toFixed(2) || '0'}</span></div>
          <div className="stat"><span className="label">PnL</span><span className={`value ${(metrics.pnlSim || 0) >= 0 ? 'positive' : 'negative'}`}>{metrics.pnlSim >= 0 ? '+' : ''}${metrics.pnlSim?.toFixed(2) || '0'}</span></div>
          <div className="stat"><span className="label">Win</span><span className="value">{metrics.winRateSim?.toFixed(1) || '0'}%</span></div>
        </div>
      </div>

      <style jsx>{`
        .bottom-stats { position: fixed; bottom: 0; left: 0; right: 0; background: #000; border-top: 1px solid #111; padding: 12px 24px; display: flex; align-items: center; justify-content: center; gap: 32px; z-index: 100; }
        .group { display: flex; align-items: center; gap: 20px; }
        .group-label { font-size: 10px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
        .divider { width: 1px; height: 24px; background: #222; }
        .stat { display: flex; align-items: center; gap: 6px; }
        .label { font-size: 10px; color: #555; }
        .value { font-size: 12px; font-weight: 600; color: #fff; }
        .value.positive { color: #22c55e; }
        .value.negative { color: #ef4444; }
      `}</style>
    </>
  );
}
