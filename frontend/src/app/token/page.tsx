'use client';
import { useState, useEffect, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { purchaseSubscription, getSOLPrice } from '../../lib/api';

const PACKAGES = [
  { id: 'starter', name: 'Starter', monthlyUsd: 4.99, yearlyUsd: 49.99, dlowPoints: 10000, referralBonus: 10, features: ['Copy Trading Access', 'Simulator Mode', 'Basic Support'] },
  { id: 'trader', name: 'Trader', monthlyUsd: 19.99, yearlyUsd: 199.99, dlowPoints: 100000, referralBonus: 12, features: ['Everything in Starter', 'Priority Execution', '5 Smart Wallets'] },
  { id: 'expert', name: 'Expert', monthlyUsd: 99.99, yearlyUsd: 999.99, dlowPoints: 500000, referralBonus: 15, popular: true, features: ['Everything in Trader', 'Unlimited Wallets', 'Advanced Analytics', 'Priority Support'] },
  { id: 'ultimate', name: 'Ultimate', monthlyUsd: 999.99, yearlyUsd: 9999.99, dlowPoints: 2000000, referralBonus: 20, features: ['Everything in Expert', 'API Access', 'Custom Strategies', 'Dedicated Manager'] }
];

const TOKENS_BASE = {
  SOL: { symbol: 'SOL', decimals: 9, mint: null, priceUsd: 100 },
  USDC: { symbol: 'USDC', decimals: 6, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', priceUsd: 1 },
  USDT: { symbol: 'USDT', decimals: 6, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', priceUsd: 1 }
};

const TREASURY_WALLET = 'ASQUKGPrqMRhwERRzMrutXJCo5qNdQMVM2BDU4NuZrvF';
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';

export default function TokenPage() {
  const { wallets, ready } = useWallets();
  const [yearly, setYearly] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof PACKAGES[0] | null>(null);
  const [paymentToken, setPaymentToken] = useState('SOL');
  const [balances, setBalances] = useState({ SOL: 0, USDC: 0, USDT: 0 });
  const [solPrice, setSolPrice] = useState(100); // Default fallback
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const privyWallet = wallets.find(w => w.walletClientType === 'privy');
  const walletAddress = privyWallet?.address || '';

  // Fetch SOL price from market API
  useEffect(() => {
    const fetchSOLPrice = async () => {
      try {
        const data = await getSOLPrice();
        if (data.price) {
          setSolPrice(data.price);
        }
      } catch (e) {
        console.error('Failed to fetch SOL price:', e);
        // Keep default price
      }
    };
    fetchSOLPrice();
    // Refresh every 5 minutes
    const interval = setInterval(fetchSOLPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Update TOKENS with real-time SOL price
  const TOKENS = {
    ...TOKENS_BASE,
    SOL: { ...TOKENS_BASE.SOL, priceUsd: solPrice }
  };

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const connection = new Connection(RPC_URL);
      const pubkey = new PublicKey(walletAddress);
      const solBalance = await connection.getBalance(pubkey);
      const newBalances: any = { SOL: solBalance / LAMPORTS_PER_SOL };

      for (const [key, token] of Object.entries(TOKENS)) {
        if (token.mint) {
          try {
            const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), pubkey);
            const tokenBalance = await connection.getTokenAccountBalance(ata);
            newBalances[key] = parseFloat(tokenBalance.value.uiAmountString || '0');
          } catch { newBalances[key] = 0; }
        }
      }
      setBalances(newBalances);
    } catch (e) { console.error(e); }
  }, [walletAddress]);

  useEffect(() => {
    if (ready && walletAddress) fetchBalances();
  }, [ready, walletAddress, fetchBalances]);

  const getPrice = (pkg: typeof PACKAGES[0]) => yearly ? pkg.yearlyUsd : pkg.monthlyUsd;
  
  const getTokenAmount = (usd: number) => {
    const token = TOKENS[paymentToken as keyof typeof TOKENS];
    return usd / token.priceUsd;
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !privyWallet) return;

    const priceUsd = getPrice(selectedPackage);
    const tokenAmount = getTokenAmount(priceUsd);
    const balance = balances[paymentToken as keyof typeof balances];

    if (tokenAmount > balance) {
      setError(`Insufficient ${paymentToken}. Need ${tokenAmount.toFixed(4)}, have ${balance.toFixed(4)}`);
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const connection = new Connection(RPC_URL);
      const fromPubkey = new PublicKey(walletAddress);
      const toPubkey = new PublicKey(TREASURY_WALLET);
      const token = TOKENS[paymentToken as keyof typeof TOKENS];

      let tx = new Transaction();

      if (paymentToken === 'SOL') {
        tx.add(SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.floor(tokenAmount * LAMPORTS_PER_SOL)
        }));
      } else {
        if (!token.mint) throw new Error('Invalid token');
        const mintPubkey = new PublicKey(token.mint);
        const fromAta = await getAssociatedTokenAddress(mintPubkey, fromPubkey);
        const toAta = await getAssociatedTokenAddress(mintPubkey, toPubkey);

        tx.add(createTransferInstruction(
          fromAta,
          toAta,
          fromPubkey,
          BigInt(Math.floor(tokenAmount * Math.pow(10, token.decimals))),
          [],
          TOKEN_PROGRAM_ID
        ));
      }

      tx.feePayer = fromPubkey;
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signedTx = await (privyWallet as any).signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig);

      // Record purchase in backend
      await purchaseSubscription({
        walletAddress,
        packageName: selectedPackage.name,
        packageType: yearly ? 'yearly' : 'monthly',
        priceUsd,
        paymentToken,
        txSignature: sig
      });

      setSuccess(`Successfully purchased ${selectedPackage.name}! You received ${selectedPackage.dlowPoints.toLocaleString()} DLOW points.`);
      fetchBalances();
      setTimeout(() => { setSelectedPackage(null); setSuccess(''); }, 3000);
    } catch (e: any) {
      setError(e.message || 'Purchase failed');
    }
    setProcessing(false);
  };

  return (
    <>
      <div className="page">
        <div className="header">
          <h1>Subscription Packages</h1>
          <p>Choose the plan that fits your trading needs</p>

          <div className="toggle-group">
            <button className={!yearly ? 'active' : ''} onClick={() => setYearly(false)}>Monthly</button>
            <button className={yearly ? 'active' : ''} onClick={() => setYearly(true)}>
              Yearly <span className="save">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="packages-grid">
          {PACKAGES.map(pkg => (
            <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <div className="popular-badge">POPULAR</div>}
              
              <h3>{pkg.name}</h3>
              
              <div className="price">
                <span className="amount">${yearly ? pkg.yearlyUsd : pkg.monthlyUsd}</span>
                <span className="period">/{yearly ? 'year' : 'month'}</span>
              </div>

              <div className="dlow-bonus">
                +{pkg.dlowPoints.toLocaleString()} DLOW
              </div>

              <ul className="features">
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
                <li>+{pkg.referralBonus}% Referral Bonus</li>
              </ul>

              <button onClick={() => setSelectedPackage(pkg)} className={`select-btn ${pkg.popular ? 'primary' : ''}`}>
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPackage && (
        <div className="modal-overlay" onClick={() => !processing && setSelectedPackage(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Complete Purchase</h3>
              <button onClick={() => !processing && setSelectedPackage(null)} className="close-btn">×</button>
            </div>

            <div className="modal-body">
              <div className="order-summary">
                <div className="order-row">
                  <span>Package</span>
                  <span>{selectedPackage.name} ({yearly ? 'Yearly' : 'Monthly'})</span>
                </div>
                <div className="order-row">
                  <span>Price</span>
                  <span>${getPrice(selectedPackage).toFixed(2)}</span>
                </div>
                <div className="order-row bonus">
                  <span>DLOW Bonus</span>
                  <span>+{selectedPackage.dlowPoints.toLocaleString()}</span>
                </div>
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="form-group">
                <label>Pay with</label>
                <div className="token-select">
                  {Object.keys(TOKENS).map(t => (
                    <button
                      key={t}
                      className={paymentToken === t ? 'active' : ''}
                      onClick={() => setPaymentToken(t)}
                    >
                      <span className="token-name">{t}</span>
                      <span className="token-balance">{balances[t as keyof typeof balances]?.toFixed(4) || '0'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="payment-amount">
                <span>Amount to pay:</span>
                <span className="amount">{getTokenAmount(getPrice(selectedPackage)).toFixed(4)} {paymentToken}</span>
              </div>

              {getTokenAmount(getPrice(selectedPackage)) > balances[paymentToken as keyof typeof balances] && (
                <div className="insufficient">
                  Insufficient balance. <a href="/wallet">Add funds</a>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={processing || getTokenAmount(getPrice(selectedPackage)) > balances[paymentToken as keyof typeof balances]}
                className="pay-btn"
              >
                {processing ? 'Processing...' : `Pay ${getTokenAmount(getPrice(selectedPackage)).toFixed(4)} ${paymentToken}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page { min-height: 100vh; background: #000; padding: 32px 24px; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 32px; font-weight: 600; color: #fff; margin-bottom: 8px; }
        .header p { color: #666; margin-bottom: 24px; }

        .toggle-group { display: inline-flex; background: #111; border-radius: 8px; padding: 4px; }
        .toggle-group button { padding: 10px 20px; background: transparent; border: none; border-radius: 6px; color: #666; font-size: 13px; cursor: pointer; }
        .toggle-group button.active { background: #fff; color: #000; }
        .save { font-size: 10px; color: #22c55e; margin-left: 4px; }

        .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }

        .package-card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; padding: 24px; position: relative; }
        .package-card.popular { border-color: #fff; }
        .popular-badge { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #fff; color: #000; padding: 4px 12px; border-radius: 12px; font-size: 10px; font-weight: 600; }

        .package-card h3 { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 16px; }
        .price { margin-bottom: 8px; }
        .price .amount { font-size: 32px; font-weight: 700; color: #fff; }
        .price .period { font-size: 14px; color: #666; }
        .dlow-bonus { font-size: 13px; color: #22c55e; margin-bottom: 20px; }

        .features { list-style: none; margin-bottom: 24px; }
        .features li { font-size: 13px; color: #888; padding: 6px 0; border-bottom: 1px solid #111; }
        .features li::before { content: '✓ '; color: #666; }

        .select-btn { width: 100%; padding: 12px; background: transparent; border: 1px solid #333; border-radius: 6px; color: #888; font-size: 13px; font-weight: 500; cursor: pointer; }
        .select-btn:hover { border-color: #fff; color: #fff; }
        .select-btn.primary { background: #fff; border-color: #fff; color: #000; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; width: 420px; max-width: 90%; }
        .modal-header { padding: 16px 20px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 16px; font-weight: 600; color: #fff; }
        .close-btn { background: none; border: none; color: #666; font-size: 24px; cursor: pointer; }
        .modal-body { padding: 20px; }

        .order-summary { background: #111; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
        .order-row { display: flex; justify-content: space-between; font-size: 13px; padding: 8px 0; border-bottom: 1px solid #1a1a1a; }
        .order-row:last-child { border-bottom: none; }
        .order-row span:first-child { color: #666; }
        .order-row span:last-child { color: #fff; }
        .order-row.bonus span:last-child { color: #22c55e; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 11px; color: #666; margin-bottom: 8px; text-transform: uppercase; }
        
        .token-select { display: flex; gap: 8px; }
        .token-select button { flex: 1; padding: 12px 8px; background: #111; border: 1px solid #222; border-radius: 6px; cursor: pointer; text-align: center; }
        .token-select button.active { border-color: #fff; }
        .token-name { display: block; font-size: 14px; font-weight: 600; color: #fff; }
        .token-balance { display: block; font-size: 10px; color: #666; margin-top: 2px; }

        .payment-amount { display: flex; justify-content: space-between; padding: 16px; background: #111; border-radius: 8px; margin-bottom: 16px; }
        .payment-amount span { font-size: 13px; color: #666; }
        .payment-amount .amount { font-size: 16px; font-weight: 600; color: #fff; }

        .error { padding: 10px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: #ef4444; font-size: 12px; margin-bottom: 16px; }
        .success { padding: 10px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 6px; color: #22c55e; font-size: 12px; margin-bottom: 16px; }
        .insufficient { text-align: center; color: #f59e0b; font-size: 12px; margin-bottom: 16px; }
        .insufficient a { color: #fff; text-decoration: underline; }

        .pay-btn { width: 100%; padding: 14px; background: #fff; border: none; border-radius: 8px; color: #000; font-size: 14px; font-weight: 600; cursor: pointer; }
        .pay-btn:hover { background: #e0e0e0; }
        .pay-btn:disabled { background: #333; color: #666; cursor: not-allowed; }
      `}</style>
    </>
  );
}
