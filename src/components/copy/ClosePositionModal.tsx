'use client';
import { useState } from 'react';
import { closePosition } from '../../lib/api';

interface ClosePositionModalProps {
  position: any;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export default function ClosePositionModal({ position, onClose, onSuccess, token }: ClosePositionModalProps) {
  const [percent, setPercent] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pnl = position.pnl || 0;
  const pnlPercent = position.pnlPercent || 0;
  const isPositive = pnl >= 0;

  const handleClose = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await closePosition(token, position.id, percent);
      if (result.error) setError(result.error);
      else onSuccess();
    } catch (e: any) {
      setError(e.message || 'Failed');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal">
        <div className="header">
          <h3>Close Position</h3>
          <button onClick={onClose} className="close">×</button>
        </div>
        
        <div className="body">
          <div className="token-name">{position.token?.slice(0, 12) || 'Token'}</div>
          
          <div className="pnl-box">
            <span className={`pnl ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{pnlPercent.toFixed(2)}%
            </span>
            <span className="pnl-usd">${pnl.toFixed(2)}</span>
          </div>

          <div className="price-row">
            <div className="price-item">
              <small>Entry</small>
              <span>${position.entryPrice?.toFixed(6) || '0'}</span>
            </div>
            <div className="price-item">
              <small>Current</small>
              <span>${position.currentPrice?.toFixed(6) || '0'}</span>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="slider-section">
            <div className="slider-header">
              <span>Close Amount</span>
              <span>{percent}%</span>
            </div>
            <input type="range" min="1" max="100" value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="slider" />
          </div>

          <div className="quick-btns">
            {[25, 50, 75, 100].map(v => (
              <button key={v} onClick={() => setPercent(v)} className={percent === v ? 'active' : ''}>{v}%</button>
            ))}
          </div>
        </div>

        <div className="footer">
          <button onClick={handleClose} disabled={loading} className="submit">
            {loading ? 'Closing...' : `Close ${percent}%`}
          </button>
        </div>
      </div>

      <style jsx>{`
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.8); z-index: 1000; }
        .modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 360px; max-width: 90%; background: #000; border: 1px solid #111; border-radius: 8px; z-index: 1001; }
        .header { padding: 16px; border-bottom: 1px solid #111; display: flex; justify-content: space-between; align-items: center; }
        .header h3 { font-size: 15px; color: #fff; font-weight: 600; }
        .close { background: none; border: none; color: #555; font-size: 20px; cursor: pointer; }
        .body { padding: 20px; }
        .token-name { font-size: 14px; font-weight: 600; color: #fff; font-family: monospace; text-align: center; margin-bottom: 16px; }
        .pnl-box { text-align: center; padding: 20px; background: #0a0a0a; border-radius: 6px; margin-bottom: 16px; }
        .pnl { display: block; font-size: 32px; font-weight: 700; }
        .pnl.positive { color: #22c55e; }
        .pnl.negative { color: #ef4444; }
        .pnl-usd { font-size: 12px; color: #666; }
        .price-row { display: flex; gap: 12px; margin-bottom: 16px; }
        .price-item { flex: 1; padding: 12px; background: #0a0a0a; border-radius: 6px; text-align: center; }
        .price-item small { display: block; font-size: 10px; color: #555; margin-bottom: 4px; }
        .price-item span { font-size: 12px; color: #fff; font-family: monospace; }
        .error { padding: 8px; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); border-radius: 4px; color: #ef4444; font-size: 11px; margin-bottom: 16px; }
        .slider-section { margin-bottom: 16px; }
        .slider-header { display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-bottom: 8px; }
        .slider { width: 100%; height: 4px; background: #222; border-radius: 2px; -webkit-appearance: none; cursor: pointer; }
        .slider::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border-radius: 50%; cursor: pointer; }
        .quick-btns { display: flex; gap: 8px; }
        .quick-btns button { flex: 1; padding: 10px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; color: #666; font-size: 12px; cursor: pointer; }
        .quick-btns button:hover { border-color: #444; }
        .quick-btns button.active { border-color: #fff; color: #fff; }
        .footer { padding: 16px; border-top: 1px solid #111; }
        .submit { width: 100%; padding: 14px; background: #ef4444; border: none; border-radius: 6px; color: #fff; font-size: 14px; font-weight: 600; cursor: pointer; }
        .submit:hover { background: #dc2626; }
        .submit:disabled { opacity: .5; }
      `}</style>
    </>
  );
}
