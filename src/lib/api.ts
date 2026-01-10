/**
 * Senkai API Client - Full Implementation
 */

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== 'undefined' ? window.location.origin : '');

// ==================== FETCH HELPERS ====================

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

/**
 * Retry logic with exponential backoff
 */
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetchWithTimeout(url, options);
      return response;
    } catch (error: any) {
      lastError = error;
      console.warn(`Fetch attempt ${i + 1} failed:`, error.message);

      if (i < maxRetries - 1) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, i + 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Failed to fetch after retries');
}

// ==================== AUTH ====================
export async function authenticateWithPrivy(walletAddress: string, referralCode?: string, privyUserId?: string) {
  try {
    const res = await fetchWithRetry(`${API_URL}/api/auth/privy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress, referralCode, privyUserId })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error: any) {
    console.error('authenticateWithPrivy error:', error);
    throw error;
  }
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
  try {
    const res = await fetchWithRetry(`${API_URL}/api/users/${walletAddress}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error: any) {
    console.error('getUserData error:', error);
    return null;
  }
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

  try {
    const res = await fetchWithRetry(`${API_URL}/api/copy/smart-wallets?${params.toString()}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error: any) {
    console.error('listSmartWallets error:', error);
    throw error;
  }
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