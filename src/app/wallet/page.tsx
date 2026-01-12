'use client';
import { useState, useEffect, useCallback } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useFundWallet } from '@privy-io/react-auth/solana';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getUserData, getTransactions } from '../../lib/api';

// Token addresses (Mainnet - change to devnet for testing)
const TOKENS = {
  SOL: { symbol: 'SOL', decimals: 9, mint: null },
  USDC: { symbol: 'USDC', decimals: 6, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
  USDT: { symbol: 'USDT', decimals: 6, mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB' }
};

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.mainnet-beta.solana.com';

export default function WalletPage() {
  const { user } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { fundWallet } = useFundWallet();

  const [balances, setBalances] = useState({ SOL: 0, USDC: 0, USDT: 0, DLOW: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modal, setModal] = useState<'add' | 'send' | null>(null);
  const [addMethod, setAddMethod] = useState<'card' | 'wallet' | 'receive'>('card');
  const [selectedToken, setSelectedToken] = useState('SOL');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Get Privy embedded wallet
  const privyWallet = wallets.find(w => w.walletClientType === 'privy');
  const externalWallet = wallets.find(w => w.walletClientType !== 'privy');
  const walletAddress = privyWallet?.address || '';

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    if (!walletAddress) return;

    try {
      const connection = new Connection(RPC_URL);
      const pubkey = new PublicKey(walletAddress);

      // SOL balance
      const solBalance = await connection.getBalance(pubkey);
      const newBalances: any = { SOL: solBalance / LAMPORTS_PER_SOL };

      // SPL token balances
      for (const [key, token] of Object.entries(TOKENS)) {
        if (token.mint) {
          try {
            const ata = await getAssociatedTokenAddress(new PublicKey(token.mint), pubkey);
            const tokenBalance = await connection.getTokenAccountBalance(ata);
            newBalances[key] = parseFloat(tokenBalance.value.uiAmountString || '0');
          } catch {
            newBalances[key] = 0;
          }
        }
      }

      // Get DLOW from backend
      const userData = await getUserData(walletAddress);
      newBalances.DLOW = userData?.user?.dlowPoints || 0;
      setSubscription(userData?.activeSubscription || null);

      setBalances(newBalances);
    } catch (e) {
      console.error('Error fetching balances:', e);
    }
  }, [walletAddress]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const data = await getTransactions(walletAddress);
      setTransactions(data.transactions || []);
    } catch (e) {
      console.error('Error fetching transactions:', e);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletsReady && walletAddress) {
      setLoading(true);
      Promise.all([fetchBalances(), fetchTransactions()]).finally(() => setLoading(false));
    }
  }, [walletsReady, walletAddress, fetchBalances, fetchTransactions]);

  // Add Funds handlers
  const handleAddFundsCard = async () => {
    if (!privyWallet) return;
    setProcessing(true);
    setError('');
    try {
      await fundWallet({ address: privyWallet.address });
      setSuccess('Funding initiated');
      setTimeout(() => { fetchBalances(); setModal(null); }, 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to fund wallet');
    }
    setProcessing(false);
  };

  const handleAddFundsFromWallet = async () => {
    if (!externalWallet || !privyWallet || !amount) return;
    setProcessing(true);
    setError('');

    try {
      const connection = new Connection(RPC_URL);
      const amountNum = parseFloat(amount);
      const fromPubkey = new PublicKey(externalWallet.address);
      const toPubkey = new PublicKey(privyWallet.address);

      let tx = new Transaction();

      if (selectedToken === 'SOL') {
        tx.add(SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.floor(amountNum * LAMPORTS_PER_SOL)
        }));
      } else {
        const tokenInfo = TOKENS[selectedToken as keyof typeof TOKENS];
        if (!tokenInfo?.mint) throw new Error('Invalid token');

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

      // Sign with external wallet
      const provider = await externalWallet.getEthereumProvider();
      const signedTx = await (externalWallet as any).signTransaction(tx);
      const sig = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(sig);

      setSuccess(`Transferred ${amount} ${selectedToken}`);
      setTimeout(() => { fetchBalances(); setModal(null); setAmount(''); }, 2000);
    } catch (e: any) {
      setError(e.message || 'Transfer failed');
    }
    setProcessing(false);
  };

  // Send/Withdraw handler
  const handleSend = async () => {
    if (!privyWallet || !amount || !recipient) return;

    // Validate balance
    const amountNum = parseFloat(amount);
    if (amountNum > balances[selectedToken as keyof typeof balances]) {
      setError('Insufficient balance');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const connection = new Connection(RPC_URL);
      const fromPubkey = new PublicKey(privyWallet.address);
      const toPubkey = new PublicKey(recipient);

      let tx = new Transaction();

      if (selectedToken === 'SOL') {
        tx.add(SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Math.floor(amountNum * LAMPORTS_PER_SOL)
        }));
      } else {
        const tokenInfo = TOKENS[selectedToken as keyof typeof TOKENS];
        if (!tokenInfo?.mint) throw new Error('Invalid token');

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

      setSuccess(`Sent ${amount} ${selectedToken}`);
      setTimeout(() => { fetchBalances(); setModal(null); setAmount(''); setRecipient(''); }, 2000);
    } catch (e: any) {
      setError(e.message || 'Send failed');
    }
    setProcessing(false);
  };

  const closeModal = () => {
    setModal(null);
    setError('');
    setSuccess('');
    setAmount('');
    setRecipient('');
  };

  if (loading) {
    return <div className="page"><div className="loading">Loading wallet...</div></div>;
  }

  return (
    <>
      <div className="page">
        <h1 className="title">Wallet</h1>

        {/* Wallet Address */}
        <div className="card">
          <div className="card-label">Privy Wallet Address</div>
          <div className="address">{walletAddress}</div>
          <button onClick={() => navigator.clipboard.writeText(walletAddress)} className="copy-btn">
            Copy
          </button>
        </div>

        {/* Balances */}
        <div className="card">
          <div className="card-header">
            <h2>Balances</h2>
            <div className="btn-group">
              <button onClick={() => { setModal('add'); setAddMethod('card'); }} className="btn-primary">+ Add</button>
              <button onClick={() => setModal('send')} className="btn-outline">Send</button>
            </div>
          </div>

          <div className="balances-grid">
            {Object.entries(balances).map(([token, bal]) => (
              <div key={token} className="balance-item">
                <span className="token-symbol">{token}</span>
                <span className="token-amount">
                  {token === 'DLOW' ? bal.toLocaleString() : (bal as number).toFixed(4)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="card">
          <h2>Subscription</h2>
          {subscription ? (
            <div className="subscription-active">
              <span className="package-name">{subscription.packageName}</span>
              <span className="expires">Expires: {new Date(subscription.endDate).toLocaleDateString()}</span>
            </div>
          ) : (
            <div className="no-subscription">
              No active subscription. <a href="/token">Purchase a package</a>
            </div>
          )}
        </div>

        {/* Transactions */}
        <div className="card">
          <h2>Transaction History</h2>
          {transactions.length === 0 ? (
            <div className="empty">No transactions yet</div>
          ) : (
            <div className="tx-list">
              {transactions.slice(0, 10).map((tx: any) => (
                <div key={tx.id} className="tx-item">
                  <div className="tx-info">
                    <span className="tx-type">{tx.type.replace('_', ' ')}</span>
                    <span className="tx-desc">{tx.description}</span>
                  </div>
                  <div className="tx-amount">
                    <span className={tx.type.includes('earn') ? 'positive' : ''}>{tx.amount} {tx.token}</span>
                    <span className="tx-date">{new Date(tx.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Modal */}
      {modal === 'add' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add funds to your SENKAI wallet</h3>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>

            <div className="modal-body">
              <div className="method-tabs">
                <button className={addMethod === 'card' ? 'active' : ''} onClick={() => setAddMethod('card')}>
                  Pay with card
                </button>
                <button className={addMethod === 'wallet' ? 'active' : ''} onClick={() => setAddMethod('wallet')}>
                  Transfer from wallet
                </button>
                <button className={addMethod === 'receive' ? 'active' : ''} onClick={() => setAddMethod('receive')}>
                  Receive funds
                </button>
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              {addMethod === 'card' && (
                <div className="method-content">
                  <p className="hint">Use Privy to add funds via card or exchange</p>
                  <button onClick={handleAddFundsCard} disabled={processing} className="btn-primary full">
                    {processing ? 'Processing...' : 'Open Funding Options'}
                  </button>
                </div>
              )}

              {addMethod === 'wallet' && (
                <div className="method-content">
                  {!externalWallet ? (
                    <p className="warning">No external wallet connected. Connect Phantom or other wallet first.</p>
                  ) : (
                    <>
                      <p className="hint">Transfer from {externalWallet.address.slice(0, 8)}...</p>

                      <div className="form-group">
                        <label>Token</label>
                        <select value={selectedToken} onChange={e => setSelectedToken(e.target.value)}>
                          <option value="SOL">SOL</option>
                          <option value="USDC">USDC</option>
                          <option value="USDT">USDT</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>

                      <button onClick={handleAddFundsFromWallet} disabled={processing || !amount} className="btn-primary full">
                        {processing ? 'Transferring...' : `Transfer ${selectedToken}`}
                      </button>
                    </>
                  )}
                </div>
              )}

              {addMethod === 'receive' && (
                <div className="method-content center">
                  <div className="qr-placeholder">
                    <div className="qr-box">QR</div>
                  </div>
                  <div className="receive-address">{walletAddress}</div>
                  <p className="hint">Send SOL, USDC, or USDT to this address</p>
                  <button onClick={() => { navigator.clipboard.writeText(walletAddress); setSuccess('Copied!'); }} className="btn-primary">
                    Copy Address
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {modal === 'send' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Tokens</h3>
              <button onClick={closeModal} className="close-btn">×</button>
            </div>

            <div className="modal-body">
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="form-group">
                <label>Token</label>
                <select value={selectedToken} onChange={e => setSelectedToken(e.target.value)}>
                  <option value="SOL">SOL (Balance: {balances.SOL.toFixed(4)})</option>
                  <option value="USDC">USDC (Balance: {balances.USDC.toFixed(2)})</option>
                  <option value="USDT">USDT (Balance: {balances.USDT.toFixed(2)})</option>
                </select>
              </div>

              <div className="form-group">
                <label>Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={e => setRecipient(e.target.value)}
                  placeholder="Solana address"
                />
              </div>

              <div className="form-group">
                <label>Amount</label>
                <div className="amount-input">
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                  />
                  <button onClick={() => setAmount(String(balances[selectedToken as keyof typeof balances]))} className="max-btn">
                    MAX
                  </button>
                </div>
              </div>

              <button
                onClick={handleSend}
                disabled={processing || !amount || !recipient || parseFloat(amount) > balances[selectedToken as keyof typeof balances]}
                className={`btn-primary full ${parseFloat(amount || '0') > balances[selectedToken as keyof typeof balances] ? 'error-btn' : ''}`}
              >
                {processing ? 'Sending...' : parseFloat(amount || '0') > balances[selectedToken as keyof typeof balances] ? 'Insufficient Balance' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}


      <style jsx>{`
        .page { min-height: 100vh; background: #000; padding: 32px 24px; max-width: 800px; margin: 0 auto; }
        .title { font-size: 28px; font-weight: 600; margin-bottom: 24px; color: #fff; }
        .loading { text-align: center; padding: 48px; color: #666; }

        .card { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
        .card-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 8px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .card h2 { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 16px; }
        .card-header h2 { margin-bottom: 0; }

        .address { font-family: monospace; font-size: 13px; color: #888; word-break: break-all; margin-bottom: 12px; }
        .copy-btn { padding: 6px 12px; background: #1a1a1a; border: 1px solid #333; border-radius: 4px; color: #888; font-size: 11px; cursor: pointer; }
        .copy-btn:hover { border-color: #555; color: #fff; }

        .btn-group { display: flex; gap: 8px; }
        .btn-primary { padding: 10px 16px; background: #fff; border: none; border-radius: 6px; color: #000; font-size: 12px; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { background: #e0e0e0; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-primary.full { width: 100%; margin-top: 16px; }
        .btn-primary.error-btn { background: #333; color: #888; }
        .btn-outline { padding: 10px 16px; background: transparent; border: 1px solid #333; border-radius: 6px; color: #888; font-size: 12px; cursor: pointer; }
        .btn-outline:hover { border-color: #555; color: #fff; }

        .balances-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .balance-item { background: #111; border-radius: 6px; padding: 16px; text-align: center; }
        .token-symbol { display: block; font-size: 11px; color: #666; margin-bottom: 4px; }
        .token-amount { display: block; font-size: 16px; font-weight: 600; color: #fff; font-family: monospace; }

        .subscription-active { display: flex; justify-content: space-between; align-items: center; }
        .package-name { font-weight: 600; color: #fff; }
        .expires { font-size: 12px; color: #666; }
        .no-subscription { color: #666; font-size: 13px; }
        .no-subscription a { color: #fff; text-decoration: underline; }

        .tx-list { display: flex; flex-direction: column; gap: 8px; }
        .tx-item { display: flex; justify-content: space-between; padding: 12px; background: #111; border-radius: 6px; }
        .tx-info { display: flex; flex-direction: column; gap: 2px; }
        .tx-type { font-size: 13px; font-weight: 500; color: #fff; text-transform: capitalize; }
        .tx-desc { font-size: 11px; color: #666; }
        .tx-amount { text-align: right; }
        .tx-amount span { display: block; }
        .tx-amount .positive { color: #22c55e; }
        .tx-date { font-size: 11px; color: #666; }
        .empty { text-align: center; padding: 32px; color: #666; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal { background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 12px; width: 400px; max-width: 90%; }
        .modal-header { padding: 16px 20px; border-bottom: 1px solid #1a1a1a; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { font-size: 16px; font-weight: 600; color: #fff; }
        .close-btn { background: none; border: none; color: #666; font-size: 24px; cursor: pointer; }
        .modal-body { padding: 20px; }
        .modal-body.center { text-align: center; }

        .method-tabs { display: flex; gap: 6px; margin-bottom: 20px; }
        .method-tabs button { flex: 1; padding: 10px 8px; background: #111; border: 1px solid #222; border-radius: 6px; color: #666; font-size: 11px; cursor: pointer; text-align: center; }
        .method-tabs button.active { border-color: #fff; color: #fff; background: #0a0a0a; }

        .method-content { padding-top: 8px; }
        .hint { font-size: 12px; color: #666; margin-bottom: 16px; }
        .warning { color: #f59e0b; font-size: 12px; }

        .form-group { margin-bottom: 16px; }
        .form-group label { display: block; font-size: 11px; color: #666; margin-bottom: 6px; text-transform: uppercase; }
        .form-group input, .form-group select { width: 100%; padding: 12px; background: #111; border: 1px solid #222; border-radius: 6px; color: #fff; font-size: 14px; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #fff; }

        .amount-input { display: flex; gap: 8px; }
        .amount-input input { flex: 1; }
        .max-btn { padding: 12px 16px; background: #222; border: none; border-radius: 6px; color: #888; font-size: 11px; cursor: pointer; }
        .max-btn:hover { color: #fff; }

        .error { padding: 10px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; color: #ef4444; font-size: 12px; margin-bottom: 16px; }
        .success { padding: 10px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); border-radius: 6px; color: #22c55e; font-size: 12px; margin-top: 12px; }

        .qr-placeholder { margin-bottom: 16px; }
        .qr-box { width: 160px; height: 160px; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; margin: 0 auto; border-radius: 8px; font-size: 24px; font-weight: 600; }
        .receive-address { font-family: monospace; font-size: 11px; color: #666; word-break: break-all; margin-bottom: 8px; }
      `}</style>
    </>
  );
}
