'use client';
import { useState, useEffect, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getStakes, createStake, requestUnstake, claimUnstake } from '@/lib/api';

const STAKE_TYPES = [
  { id: '60days', name: '60 Days Lock', apr: 15, lockDays: 60 },
  { id: 'flexible', name: 'Flexible', apr: 9.5, waitDays: 3, earlyPenalty: 2.5 }
];

const TOKENS = {
  SOL: { symbol: 'SOL', decimals: 9, mint: null },
  USDC: { symbol: 'USDC', decimals: 6, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  USDT: { symbol: 'USDT', decimals: 6, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' }
};

const TREASURY_WALLET = 'ASQUKGPrqMRhwERRzMrutXJCo5qNdQMVM2BDU4NuZrvF';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';

export default function StakePage() {
  const { wallets, ready } = useWallets();
  const [tab, setTab] = useState<'stake' | 'unstake'>('stake');
  const [token, setToken] = useState('SOL');
  const [amount, setAmount] = useState('');
  const [stakeType, setStakeType] = useState('60days');
  const [loading, setLoading] = useState(false);
  const [stakes, setStakes] = useState<any[]>([]);
  const [balances, setBalances] = useState({ SOL: 0, USDC: 0, USDT: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const privyWallet = wallets.find(w => w.walletClientType === 'privy');
  const walletAddress = privyWallet?.address || '';
  const authToken = typeof window !== 'undefined' ? localStorage.getItem('senkai_token') || '' : '';

  const fetchBalances = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const connection = new Connection(RPC_URL);
      const pubkey = new PublicKey(walletAddress);
      const solBalance = await connection.getBalance(pubkey);
      const newBalances: any = { SOL: solBalance / LAMPORTS_PER_SOL };

      for (const [key, tokenInfo] of Object.entries(TOKENS)) {
        if (tokenInfo.mint) {
          try {
            const ata = await getAssociatedTokenAddress(new PublicKey(tokenInfo.mint), pubkey);
            const tokenBalance = await connection.getTokenAccountBalance(ata);
            newBalances[key] = parseFloat(tokenBalance.value.uiAmountString || '0');
          } catch { newBalances[key] = 0; }
        }
      }
      setBalances(newBalances);
    } catch (e) { console.error(e); }
  }, [walletAddress]);

  const loadStakes = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const data = await getStakes(walletAddress);
      setStakes(data.stakes || []);
    } catch (e) { console.error(e); }
  }, [walletAddress]);

  useEffect(() => {
    if (ready && walletAddress) {
      fetchBalances();
      loadStakes();
    }
  }, [ready, walletAddress, fetchBalances, loadStakes]);

  const selectedType = STAKE_TYPES.find(t => t.id === stakeType);
  const estimatedReward = amount && selectedType 
    ? ((parseFloat(amount) * selectedType.apr / 100) / 365 * (selectedType.lockDays || 30)).toFixed(4)
    : '0';

  const handleStake = async () => {
    if (!amount || parseFloat(amount) <= 0 || !privyWallet) return;

    const amountNum = parseFloat(amount);
    if (amountNum > balances[token as keyof typeof balances]) {
      setError('Insufficient balance');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const connection = new Connection(RPC_URL);
      const fromPubkey = new PublicKey(walletAddress);
      const toPubkey = new PublicKey(TREASURY_WALLET);
      const tokenInfo = TOKENS[token as keyof typeof TOKENS];

      let tx = new Transaction();

      if (token === 'SOL') {
        tx.add(SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.floor(amountNum * LAMPORTS_PER_SOL)
        }));
      } else {
        if (!tokenInfo.mint) throw new Error('Invalid token');
        const mintPubkey = new PublicKey(tokenInfo.mint);
        const fromAta = await getAssociatedTokenAddress(mintPubkey, fromPubkey);
        const toAta = await getAssociatedTokenAddress(mintPubkey, toPubkey);

        tx.add(createTransferInstruction(
          fromAta,
          toAta,
          fromPubkey,
          BigInt(Math.floor(amountNum * Math.pow(10, tokenInfo.decimals))),
          [],
          TOKEN_PROGRAM_ID
        ));
      }

      tx.feePayer = fromPubkey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTx = await (privyWallet as any).signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig);

      await createStake(authToken, {
        token,
        amount: amountNum,
        stakeType,
        txSignature: sig
      });

      setSuccess(`Successfully staked ${amount} ${token}`);
      setAmount('');
      fetchBalances();
      loadStakes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.message || 'Stake failed');
    }
    setLoading(false);
  };

  const handleUnstake = async (stakeId: string, immediate: boolean) => {
    setLoading(true);
    setError('');
    try {
      if (immediate) {
        await requestUnstake(authToken, { stakeId, immediate: true });
        setSuccess('Unstake processed with penalty');
      } else {
        await requestUnstake(authToken, { stakeId, immediate: false });
        setSuccess('Unstake request submitted');
      }
      loadStakes();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.message || 'Unstake failed');
    }
    setLoading(false);
  };

  const handleClaim = async (stakeId: string) => {
    setLoading(true);
    setError('');
    try {
      await claimUnstake(authToken, { stakeId });
      setSuccess('Claimed successfully');
      loadStakes();
      fetchBalances();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.message || 'Claim failed');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="page">
        <h1 className="title">Staking</h1>

        <div className="tabs">
          <button className={tab === 'stake' ? 'active' : ''} onClick={() => setTab('stake')}>Stake</button>
          <button className={tab === 'unstake' ? 'active' : ''} onClick={() => setTab('unstake')}>Unstake</button>
        </div>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {tab === 'stake' && (
          <div className="card">
            <h2>Stake Tokens</h2>

            <div className="form-group">
              <label>Token</label>
              <div className="token-btns">
                {Object.keys(TOKENS).map(t => (
                  <button key={t} className={token === t ? 'active' : ''} onClick={() => setToken(t)}>
                    <span className="name">{t}</span>
                    <span className="bal">{balances[t as keyof typeof balances]?.toFixed(4)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Type</label>
              <div className="type-grid">
                {STAKE_TYPES.map(type => (
                  <button key={type.id} className={`type-btn ${stakeType === type.id ? 'active' : ''}`} onClick={() => setStakeType(type.id)}>
                    <span className="type-name">{type.name}</span>
                    <span className="type-apr">{type.apr}% APR</span>
                    {type.lockDays && <span className="type-info">Locked {type.lockDays}d</span>}
                    {type.waitDays && <span className="type-info">{type.waitDays}d wait</span>}
                    {type.earlyPenalty && <span className="type-warn">{type.earlyPenalty}% penalty</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <div className="amount-input">
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                <button onClick={() => setAmount(String(balances[token as keyof typeof balances]))} className="max-btn">MAX</button>
              </div>
            </div>

            <div className="estimate">
              <div className="row"><span>Est. Reward ({selectedType?.lockDays || 30}d)</span><span className="positive">{estimatedReward} {token}</span></div>
              <div className="row"><span>APR</span><span>{selectedType?.apr}%</span></div>
            </div>

            <button onClick={handleStake} disabled={loading || !amount || parseFloat(amount) <= 0} className="stake-btn">
              {loading ? 'Processing...' : 'Stake Now'}
            </button>
          </div>
        )}

        {tab === 'unstake' && (
          <div className="card">
            <h2>Your Stakes</h2>

            {stakes.length === 0 ? (
              <div className="empty">No active stakes</div>
            ) : (
              <div className="stakes-list">
                {stakes.map((stake: any) => (
                  <div key={stake.id} className="stake-item">
                    <div className="stake-info">
                      <span className="stake-amount">{stake.amount} {stake.token}</span>
                      <span className="stake-type">{stake.stakeType === '60days' ? '60 Days' : 'Flexible'} • {stake.apr || 15}% APR</span>
                      <span className="stake-reward positive">Reward: {stake.currentReward?.toFixed(4) || '0'} {stake.token}</span>
                    </div>
                    <div className="stake-actions">
                      {stake.isUnlocked ? (
                        <button onClick={() => handleClaim(stake.id)} className="claim-btn">Claim</button>
                      ) : stake.stakeType === 'flexible' ? (
                        <>
                          <button onClick={() => handleUnstake(stake.id, false)} className="unstake-btn">Unstake (3d)</button>
                          <button onClick={() => handleUnstake(stake.id, true)} className="instant-btn">Instant (-2.5%)</button>
                        </>
                      ) : (
                        <span className="lock-info">Unlocks: {new Date(stake.unlockDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .page { min-height: 100vh; background: #000; padding: 32px 24px; max-width: 600px; margin: 0 auto; }
        .title { font-size: 28px; font-weight: 600; margin-bottom: 24px; color: #fff; }

        .tabs { display: flex; gap: 8px; margin-bottom: 20px; }
        .tabs button { padding: 12px 24px; background: transparent; border: 1px solid #222; border-radius: 6px; color: #666; font-size: 13px; font-weight: 500; cursor: pointer; }
        .tabs button.active { background: #fff; border-color: #fff; color: #000; }

        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 24px; }
        .card h2 { font-size: 18px; font-weight: 600; color: #fff; margin-bottom: 24px; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 8px; }

        .token-btns { display: flex; gap: 8px; }
        .token-btns button { flex: 1; padding: 12px; background: #111; border: 1px solid #222; border-radius: 6px; cursor: pointer; text-align: center; }
        .token-btns button.active { border-color: #fff; }
        .token-btns .name { display: block; font-size: 14px; font-weight: 600; color: #fff; }
        .token-btns .bal { display: block; font-size: 10px; color: #666; margin-top: 2px; }

        .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .type-btn { padding: 16px; background: #111; border: 1px solid #222; border-radius: 8px; text-align: left; cursor: pointer; }
        .type-btn.active { border-color: #fff; }
        .type-name { display: block; font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }
        .type-apr { display: block; font-size: 18px; font-weight: 700; color: #22c55e; margin-bottom: 4px; }
        .type-info { display: block; font-size: 11px; color: #666; }
        .type-warn { display: block; font-size: 11px; color: #f59e0b; }

        .amount-input { display: flex; gap: 8px; }
        .amount-input input { flex: 1; padding: 14px; background: #111; border: 1px solid #222; border-radius: 6px; color: #fff; font-size: 16px; }
        .amount-input input:focus { outline: none; border-color: #fff; }
        .max-btn { padding: 14px 16px; background: #222; border: none; border-radius: 6px; color: #888; font-size: 11px; cursor: pointer; }

        .estimate { background: #111; border-radius: 6px; padding: 16px; margin-bottom: 20px; }
        .estimate .row { display: flex; justify-content: space-between; font-size: 13px; padding: 6px 0; }
        .estimate .row span:first-child { color: #666; }
        .estimate .row span:last-child { color: #fff; font-weight: 500; }
        .positive { color: #22c55e !important; }

        .stake-btn { width: 100%; padding: 14px; background: #fff; border: none; border-radius: 8px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; }
        .stake-btn:disabled { background: #333; color: #666; cursor: not-allowed; }

        .empty { text-align: center; padding: 48px; color: #666; }

        .stakes-list { display: flex; flex-direction: column; gap: 12px; }
        .stake-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #111; border-radius: 8px; }
        .stake-info { display: flex; flex-direction: column; gap: 4px; }
        .stake-amount { font-size: 16px; font-weight: 600; color: #fff; }
        .stake-type { font-size: 11px; color: #666; }
        .stake-reward { font-size: 12px; }
        .stake-actions { display: flex; gap: 8px; align-items: center; }
        .claim-btn { padding: 8px 16px; background: #fff; border: none; border-radius: 6px; color: #000; font-size: 12px; font-weight: 600; cursor: pointer; }
        .unstake-btn { padding: 8px 12px; background: transparent; border: 1px solid #444; border-radius: 6px; color: #888; font-size: 11px; cursor: pointer; }
        .instant-btn { padding: 8px 12px; background: transparent; border: 1px solid #f59e0b; border-radius: 6px; color: #f59e0b; font-size: 11px; cursor: pointer; }
        .lock-info { font-size: 11px; color: #666; }

        .error { padding: 12px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: #ef4444; font-size: 12px; margin-bottom: 16px; }
        .success { padding: 12px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 6px; color: #22c55e; font-size: 12px; margin-bottom: 16px; }
      `}</style>
    </>
  );
}
