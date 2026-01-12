# 🚀 SENKAI Platform Deployment Guide

**Branch:** `claude/production-consolidated-5dULn`
**Latest Commit:** `304b763 - feat: Integrate Privy authentication with email login and embedded Solana wallet`
**Date:** 2026-01-12

---

## ✅ Pre-Deployment Checklist

- [x] Privy integration completed
- [x] All dependencies installed
- [x] Build test passed (npm run build)
- [x] TypeScript errors resolved
- [x] Git commit created and pushed
- [ ] Vercel environment variables verified
- [ ] Deployment triggered
- [ ] Production testing completed

---

## 🔐 Required Environment Variables

### ⚠️ CRITICAL - Privy Configuration

```bash
NEXT_PUBLIC_PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w
```

**Status:** Already set in Vercel (confirmed by user)

### 🗄️ Database - Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# Get your keys from: https://app.supabase.com/project/_/settings/api
```

**Status:** Already set in Vercel

### 🤖 AI & Data APIs

```bash
# Hugging Face (for AI features)
HUGGINGFACE_API_KEY=hf_***************************
# Get your key from: https://huggingface.co/settings/tokens

# CoinGecko (for crypto data)
NEXT_PUBLIC_COINGECKO_API_KEY=CG-***************************
# Get your key from: https://www.coingecko.com/en/api/pricing

# CoinMarketCap (for additional crypto data)
NEXT_PUBLIC_COINMARKETCAP_API_KEY=********-****-****-****-************
# Get your key from: https://coinmarketcap.com/api/pricing/
```

**Status:** Already set in Vercel

### 💳 Stripe Payment Processing

```bash
STRIPE_SECRET_KEY=sk_test_****************************************************
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_****************************************************
STRIPE_WEBHOOK_SECRET=whsec_****************************
# Get your keys from: https://dashboard.stripe.com/test/apikeys
# Note: These are TEST keys. Replace with LIVE keys for production.
```

**Status:** Test keys - Already set in Vercel

### 🔗 App Configuration

```bash
NEXT_PUBLIC_APP_URL=https://senkai.xyz
NEXT_PUBLIC_APP_NAME=SENKAI
NODE_ENV=production
```

**Status:** Already set in Vercel

### 🌐 Solana Network

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

**Status:** Already set in Vercel

### 🔒 Security & Authentication

```bash
JWT_SECRET=your_long_random_secret_minimum_32_chars
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://senkai.xyz
```

**Status:** Should already be set in Vercel (user configured)

### ⚙️ Optional Features

```bash
NEXT_PUBLIC_ENABLE_COPY_TRADING=true
NEXT_PUBLIC_ENABLE_AI_CHAT=true
NEXT_PUBLIC_DEBUG_MODE=false
```

**Status:** Already set in Vercel

---

## 🚀 Deployment Steps

### Option A: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard
   - Select the SENKAI project

2. **Verify Environment Variables**
   - Go to: Settings → Environment Variables
   - Confirm all variables listed above are present
   - **CRITICAL:** Ensure `NEXT_PUBLIC_PRIVY_APP_ID` is set to: `cmjmrxm39022pl10ct4kdn95w`

3. **Check Git Branch**
   - Go to: Settings → Git
   - Verify Production Branch is: `claude/production-consolidated-5dULn`
   - If not, update to this branch

4. **Trigger Deployment**
   - Go to: Deployments tab
   - Click "Deploy" button
   - **OR** it may auto-deploy from the push we just made

5. **Monitor Build**
   - Watch build logs for any errors
   - Build should complete in 3-5 minutes
   - Look for: ✓ Compiled successfully

### Option B: Vercel CLI

```bash
# If you prefer CLI deployment
vercel --prod --force

# Or with no cache to ensure fresh build
vercel --prod --force --no-cache
```

---

## 🧪 Post-Deployment Testing

### 1. Homepage Test

```bash
# Test that homepage loads
curl -I https://senkai.xyz/

# Expected: HTTP/2 200
```

### 2. API Routes Test

```bash
# Test Fear & Greed API
curl https://senkai.xyz/api/fear-greed

# Test Prices API
curl https://senkai.xyz/api/prices?symbol=BTC

# Expected: JSON response, not CORS error
```

### 3. Privy Authentication Test (Manual)

1. **Open app in browser:** https://senkai.xyz/
2. **Click "Launch App"** → Should redirect to /dashboard
3. **Click "Connect Wallet"** button in header
4. **Verify Privy modal appears** with:
   - SENKAI logo
   - Dark theme (#FFFF02 yellow accent)
   - Options: "Continue with email" and wallet options
5. **Test Email Login:**
   - Click "Continue with email"
   - Enter email address
   - Check for OTP code
   - Verify login successful
6. **Test Embedded Wallet:**
   - After email login, check if Solana wallet is auto-created
   - Wallet address should appear in header
   - Format: `ABC1...XYZ9` (shortened address)
7. **Test External Wallet:**
   - Disconnect if logged in
   - Click "Connect Wallet" again
   - Choose Phantom or Solflare
   - Verify connection works

### 4. Browser Console Check

Open DevTools (F12) and verify:

**✅ Should SEE:**
- Privy initialization logs
- Wallet adapter connections
- API calls to `/api/*` (relative paths)
- Successful data fetching

**❌ Should NOT see:**
- `api.senkai.xyz` references (old architecture)
- CORS policy errors
- "Failed to fetch" errors
- "Non-base58 character" errors
- Any Privy configuration errors

### 5. Wallet Pages Test

Navigate to each page and verify functionality:

- **/dashboard** - Should load without errors
- **/portfolio** - Should show wallet balance (after connecting)
- **/swap** - Jupiter swap interface should work
- **/analytics** - Charts and data should display
- **/chat** - AI chat should be functional
- **/copy-trading** - Copy trading features should work

