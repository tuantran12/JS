'use client';

interface PositionCardProps {
  position: any;
  onClose: () => void;
}

export default function PositionCard({ position, onClose }: PositionCardProps) {
  const pnlPercent = position.pnlPercent || 0;
  const isPositive = pnlPercent >= 0;

  return (
    <>
      <div className="card">
        <div className="header">
          <span className="token">{position.token?.slice(0, 8) || 'Token'}</span>
          <span className={`mode ${position.mode}`}>{position.mode === 'sim' ? 'Sim' : 'Live'}</span>
        </div>

        <div className="pnl-box">
          <span className={`pnl ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
          </span>
          <span className="pnl-usd">${position.pnl?.toFixed(2) || '0'}</span>
        </div>

        <div className="stats">
          <div className="row"><span>Entry</span><span>${position.entryPrice?.toFixed(6) || '0'}</span></div>
          <div className="row"><span>Current</span><span>${position.currentPrice?.toFixed(6) || '0'}</span></div>
          <div className="row"><span>Qty</span><span>{position.quantity?.toFixed(4) || '0'}</span></div>
          <div className="row"><span>Value</span><span>${position.valueUsd?.toFixed(2) || '0'}</span></div>
        </div>

        {position.status === 'open' ? (
          <button onClick={onClose} className="close-btn">Close</button>
        ) : (
          <div className="status">{position.status}</div>
        )}
      </div>

      <style jsx>{`
        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .token { font-size: 14px; font-weight: 600; font-family: monospace; color: #fff; }
        .mode { font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
        .mode.live { background: #fff; color: #000; }
        .mode.sim { background: #22c55e; color: #000; }

        .pnl-box { text-align: center; padding: 16px; background: #050505; border-radius: 6px; margin-bottom: 16px; }
        .pnl { display: block; font-size: 28px; font-weight: 700; }
        .pnl.positive { color: #22c55e; }
        .pnl.negative { color: #ef4444; }
        .pnl-usd { font-size: 12px; color: #666; }

        .stats { margin-bottom: 16px; }
        .row { display: flex; justify-content: space-between; font-size: 11px; padding: 6px 0; border-bottom: 1px solid #111; }
        .row span:first-child { color: #555; }
        .row span:last-child { color: #fff; font-family: monospace; }

        .close-btn { width: 100%; padding: 10px; background: #ef4444; border: none; border-radius: 6px; color: #fff; font-size: 12px; font-weight: 600; cursor: pointer; }
        .close-btn:hover { background: #dc2626; }
        .status { text-align: center; padding: 10px; background: #111; border-radius: 6px; color: #555; font-size: 12px; text-transform: capitalize; }
      `}</style>
    </>
  );
}
