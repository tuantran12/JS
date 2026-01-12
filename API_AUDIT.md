# 🔍 API AUDIT & FIX PLAN - SENKAI PLATFORM

**Date:** 2026-01-11
**Branch:** `claude/production-consolidated-5dULn`
**Status:** 🔍 Analyzing

---

## ⚠️ CRITICAL ARCHITECTURE CLARIFICATION

### 🚨 IMPORTANT: PRIVY vs SOLANA WALLET ADAPTER

User mentioned: `PRIVY_APP_ID: cmjmrxm39022pl10ct4kdn95w`

**HOWEVER:**
- ❌ **Current branch DOES NOT use Privy**
- ✅ **Current branch uses Solana Wallet Adapter**
- ❌ **No Privy authentication routes exist**
- ❌ **No Privy SDK integrated**

### Architecture Decision Required:

**Option A: Continue with Solana Wallet Adapter (CURRENT)**
- ✅ No separate backend needed
- ✅ Direct wallet connection (Phantom, Solflare, etc.)
- ✅ Simpler architecture
- ✅ All code ready in current branch
- ❌ No email/social login
- ❌ No embedded wallet

**Option B: Switch back to Privy**
- ✅ Email/social login support
- ✅ Embedded wallet for users
- ✅ Better UX for non-crypto users
- ❌ Requires separate backend
- ❌ More complex architecture
- ❌ Need to revert to old branch OR
- ❌ Major refactoring required

**🎯 RECOMMENDATION:**
Continue with **Solana Wallet Adapter** (current architecture) UNLESS user specifically wants Privy features (email login, embedded wallet).

---

## 📋 API ROUTES INVENTORY

### ✅ Existing API Routes (13 total)

| Route | Purpose | External API | Status |
|-------|---------|--------------|--------|
| `/api/altcoin-season` | Altcoin season index | Binance | ✅ Implemented |
| `/api/chat` | AI chat assistant | Hugging Face | ✅ Implemented |
| `/api/etf` | ETF data | CoinGecko | ✅ Implemented |
| `/api/fear-greed` | Fear & Greed index | Alternative.me | ✅ Implemented |
| `/api/funding-rate` | Funding rates | Binance Futures | ✅ Implemented |
| `/api/klines` | Candlestick data | Binance | ✅ Implemented |
| `/api/liquidations` | Liquidation data | Binance | ✅ Implemented |
| `/api/long-short` | Long/Short ratios | Binance | ✅ Implemented |
| `/api/open-interest` | Open interest | Binance | ✅ Implemented |
| `/api/prices` | Token prices | CoinGecko/Binance | ✅ Implemented |
| `/api/rsi` | RSI indicator | Binance | ✅ Implemented |
| `/api/stripe/create-checkout-session` | Stripe checkout | Stripe API | ✅ Implemented |
| `/api/webhooks/stripe` | Stripe webhooks | Stripe | ✅ Implemented |

### ❌ Missing API Routes (if continuing with current architecture)

None - All necessary routes for Solana Wallet Adapter architecture exist.

### ⚠️ Missing API Routes (if switching to Privy)

If user wants Privy, we need:
- `/api/auth/privy` - Privy authentication
- `/api/auth/verify` - Token verification
- `/api/users/*` - User management
- `/api/transactions/*` - Transaction tracking
- `/api/copy/*` - Copy trading backend

---

## 🔍 API ERROR ANALYSIS

### Common Error Patterns

#### 1. Geographic Restrictions (451/403)
```
Binance API restricted (451/403), using fallback data
```

**Cause:** Binance blocks certain regions
**Solution:** ✅ Already handled with fallback data
**Impact:** ⚠️ Minor - Shows simulated data instead of real

#### 2. Missing API Keys
```
CoinGecko API failed, trying Binance: Request failed with status code 403
```

**Cause:** Missing or invalid API keys
**Solution:** Set proper API keys in Vercel:
- `NEXT_PUBLIC_COINGECKO_API_KEY`
- `NEXT_PUBLIC_COINMARKETCAP_API_KEY`
- `HUGGINGFACE_API_KEY`

#### 3. Rate Limiting
```
All OI requests failed, using fallback data
```

**Cause:** Too many requests to free-tier APIs
**Solution:**
- Add proper caching (already implemented)
- Upgrade to paid API tiers
- Use fallback data (already implemented)

---

## 🔑 ENVIRONMENT VARIABLES AUDIT

### ✅ Currently Set (Based on user info)

```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com ✅
```

### ❌ NOT APPLICABLE (Current Architecture)

```bash
PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w ❌ NOT USED
```

**Reason:** Current code does not use Privy. This variable will be ignored.

### 🟡 SHOULD BE SET (For better functionality)