### 6. Mobile Test

- Test on mobile device or Chrome DevTools mobile view
- Verify responsive design works
- Test wallet connection on mobile
- Check bottom navigation (mobile only)

---

## 🔍 Troubleshooting

### Issue: "NEXT_PUBLIC_PRIVY_APP_ID is not set" in console

**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Add: `NEXT_PUBLIC_PRIVY_APP_ID` = `cmjmrxm39022pl10ct4kdn95w`
3. Redeploy

### Issue: Still seeing CORS errors

**Check:**
1. Verify correct branch is deployed (`claude/production-consolidated-5dULn`)
2. Clear Vercel build cache (Deployments → Redeploy → uncheck "Use existing cache")
3. Check `next.config.js` has CORS headers (it does in our code)

### Issue: Wallet not connecting

**Check:**
1. Browser console for Privy errors
2. Verify `NEXT_PUBLIC_PRIVY_APP_ID` is correct
3. Check if Privy dashboard has the correct app settings
4. Ensure allowed domains include `app.senkai.xyz`

### Issue: API routes returning 404

**Possible causes:**
1. Wrong branch deployed
2. API routes not included in build
3. Vercel routing configuration issue

**Solution:**
```bash
# Verify API routes exist locally
ls -la app/api/

# Should show: fear-greed, prices, klines, etc.
```

### Issue: Build fails on Vercel

**Check build logs for:**
- Missing dependencies (should all be in package.json now)
- TypeScript errors (we fixed all of them)
- Environment variable issues

**Solution:**
- Review build logs in Vercel dashboard
- May need to run `npm install` to update package-lock.json
- Ensure Node.js version is 18+ (set in Vercel settings if needed)

---

## 📊 Success Criteria

Deployment is successful when:

- ✅ Build completes without errors
- ✅ Homepage loads at https://senkai.xyz/
- ✅ API routes return data (not 404 or CORS errors)
- ✅ Privy authentication modal appears
- ✅ Email login works
- ✅ Embedded wallet is created after login
- ✅ External wallet connection works (Phantom, Solflare)
- ✅ Portfolio page shows balances
- ✅ No console errors related to authentication
- ✅ All pages load without critical errors
- ✅ Mobile responsive design works

---

## 📝 Post-Deployment Notes

### What Changed in This Deployment

1. **Authentication System:** Migrated from standalone Solana Wallet Adapter to Privy
2. **Email Login:** Users can now sign in with email (OTP)
3. **Embedded Wallets:** Privy auto-creates Solana wallets for email users
4. **Better UX:** Single authentication flow for both email and wallet users
5. **Simplified Code:** Removed duplicate wallet provider in platform layout

### Architecture Overview

```
app.senkai.xyz (Frontend)
├── Privy Authentication (email + wallet)
├── Next.js API Routes (/api/*)
│   ├── /api/fear-greed
│   ├── /api/prices
│   ├── /api/klines
│   └── ... (all backend logic)
├── Supabase (Database)
└── External APIs (CoinGecko, CoinMarketCap, Stripe, etc.)
```

**No separate backend server needed** - All API logic is in Next.js API Routes

### Key Features Enabled

- 🔐 Email + OTP login
- 👛 Embedded Solana wallet (auto-created)
- 🔗 External wallet support (Phantom, Solflare, Coinbase, etc.)
- 📊 Real-time portfolio tracking
- 💱 Jupiter swap integration
- 📈 Analytics and charts
- 🤖 AI chat (Hugging Face)
- 📋 Copy trading features
- 💳 Stripe payment processing

---

## 🎯 Next Steps After Deployment

1. **Monitor for 10 minutes** after deployment
   - Check error logs in Vercel
   - Watch for any runtime errors
   - Test critical user flows

2. **User Acceptance Testing**
   - Test with real users
   - Gather feedback on authentication flow
   - Monitor Privy analytics dashboard

3. **Performance Monitoring**
   - Check page load times
   - Monitor API response times
   - Watch for any performance regressions

4. **Documentation Update**
   - Update user guides with new login flow
   - Document Privy integration for team
   - Create troubleshooting guide for support

---

## 📞 Support Resources

- **Privy Documentation:** https://docs.privy.io/
- **Privy Dashboard:** https://dashboard.privy.io/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Repository:** tuantran12/JS
- **Current Branch:** `claude/production-consolidated-5dULn`

---

**Deployment prepared by:** Claude Code Agent
**Last updated:** 2026-01-12
**Status:** ✅ Ready for deployment
