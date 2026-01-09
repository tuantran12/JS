'use client';

interface FollowingCardProps {
  follow: any;
  onUnfollow: () => void;
}

export default function FollowingCard({ follow, onUnfollow }: FollowingCardProps) {
  const wallet = follow.smartWallet || {};

  return (
    <>
      <div className="card">
        <div className="header">
          <span className="address">{wallet.address?.slice(0, 8)}...{wallet.address?.slice(-4)}</span>
          <span className={`mode ${follow.mode}`}>{follow.mode === 'sim' ? 'Sim' : 'Live'}</span>
        </div>

        <div className="settings">
          <div className="row"><span>Slippage</span><span>{follow.slippage || 49}%</span></div>
          <div className="row"><span>Max Buy</span><span>{follow.maxBuyUsd ? `$${follow.maxBuyUsd}` : '∞'}</span></div>
          <div className="row"><span>Size</span><span>{follow.sizePct ? `${follow.sizePct}%` : 'Auto'}</span></div>
          <div className="row"><span>Protection</span><span>{follow.copyProtect ? 'On' : 'Off'}</span></div>
        </div>

        <button onClick={onUnfollow} className="unfollow-btn">Unfollow</button>
      </div>

      <style jsx>{`
        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 16px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .address { font-size: 13px; font-weight: 600; font-family: monospace; color: #fff; }
        .mode { font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
        .mode.live { background: #fff; color: #000; }
        .mode.sim { background: #22c55e; color: #000; }

        .settings { margin-bottom: 16px; }
        .row { display: flex; justify-content: space-between; font-size: 12px; padding: 6px 0; border-bottom: 1px solid #111; }
        .row span:first-child { color: #555; }
        .row span:last-child { color: #fff; }

        .unfollow-btn { width: 100%; padding: 10px; background: transparent; border: 1px solid #222; border-radius: 6px; color: #666; font-size: 12px; cursor: pointer; }
        .unfollow-btn:hover { border-color: #ef4444; color: #ef4444; }
      `}</style>
    </>
  );
}
