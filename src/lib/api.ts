/**
 * Senkai API Client - Full Implementation
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// ==================== AUTH ====================
export async function authenticateWithPrivy(walletAddress: string, referralCode?: string, privyUserId?: string) {
  const res = await fetch(`${API_URL}/api/auth/privy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, referralCode, privyUserId })
  });
  return res.json();
}

export async function toggleAutoTrade(token: string, enabled: boolean) {
  const res = await fetch(`${API_URL}/api/users/auto-trade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ enabled })
  });
  return res.json();
}

// ==================== USERS ====================
export async function getUserData(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/users/${walletAddress}`);
  if (!res.ok) return null;
  return res.json();
}

export async function getUserStats(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/users/${walletAddress}/stats`);
  return res.json();
}

// ==================== SUBSCRIPTIONS ====================
export async function getSubscriptions(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/subscriptions/${walletAddress}`);
  return res.json();
}

export async function purchaseSubscription(data: {
  walletAddress: string;
  packageName: string;
  packageType: 'monthly' | 'yearly';
  priceUsd: number;
  paymentToken: string;
  txSignature: string;
}) {
  const res = await fetch(`${API_URL}/api/subscriptions/purchase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getPackages() {
  const res = await fetch(`${API_URL}/api/subscriptions/packages/list`);
  return res.json();
}

// ==================== STAKES ====================
export async function getStakes(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/stakes/${walletAddress}`);
  return res.json();
}

export async function createStake(token: string, data: any) {
  const res = await fetch(`${API_URL}/api/stakes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function requestUnstake(token: string, data: any) {
  const res = await fetch(`${API_URL}/api/stakes/unstake`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function claimUnstake(token: string, data: any) {
  const res = await fetch(`${API_URL}/api/stakes/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

// ==================== REFERRALS ====================
export async function getReferralData(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/referrals/${walletAddress}`);
  return res.json();
}

export async function applyReferralCode(walletAddress: string, referralCode: string) {
  const res = await fetch(`${API_URL}/api/referrals/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, referralCode })
  });
  return res.json();
}

// ==================== TRANSACTIONS ====================
export async function getTransactions(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/transactions/${walletAddress}`);
  return res.json();
}

export async function getTransactionSummary(walletAddress: string) {
  const res = await fetch(`${API_URL}/api/transactions/${walletAddress}/summary`);
  return res.json();
}

// ==================== COPY TRADING ====================
export async function getCopyConfig() {
  const res = await fetch(`${API_URL}/api/copy/config`);
  return res.json();
}

export async function listSmartWallets(token: string, opts: { search?: string; sort?: string; tag?: string; period?: string } = {}) {
  const params = new URLSearchParams();
  if (opts.search) params.set('search', opts.search);
  if (opts.sort) params.set('sort', opts.sort);
  if (opts.tag) params.set('tag', opts.tag);
  if (opts.period) params.set('period', opts.period);
  
  const res = await fetch(`${API_URL}/api/copy/smart-wallets?${params.toString()}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });
  return res.json();
}

export async function getSmartWalletDetail(token: string, id: string) {
  const res = await fetch(`${API_URL}/api/copy/smart-wallets/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function followSmartWallet(token: string, smartWalletId: string, mode: 'live' | 'sim', settings: any = {}) {
  const res = await fetch(`${API_URL}/api/copy/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ smartWalletId, mode, ...settings })
  });
  return res.json();
}

export async function unfollowSmartWallet(token: string, smartWalletId: string, mode: 'live' | 'sim' = 'live') {
  const res = await fetch(`${API_URL}/api/copy/unfollow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ smartWalletId, mode })
  });
  return res.json();
}

export async function getFollowing(token: string) {
  const res = await fetch(`${API_URL}/api/copy/following`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getPositions(token: string, opts: { mode?: string; status?: string; smartWalletId?: string; exitOrders?: string } = {}) {
  const params = new URLSearchParams();
  if (opts.mode) params.set('mode', opts.mode);
  if (opts.status) params.set('status', opts.status);
  if (opts.smartWalletId) params.set('smartWalletId', opts.smartWalletId);
  if (opts.exitOrders) params.set('exitOrders', opts.exitOrders);
  
  const res = await fetch(`${API_URL}/api/copy/positions?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function closePosition(token: string, positionId: string, closePercent: number = 100) {
  const res = await fetch(`${API_URL}/api/copy/close-position`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ positionId, closePercent })
  });
  return res.json();
}

export async function startSimulator(token: string) {
  const res = await fetch(`${API_URL}/api/copy/sim-start`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getCopyMetrics(token: string) {
  const res = await fetch(`${API_URL}/api/copy/metrics/summary`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function bookmarkWallet(token: string, smartWalletId: string, bookmarked: boolean) {
  const res = await fetch(`${API_URL}/api/copy/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ smartWalletId, bookmarked })
  });
  return res.json();
}

// ==================== MARKET DATA ====================
export async function getSOLPrice() {
  const res = await fetch(`${API_URL}/api/market/sol-price`);
  return res.json();
}

export async function getTopTokens() {
  const res = await fetch(`${API_URL}/api/market/top-tokens`);
  return res.json();
}

export async function getDEXPools() {
  const res = await fetch(`${API_URL}/api/market/dex-pools`);
  return res.json();
}

export async function getDEXTrades() {
  const res = await fetch(`${API_URL}/api/market/dex-trades`);
  return res.json();
}

export async function getMarketDashboard() {
  const res = await fetch(`${API_URL}/api/market/dashboard`);
  return res.json();
}