'use client';
import { useState } from 'react';
import { followSmartWallet } from '../../lib/api';

interface FollowModalProps {
  wallet: any;
  simulatorMode: boolean;
  config: any;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export default function FollowModal({ wallet, simulatorMode, config, onClose, onSuccess, token }: FollowModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buyMode, setBuyMode] = useState<'fixed' | 'percent'>('fixed');
  const [fixedSol, setFixedSol] = useState('0.1');
  const [percentBalance, setPercentBalance] = useState('10');
  const [sellMode, setSellMode] = useState<'exact' | 'percent'>('exact');
  const [sellPercent, setSellPercent] = useState('100');
  const [enableTP, setEnableTP] = useState(false);
  const [tpPercent, setTpPercent] = useState('100');
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryHours, setExpiryHours] = useState('24');
  const [slippage, setSlippage] = useState('49');
  const [maxBuy, setMaxBuy] = useState('');
  const [antiMev, setAntiMev] = useState(false);
  const [tipMode, setTipMode] = useState<'auto' | 'manual'>('auto');
  const [tipTier, setTipTier] = useState<'fast' | 'turbo' | 'ultra'>('fast');
  const [manualTip, setManualTip] = useState('0.001');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const settings = {
        buyMode, fixedSol: parseFloat(fixedSol), percentBalance: parseFloat(percentBalance),
        sellMode, sellPercent: parseFloat(sellPercent), enableTP, tpPercent: parseFloat(tpPercent),
        enableExpiry, expiryHours: parseInt(expiryHours), slippage: parseInt(slippage),
        maxBuy: parseFloat(maxBuy) || null, antiMev, tipMode, tipTier,
        manualTip: parseFloat(manualTip)
      };
      const result = await followSmartWallet(token, wallet.id, simulatorMode ? 'sim' : 'live', settings);
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
          <h3>Follow Wallet</h3>
          <button onClick={onClose} className="close">×</button>
        </div>

        <div className="body">
          <div className="wallet-row">
            <code>{wallet.address?.slice(0,10)}...{wallet.address?.slice(-6)}</code>
            <span className={simulatorMode ? 'badge sim' : 'badge live'}>{simulatorMode ? 'SIM' : 'LIVE'}</span>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="section">
            <label>Copy Buy</label>
            <div className="btns">
              <button className={buyMode === 'fixed' ? 'on' : ''} onClick={() => setBuyMode('fixed')}>Fixed SOL</button>
              <button className={buyMode === 'percent' ? 'on' : ''} onClick={() => setBuyMode('percent')}>% Balance</button>
            </div>
            <input type="number" value={buyMode === 'fixed' ? fixedSol : percentBalance} onChange={e => buyMode === 'fixed' ? setFixedSol(e.target.value) : setPercentBalance(e.target.value)} />
          </div>

          <div className="section">
            <label>Copy Sell</label>
            <div className="btns">
              <button className={sellMode === 'exact' ? 'on' : ''} onClick={() => setSellMode('exact')}>Exact</button>
              <button className={sellMode === 'percent' ? 'on' : ''} onClick={() => setSellMode('percent')}>Custom %</button>
            </div>
            {sellMode === 'percent' && <input type="number" value={sellPercent} onChange={e => setSellPercent(e.target.value)} />}
          </div>

          <div className="section">
            <label>Auto Sell</label>
            <div className="check-row"><input type="checkbox" checked={enableTP} onChange={e => setEnableTP(e.target.checked)} /><span>TP at</span><input type="number" value={tpPercent} onChange={e => setTpPercent(e.target.value)} disabled={!enableTP} className="sm" />%</div>
            <div className="check-row"><input type="checkbox" checked={enableExpiry} onChange={e => setEnableExpiry(e.target.checked)} /><span>Sell after</span><input type="number" value={expiryHours} onChange={e => setExpiryHours(e.target.value)} disabled={!enableExpiry} className="sm" />h</div>
          </div>

          <div className="section">
            <label>Advanced</label>
            <div className="grid2">
              <div><small>Slippage %</small><input type="number" value={slippage} onChange={e => setSlippage(e.target.value)} /></div>
              <div><small>Max Buy</small><input type="number" value={maxBuy} onChange={e => setMaxBuy(e.target.value)} placeholder="∞" /></div>
            </div>
            <div className="check-row"><input type="checkbox" checked={antiMev} onChange={e => setAntiMev(e.target.checked)} /><span>Anti-MEV</span></div>
          </div>

          <div className="section">
            <label>Priority Tip</label>
            <div className="btns">
              <button className={tipMode === 'auto' ? 'on' : ''} onClick={() => setTipMode('auto')}>Auto</button>
              <button className={tipMode === 'manual' ? 'on' : ''} onClick={() => setTipMode('manual')}>Manual</button>
            </div>
            {tipMode === 'auto' ? (
              <div className="btns">{(['fast','turbo','ultra'] as const).map(t => <button key={t} className={tipTier === t ? 'on' : ''} onClick={() => setTipTier(t)}>{t}</button>)}</div>
            ) : (
              <input type="number" value={manualTip} onChange={e => setManualTip(e.target.value)} step="0.0001" />
            )}
          </div>
        </div>

        <div className="footer">
          <small>Fee: 0.002 SOL/tx</small>
          <button onClick={handleSubmit} disabled={loading} className="submit">{loading ? '...' : 'Follow'}</button>
        </div>
      </div>

      <style jsx>{`
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.8); z-index: 1000; }
        .modal { position: fixed; top: 0; right: 0; width: 360px; max-width: 100%; height: 100vh; background: #000; border-left: 1px solid #111; z-index: 1001; display: flex; flex-direction: column; }
        .header { padding: 16px; border-bottom: 1px solid #111; display: flex; justify-content: space-between; align-items: center; }
        .header h3 { font-size: 15px; color: #fff; font-weight: 600; }
        .close { background: none; border: none; color: #555; font-size: 20px; cursor: pointer; }
        .body { flex: 1; overflow-y: auto; padding: 16px; }
        .wallet-row { display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #0a0a0a; border-radius: 6px; margin-bottom: 16px; }
        .wallet-row code { font-size: 11px; color: #666; }
        .badge { font-size: 10px; padding: 3px 6px; border-radius: 4px; font-weight: 600; }
        .badge.live { background: #fff; color: #000; }
        .badge.sim { background: #22c55e; color: #000; }
        .error { padding: 8px; background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); border-radius: 4px; color: #ef4444; font-size: 11px; margin-bottom: 16px; }
        .section { margin-bottom: 20px; }
        .section label { display: block; font-size: 10px; color: #555; text-transform: uppercase; margin-bottom: 8px; }
        .btns { display: flex; gap: 6px; margin-bottom: 8px; }
        .btns button { flex: 1; padding: 8px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; color: #666; font-size: 11px; cursor: pointer; }
        .btns button.on { border-color: #fff; color: #fff; }
        input[type="number"] { width: 100%; padding: 10px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 4px; color: #fff; font-size: 13px; }
        input:focus { outline: none; border-color: #fff; }
        input.sm { width: 50px; text-align: center; padding: 6px; }
        .check-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: #666; margin-bottom: 8px; }
        .check-row input[type="checkbox"] { width: 14px; height: 14px; }
        .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
        .grid2 small { display: block; font-size: 10px; color: #555; margin-bottom: 4px; }
        .footer { padding: 16px; border-top: 1px solid #111; text-align: center; }
        .footer small { display: block; color: #555; font-size: 10px; margin-bottom: 8px; }
        .submit { width: 100%; padding: 12px; background: #fff; border: none; border-radius: 6px; color: #000; font-size: 13px; font-weight: 600; cursor: pointer; }
        .submit:hover { background: #e0e0e0; }
        .submit:disabled { opacity: .5; }
      `}</style>
    </>
  );
}
