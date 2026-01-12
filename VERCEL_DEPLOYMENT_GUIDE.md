# 🚀 VERCEL DEPLOYMENT GUIDE - SENKAI PLATFORM

**Branch:** `claude/production-consolidated-5dULn`
**Last Update:** 2026-01-11
**Status:** ✅ Production Ready

---

## ⚡ QUICK START

### Step 1: Deploy via Vercel CLI

```bash
# Make sure you're on the correct branch
git checkout claude/production-consolidated-5dULn

# Deploy to production
vercel --prod --force --no-cache
```

### Step 2: Set Environment Variables

Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

---

## 📋 ENVIRONMENT VARIABLES - COMPLETE LIST

### 🔴 CRITICAL - REQUIRED FOR BASIC FUNCTIONALITY

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://app.senkai.xyz
NEXT_PUBLIC_APP_NAME=SENKAI

# Solana Blockchain (REQUIRED for wallet connection)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

**Notes:**
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `NEXT_PUBLIC_SOLANA_RPC_URL` - Free: `https://api.mainnet-beta.solana.com` or paid RPC for better performance

---

### 🟡 IMPORTANT - NEEDED FOR CORE FEATURES

```bash
# Database (Supabase) - For user data, transactions, portfolio
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (Payments) - For subscriptions
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...

# Hugging Face (AI Chat) - For AI assistant feature
HUGGINGFACE_API_KEY=hf_...
NEXT_PUBLIC_AI_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

**How to Get:**
- **Supabase:** https://supabase.com → Create Project → Settings → API
- **Stripe:** https://dashboard.stripe.com → Developers → API Keys
- **Hugging Face:** https://huggingface.co → Settings → Access Tokens

---

### 🟢 OPTIONAL - FOR ENHANCED FEATURES

```bash
# Market Data APIs (for accurate prices & analytics)
NEXT_PUBLIC_COINGECKO_API_KEY=CG-...
NEXT_PUBLIC_COINMARKETCAP_API_KEY=...

# Analytics & Monitoring
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SENTRY_DSN=https://xxx@o0.ingest.sentry.io/xxx

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@senkai.xyz

# Security
JWT_SECRET=your_very_long_random_secret_minimum_32_characters
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://app.senkai.xyz

# Feature Flags
NEXT_PUBLIC_ENABLE_COPY_TRADING=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_ENABLE_REFERRALS=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# Debug (set to false in production)
NEXT_PUBLIC_DEBUG_MODE=false
NODE_ENV=production
```

**Free Tiers:**
- **CoinGecko:** https://www.coingecko.com/en/api/pricing (Free: 10-50 calls/min)
- **CoinMarketCap:** https://coinmarketcap.com/api/pricing/ (Free: 10,000 calls/month)
- **Google Analytics:** https://analytics.google.com (Free)
- **Sentry:** https://sentry.io (Free: 5,000 errors/month)

---

## ❌ VARIABLES TO REMOVE (OLD ARCHITECTURE)

If you have these variables from old deployments, **DELETE THEM**:

```bash
❌ NEXT_PUBLIC_BACKEND_URL
❌ BACKEND_URL
❌ API_URL
❌ PRIVY_APP_ID
❌ PRIVY_APP_SECRET
❌ NEXT_PUBLIC_PRIVY_APP_ID
❌ PRIVY_CLIENT_ID
❌ PRIVY_CLIENT_SECRET
```

**Why?** New architecture uses Next.js API Routes (no separate backend) and Solana Wallet Adapter (no Privy).

---

## 🎯 ENVIRONMENT VARIABLE PRIORITIES

### Tier 1: MUST HAVE (Can't deploy without these)
1. `NEXT_PUBLIC_APP_URL`
2. `NEXT_PUBLIC_SOLANA_RPC_URL`
3. `NEXT_PUBLIC_SOLANA_NETWORK`

### Tier 2: SHOULD HAVE (Core features won't work)
4. `NEXT_PUBLIC_SUPABASE_URL`
5. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. `SUPABASE_SERVICE_ROLE_KEY`
7. `STRIPE_SECRET_KEY` (if accepting payments)
8. `STRIPE_WEBHOOK_SECRET` (if accepting payments)

### Tier 3: NICE TO HAVE (Enhanced features)
9. `HUGGINGFACE_API_KEY` (AI chat)
10. `NEXT_PUBLIC_COINGECKO_API_KEY` (better price data)
11. `NEXT_PUBLIC_COINMARKETCAP_API_KEY` (alternative price data)

### Tier 4: OPTIONAL (Analytics & monitoring)
12. `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`
13. `NEXT_PUBLIC_SENTRY_DSN`

---

## 🔒 SECURITY BEST PRACTICES

### 1. Never Commit Secrets to Git
```bash
# Always use .env.local for local development
# Never commit .env files

# .gitignore already includes:
.env
.env.local
.env.production
.env.*.local
```

### 2. Use Strong Secrets
```bash
# Generate strong JWT_SECRET
openssl rand -base64 32

# Generate strong NEXTAUTH_SECRET
openssl rand -hex 32
```

### 3. Vercel Environment Scopes
- **Production:** Only production deployments
- **Preview:** Preview deployments (PRs)
- **Development:** Local development with `vercel dev`

**Recommendation:** Set all secrets to "Production" scope only.

---

## 📊 VERIFICATION AFTER DEPLOYMENT

### 1. Check Build Logs
```bash
# In Vercel Dashboard → Deployments → Latest → View Function Logs

✅ Look for:
- "Compiled successfully"
- No CORS errors
- No missing env var warnings