```bash
# Required
NEXT_PUBLIC_APP_URL=https://app.senkai.xyz
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Recommended for better data
NEXT_PUBLIC_COINGECKO_API_KEY=your_key
NEXT_PUBLIC_COINMARKETCAP_API_KEY=your_key
HUGGINGFACE_API_KEY=hf_...

# For payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# For database (if using)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## 🐛 KNOWN API ISSUES & FIXES

### Issue 1: API Keys Not Set

**Symptoms:**
- CoinGecko returns 403
- CoinMarketCap returns 401
- Fallback to simulated data

**Fix:**
```bash
# In Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_COINGECKO_API_KEY=CG-...
NEXT_PUBLIC_COINMARKETCAP_API_KEY=...
```

### Issue 2: Binance Geographic Restrictions

**Symptoms:**
- 451 errors from Binance
- "API restricted" messages

**Fix:**
Already handled with fallback data. To get real data:
- Use VPN/proxy (not recommended)
- Use alternative APIs (CoinGecko, CoinMarketCap)
- Upgrade Binance API tier

### Issue 3: Rate Limiting

**Symptoms:**
- Multiple failed requests
- "All requests failed" messages

**Fix:**
✅ Already implemented:
- In-memory caching with TTL
- Retry logic with exponential backoff
- Fallback data system

**Enhancement:**
```typescript
// Increase cache TTL in lib/api.ts
const CACHE_TTL = {
  prices: 30000,    // 30s → 60000 (1 min)
  tickers: 60000,   // 1 min → 120000 (2 min)
  klines: 120000,   // 2 min → 300000 (5 min)
};
```

### Issue 4: CORS Errors (if any)

**Symptoms:**
- "blocked by CORS policy"
- Cross-origin errors

**Fix:**
✅ Already configured in `next.config.js`:
```javascript
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: '*' },
      // ... other CORS headers
    ],
  },
];
```

---

## 🎯 RECOMMENDED ACTIONS

### Immediate (Required)

1. **Clarify Architecture Choice**
   - ✅ Keep Solana Wallet Adapter (current)
   - ❌ OR switch to Privy (requires major work)

2. **Set Missing Environment Variables**
   ```bash
   NEXT_PUBLIC_APP_URL=https://app.senkai.xyz
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   NEXT_PUBLIC_COINGECKO_API_KEY=...
   HUGGINGFACE_API_KEY=hf_...
   ```

3. **Remove Unused Variables**
   ```bash
   # Delete from Vercel if exists:
   PRIVY_APP_ID ❌
   PRIVY_APP_SECRET ❌
   ```

### Short-term (Nice to have)

4. **Get API Keys**
   - CoinGecko: https://www.coingecko.com/en/api/pricing
   - CoinMarketCap: https://coinmarketcap.com/api/pricing/
   - Hugging Face: https://huggingface.co/settings/tokens

5. **Increase Cache TTL**
   - Reduce API calls
   - Better performance
   - Lower rate limit risk

### Long-term (Optimization)

6. **Upgrade RPC Provider**
   - Current: Free Solana RPC (rate limited)
   - Upgrade to: Helius, Quicknode, or Alchemy
   - Better: reliability, speed, rate limits

7. **Add API Monitoring**
   - Sentry for error tracking
   - Log API failures
   - Alert on rate limits

---

## 🧪 API TESTING PLAN

### Manual Testing

```bash
# Test each API route
curl https://app.senkai.xyz/api/fear-greed
curl https://app.senkai.xyz/api/prices?symbol=BTC
curl https://app.senkai.xyz/api/altcoin-season
curl https://app.senkai.xyz/api/klines?symbol=BTCUSDT&interval=1h
# ... test all 13 endpoints
```

### Expected Results

✅ **Good Response:**
```json
{
  "data": { ... },
  "source": "binance" | "coingecko" | "fallback",
  "lastUpdated": 1234567890
}
```

⚠️ **Fallback Response (OK):**
```json
{
  "data": { ... },
  "source": "fallback",
  "fallback": true,
  "message": "Live data temporarily unavailable"
}
```

❌ **Error Response (Need Fix):**
```json
{
  "error": "Failed to fetch data",
  "message": "..."
}
```

---

## 📊 API HEALTH STATUS

| Category | Status | Notes |
|----------|--------|-------|
| **Build** | ✅ PASS | Compiled successfully |
| **API Routes** | ✅ EXIST | All 13 routes implemented |
| **Error Handling** | ✅ GOOD | Try-catch + fallbacks |
| **CORS** | ✅ CONFIGURED | Headers set |
| **Caching** | ✅ IMPLEMENTED | In-memory with TTL |
| **Retry Logic** | ✅ IMPLEMENTED | Exponential backoff |
| **Fallback Data** | ✅ IMPLEMENTED | For blocked regions |
| **API Keys** | ⚠️ MISSING | Need to set in Vercel |
| **Rate Limiting** | ⚠️ MINOR | Free tier limits |
| **Geographic Blocks** | ⚠️ EXPECTED | Binance restrictions |

**Overall:** 🟢 **GOOD** - APIs work with fallbacks

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Deploy

- [ ] Confirm architecture: Solana Wallet Adapter (NOT Privy)
- [ ] Set environment variables in Vercel
- [ ] Remove PRIVY_* variables (not used)
- [ ] Verify SOLANA_RPC_URL set
- [ ] Get and set API keys (optional but recommended)

### Deploy

- [ ] Deploy: `vercel --prod --force --no-cache`
- [ ] Wait for build to complete
- [ ] Check deployment URL

### Post-Deploy

- [ ] Test homepage loads
- [ ] Test wallet connection works
- [ ] Test API endpoints return data (even if fallback)
- [ ] Check console for errors
- [ ] Verify no CORS errors
- [ ] Verify no authentication errors

---

## 💡 RECOMMENDATIONS FOR USER

### If You Want Privy Integration:

**You need to decide:**
1. Is email/social login important?
2. Do you need embedded wallets?
3. Are you willing to add backend complexity?

**If YES to above:**
- We need to integrate Privy SDK
- Add authentication backend routes
- Modify wallet connection flow
- Estimated: 4-6 hours work

**If NO:**
- Continue with Solana Wallet Adapter
- Remove PRIVY_APP_ID from environment
- Focus on optimizing current APIs

### Immediate Next Steps:

1. **Clarify:** Do you want Privy or continue with Solana Wallet Adapter?

2. **Set Env Vars:** (I'll provide exact command)

3. **Deploy:** I'll deploy and test everything

4. **Monitor:** Check for 24 hours, fix any issues

---

*Generated by Claude Code Agent - 2026-01-11*
*Awaiting architecture confirmation*