❌ Watch out for:
- "Failed to compile"
- "Missing environment variable"
- "Module not found"
```

### 2. Test Environment Variables
```javascript
// Open browser console on your deployed site
console.log(process.env.NEXT_PUBLIC_APP_URL);
// Should output: https://app.senkai.xyz (not undefined)

console.log(process.env.NEXT_PUBLIC_SOLANA_NETWORK);
// Should output: mainnet-beta (not undefined)
```

### 3. Test API Routes
```bash
# Test prices API
curl https://app.senkai.xyz/api/prices?symbol=BTC
# Should return: JSON with price data

# Test fear-greed API
curl https://app.senkai.xyz/api/fear-greed
# Should return: JSON with fear & greed index

# Should NOT see:
# - CORS errors
# - 404 errors
# - Authentication required errors (for public APIs)
```

### 4. Test Wallet Connection
1. Go to: https://app.senkai.xyz/wallet
2. Click "Connect Wallet"
3. Should see: Phantom, Solflare, and other Solana wallets
4. Should NOT see: Privy modal or "api.senkai.xyz" errors

---

## 🐛 TROUBLESHOOTING

### Issue: Build fails with "Missing environment variable"

**Solution:**
1. Check Vercel Dashboard → Settings → Environment Variables
2. Ensure variable is set for "Production" environment
3. Redeploy

### Issue: API routes return 404

**Solution:**
```bash
# Check that you deployed the correct branch
vercel ls

# Should show: claude-production-consolidated-5dULn

# If not, redeploy correct branch:
git checkout claude/production-consolidated-5dULn
vercel --prod --force
```

### Issue: CORS errors in console

**Possible causes:**
1. Deployed wrong branch (old architecture)
2. Environment variables point to old backend

**Solution:**
1. Verify branch: `claude/production-consolidated-5dULn`
2. Remove old env vars: `NEXT_PUBLIC_BACKEND_URL`, `API_URL`
3. Clear build cache and redeploy: `vercel --prod --force --no-cache`

### Issue: Wallet won't connect

**Check:**
1. `NEXT_PUBLIC_SOLANA_RPC_URL` is set
2. `NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta`
3. No Privy-related env vars
4. Browser console shows Solana wallet adapter (not Privy)

**Debug:**
```javascript
// Browser console
console.log(window.solana); // Should show Phantom wallet
console.log(window.solflare); // Should show Solflare wallet
```

### Issue: "Non-base58 character" errors

**This was FIXED in latest code:**
- Wallet validation added to portfolio and transactions pages
- If you still see this, redeploy latest code:
  ```bash
  git pull origin claude/production-consolidated-5dULn
  vercel --prod --force
  ```

---

## 🎯 DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] On correct branch: `claude/production-consolidated-5dULn`
- [ ] Latest commit: `287aab0` or newer
- [ ] No uncommitted changes: `git status` shows clean
- [ ] Build passes locally: `npm run build`

### Vercel Setup

- [ ] Project created in Vercel
- [ ] Git repository connected
- [ ] Production branch set to: `claude/production-consolidated-5dULn`
- [ ] All required environment variables set (Tier 1 + Tier 2)
- [ ] Old environment variables removed (Privy, BACKEND_URL, etc.)

### Post-Deployment

- [ ] Build succeeded (check Vercel dashboard)
- [ ] No errors in build logs
- [ ] Homepage loads: https://app.senkai.xyz
- [ ] API routes work (test with curl)
- [ ] Wallet connection works (test in browser)
- [ ] No CORS errors in console
- [ ] No "api.senkai.xyz" references in console
- [ ] No "Failed to fetch" errors
- [ ] No "Non-base58 character" errors

### Monitoring (First 24 Hours)

- [ ] Monitor Vercel Function Logs
- [ ] Monitor browser console for errors
- [ ] Test all major features:
  - [ ] Wallet connection
  - [ ] Portfolio view
  - [ ] Token swap
  - [ ] Copy trading
  - [ ] AI chat
  - [ ] Subscription/payments
- [ ] Check Sentry for errors (if configured)
- [ ] Check Google Analytics for traffic (if configured)

---

## 📞 SUPPORT & RESOURCES

### Documentation
- Main: `README.md`
- Deployment: `DEPLOY.md` (deprecated - use this guide)
- Production Fixes: `PRODUCTION_FIXES.md`
- Critical Errors: `CRITICAL_PRODUCTION_ERRORS.md`
- Consolidation: `CONSOLIDATION_REPORT.md`

### External Resources
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Solana Docs:** https://docs.solana.com
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs

### Emergency Contacts
- **Vercel Support:** https://vercel.com/support
- **GitHub Issues:** https://github.com/tuantran12/JS/issues

---

## 🎉 SUCCESS CRITERIA

Your deployment is successful when:

✅ Homepage loads without errors
✅ Wallet connection button appears and works
✅ Connect wallet shows Solana wallets (Phantom, Solflare, etc.)
✅ Can connect wallet successfully
✅ Portfolio page shows "Connect Your Wallet" (before connection)
✅ Portfolio page shows balances (after connection)
✅ API routes return JSON data (not 404 or CORS errors)
✅ No console errors related to:
   - CORS policy
   - api.senkai.xyz
   - Privy authentication
   - Non-base58 character
   - Failed to fetch
✅ Build logs show "Compiled successfully"
✅ All pages load without 500 errors

---

*Generated by Claude Code Agent - 2026-01-11*
*Branch: claude/production-consolidated-5dULn*
*Commit: 287aab0*
