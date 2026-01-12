# 🔄 COMPREHENSIVE RESET & DEPLOYMENT PLAN

**Date:** 2026-01-12
**Branch:** `claude/crypto-analytics-platform-5dULn`
**Purpose:** Step-by-step guide for comprehensive platform reset and production deployment

---

## 📋 OVERVIEW

This document provides a complete, systematic approach to reset and deploy the SENKAI platform from a clean slate while preserving critical data and configurations.

---

## ✅ PHASE 1: CONFIGURATION AUDIT & CLEANUP (COMPLETED)

### Completed Tasks:

1. ✅ **Comprehensive Audit Report Created**
   - File: `COMPREHENSIVE_AUDIT_REPORT.md`
   - Documented all 13 API endpoints
   - Inventoried all App IDs and credentials
   - Listed all 35+ environment variables
   - Identified hardcoded domains
   - Reviewed configuration files

2. ✅ **New Configuration Files Created**
   - `.env.production.local.template` - Complete production env template
   - `vercel.production.json` - Clean Vercel configuration
   - `next.config.production.js` - Optimized Next.js configuration

3. ✅ **Issues Identified and Fixed**
   - vercel.json secret reference removed
   - Domain inconsistencies resolved (app.senkai.xyz → senkai.xyz)
   - Middleware redirect removed
   - Redundant env vars identified

---

## 🚀 PHASE 2: PRODUCTION DEPLOYMENT (CURRENT)

### 2.1 - Verify Current Deployment Status

**Action:** Check Vercel deployment from commit `4bfeea2`

```bash
# Check if auto-deploy triggered
# Go to: https://vercel.com/dashboard
# Look for: Build from commit "fix: Update production domain..."
```

**Expected:** Build should be in progress or completed

**If Failed:** Check build logs for specific errors

### 2.2 - Privy Dashboard Configuration

**Action:** Verify and update Privy allowed origins

```bash
# 1. Login to Privy Dashboard
https://dashboard.privy.io/

# 2. Select App: SENKAI (App ID: cmjmrxm39022pl10ct4kdn95w)

# 3. Go to: Settings → Allowed Origins

# 4. Ensure these origins are present:
✅ http://localhost:3000 (for development)
✅ https://senkai.xyz (production)
✅ https://www.senkai.xyz (production www)

# 5. Remove if not needed:
❓ https://app.senkai.xyz
❓ https://www.app.senkai.xyz

# 6. Save changes
```

### 2.3 - Verify Vercel Environment Variables

**Action:** Check all required environment variables are set

```bash
# Go to: https://vercel.com/dashboard/[your-project]/settings/environment-variables

# CRITICAL (Must be set):
NEXT_PUBLIC_PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w
PRIVY_APP_ID=cmjmrxm39022pl10ct4kdn95w
NEXT_PUBLIC_SUPABASE_URL=[your-supabase-url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_APP_URL=https://senkai.xyz

# IMPORTANT (For full features):
STRIPE_SECRET_KEY=[your-stripe-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your-stripe-publishable]
STRIPE_WEBHOOK_SECRET=[your-webhook-secret]
HUGGINGFACE_API_KEY=[your-hf-key]
JWT_SECRET=[your-jwt-secret]

# REMOVE (Redundant):
FRONTEND_URL=[remove this]
NEXT_PUBLIC_BACKEND_URL=[remove this]
```

### 2.4 - Update Production Configuration Files (Optional)

If you want to use the new clean configuration files:

```bash
# Replace existing files with new clean versions
cp vercel.production.json vercel.json
cp next.config.production.js next.config.js

# Review and commit changes
git add vercel.json next.config.js
git commit -m "chore: Update to clean production configuration"
git push -u origin claude/crypto-analytics-platform-5dULn
```

### 2.5 - Production Testing Checklist

Once deployment succeeds, test these:

**Basic Functionality:**
```bash
# 1. Homepage loads
curl -I https://senkai.xyz/
# Expected: HTTP/2 200 OK

# 2. API routes respond
curl https://senkai.xyz/api/prices
curl https://senkai.xyz/api/fear-greed
# Expected: JSON responses

# 3. Dashboard accessible
# Visit: https://senkai.xyz/dashboard
# Expected: Loads without errors
```

**Privy Authentication:**
```
1. Visit https://senkai.xyz/
2. Click "Launch App"
3. Click "Connect Wallet"
4. Verify Privy modal appears with:
   - SENKAI logo
   - Dark theme with #FFFF02 accent
   - Email login option
5. Test email login:
   - Enter email → Receive OTP
   - Enter OTP → Login successful
6. Check embedded wallet created:
   - Wallet address shows in header
   - Format: ABC1...XYZ9
7. Test disconnect and reconnect
8. Test external wallet (Phantom/Solflare)
```

**Wallet Functionality:**
```
1. Navigate to /portfolio
2. Verify wallet balance loads
3. Check for errors in browser console (F12)
4. Navigate to /swap
5. Verify Jupiter swap interface loads
6. Test all platform pages:
   - /dashboard
   - /analytics
   - /chat
   - /copy-trading
   - /transactions
```

**Browser Console Check:**
```
Press F12 → Console tab

✅ Should SEE:
- Privy initialization logs
- Successful API calls to /api/*
- Wallet adapter connections

❌ Should NOT see:
- CORS errors
- "NEXT_PUBLIC_PRIVY_APP_ID is not set"
- "api.senkai.xyz" references (old domain)
- "Non-base58 character" errors
- Failed fetch errors
```

---

## 🔄 PHASE 3: FRESH START RESET (IF NEEDED)

### When to Use This Phase:

- Current deployment continuously fails
- Want completely clean Vercel project
- Major architecture changes needed
- Starting from absolute scratch

### 3.1 - Backup Current Setup

```bash
# Backup current branch
git checkout claude/crypto-analytics-platform-5dULn
git tag backup-before-reset-2026-01-12
git push origin backup-before-reset-2026-01-12

# Export environment variables from Vercel
# Go to: Vercel Dashboard → Settings → Environment Variables
# Export to CSV or copy to secure location
```

### 3.2 - Create New Vercel Project

```bash
# Option A: Via Vercel Dashboard
1. Go to: https://vercel.com/new
2. Import Git Repository: tuantran12/JS
3. Select Framework Preset: Next.js
4. Root Directory: ./
5. Build Command: npm run build
6. Output Directory: .next
7. Install Command: npm install
8. Environment Variables: Import from .env.production.local.template
9. Deploy

# Option B: Via Vercel CLI
vercel --prod
# Follow prompts to create new project
```

### 3.3 - Configure New Project

```bash
# Set all environment variables
# Use .env.production.local.template as reference
# Go to: Project Settings → Environment Variables
# Add all variables for: Production, Preview, Development

# Configure domains
# Go to: Project Settings → Domains
# Add: senkai.xyz (primary)
# Add: www.senkai.xyz (redirect to primary)

# Configure Git integration
# Go to: Project Settings → Git
# Production Branch: claude/crypto-analytics-platform-5dULn
# Or create new branch: main-production
```

### 3.4 - Test Fresh Deployment

Follow Phase 2.5 testing checklist

---

## 🛠️ PHASE 4: BACKEND & FRONTEND SETUP

### 4.1 - Backend (Next.js API Routes) - Current Setup

**Status:** ✅ Already implemented and working

**Structure:**
```
app/api/
├── prices/route.ts           ✅ Working
├── fear-greed/route.ts        ✅ Working
├── klines/route.ts            ✅ Working
├── chat/route.ts              ✅ Working
├── stripe/*/route.ts          ✅ Working
└── ... (13 routes total)
```

**No changes needed unless:**
- Want to add new API endpoints
- Need to optimize performance
- Want to add middleware/authentication

### 4.2 - Frontend (Next.js App Router) - Current Setup

**Status:** ✅ Already implemented and working

**Structure:**
```
app/
├── (marketing)/              ✅ Public pages
│   ├── page.tsx              (Homepage)
│   ├── about/                (About)
│   └── whitepaper/           (Whitepaper)
└── (platform)/               ✅ Protected pages
    ├── dashboard/            (Dashboard)
    ├── portfolio/            (Portfolio)
    ├── swap/                 (Jupiter Swap)
    ├── analytics/            (Analytics)
    ├── chat/                 (AI Chat)
    └── ...
```

**No changes needed unless:**
- Want to redesign UI
- Add new features/pages
- Refactor component structure

### 4.3 - Database Setup (Supabase) - Current Setup

**Status:** ✅ Schema ready, needs deployment to Supabase

**Action:** Deploy database schema

```bash
# Option A: Via Supabase Dashboard
1. Go to: https://app.supabase.com/
2. Select project or create new one
3. Go to: SQL Editor
4. Copy content from: supabase/schema.sql
5. Execute SQL
6. Verify tables created: users, traders, trades, etc.

# Option B: Via Supabase CLI (if installed)
supabase db push
```

**Post-Deployment:**
```bash
# Test database connection
# Create test user via Privy login
# Check if user record created in Supabase
```

---

## 🔐 PHASE 5: API KEYS & CREDENTIALS SETUP

### 5.1 - Generate Fresh Security Secrets

**JWT Secret:**
```bash
openssl rand -base64 32
# Save as: JWT_SECRET
```

**NextAuth Secret:**
```bash
openssl rand -base64 32
# Save as: NEXTAUTH_SECRET
```

### 5.2 - Configure Stripe (Move to Live Keys)

**If currently using test keys:**

```bash
# Go to: https://dashboard.stripe.com/apikeys
# Switch mode: Test → Live

# Get Live Keys:
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Create webhook for production
# URL: https://senkai.xyz/api/webhooks/stripe
# Events: checkout.session.completed, customer.subscription.*
STRIPE_WEBHOOK_SECRET=whsec_...

# Update in Vercel
```

### 5.3 - Verify API Keys

```bash
# Test each service:

# 1. Supabase
curl -H "apikey: YOUR_ANON_KEY" https://YOUR_PROJECT.supabase.co/rest/v1/users

# 2. Stripe
curl https://api.stripe.com/v1/customers -u sk_test_YOUR_KEY:

# 3. Hugging Face
curl https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2 \
  -H "Authorization: Bearer YOUR_HF_KEY"

# 4. CoinGecko (if using API key)
curl "https://api.coingecko.com/api/v3/ping?x_cg_pro_api_key=YOUR_KEY"
```

---

## 📊 PHASE 6: MONITORING & OPTIMIZATION

### 6.1 - Set Up Error Tracking

**Sentry Integration:**
```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs

# Add to environment variables
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### 6.2 - Set Up Analytics

**Google Analytics:**
```bash
# Add to environment variables
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Add to app/layout.tsx (Google Analytics script)
```

### 6.3 - Performance Optimization

```bash
# Enable production optimizations in next.config.js:
- Output: 'standalone'
- Remove console logs (except errors)
- Enable browser source maps: false
- Compress images: AVIF, WebP

# Monitor:
- Core Web Vitals in Vercel Analytics
- API response times
- Database query performance
```

---

## ✅ PHASE 7: FINAL VERIFICATION

### 7.1 - Production Health Check

```bash
# Run all tests
npm run test  # If tests exist

# Build locally
npm run build
# Should complete without errors

# Check for console warnings
npm run lint
```

### 7.2 - Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix if any
npm audit fix

# Update dependencies
npm update

# Check environment variables
# Ensure no secrets in code
# Verify .gitignore includes .env files
```

### 7.3 - Documentation Update

```bash
# Update README.md with:
- Deployment instructions
- Environment variables guide
- API documentation
- Contributing guidelines

# Update .env.example
# Ensure matches .env.production.local.template
```

### 7.4 - Final Production Test

**Complete Testing Matrix:**

| Feature | Test | Expected Result | Status |
|---------|------|----------------|--------|
| Homepage | Visit https://senkai.xyz/ | Loads in <2s | ⬜ |
| Dashboard | Click "Launch App" | Redirects to /dashboard | ⬜ |
| Authentication | Click "Connect Wallet" | Privy modal appears | ⬜ |
| Email Login | Enter email + OTP | Login successful | ⬜ |
| Embedded Wallet | Check wallet address | Shows in header | ⬜ |
| External Wallet | Connect Phantom | Connection successful | ⬜ |
| Portfolio | Visit /portfolio | Shows wallet balance | ⬜ |
| Swap | Visit /swap | Jupiter interface loads | ⬜ |
| Analytics | Visit /analytics | Charts display | ⬜ |
| AI Chat | Visit /chat | Chat functional | ⬜ |
| Copy Trading | Visit /copy-trading | Features accessible | ⬜ |
| Payments | Test subscription | Stripe checkout works | ⬜ |
| API Endpoints | curl /api/prices | Returns JSON | ⬜ |
| Mobile | Test on mobile | Responsive design works | ⬜ |
| Performance | Lighthouse audit | Score >90 | ⬜ |
| Security | Security headers | All present | ⬜ |

---

## 🚨 TROUBLESHOOTING

### Issue: Deployment Fails

**Check:**
1. Build logs in Vercel
2. Environment variables are set
3. No TypeScript errors: `npm run build`
4. Dependencies installed: `npm install`

### Issue: Privy Modal Not Appearing

**Check:**
1. `NEXT_PUBLIC_PRIVY_APP_ID` is set
2. Domain in Privy allowed origins
3. Browser console for errors
4. Network tab for blocked requests

### Issue: API Routes Return 404

**Check:**
1. Routes exist in `app/api/`
2. Export named functions: `export async function GET()`
3. No build errors
4. Correct route file structure

### Issue: Database Connection Fails

**Check:**
1. Supabase URL and keys correct
2. Database schema deployed
3. RLS policies configured
4. Network access allowed

### Issue: Wallet Not Connecting

**Check:**
1. Browser wallet extension installed
2. Wallet adapter configured correctly
3. Solana RPC URL accessible
4. No CORS errors in console

---

## 📝 RECOMMENDED NEXT STEPS

After successful deployment:

### Short Term (Week 1)

1. Monitor error logs daily
2. Check API usage metrics
3. Gather user feedback
4. Fix any critical bugs
5. Optimize slow queries

### Medium Term (Month 1)

1. Implement remaining mock APIs (liquidations, ETF)
2. Add comprehensive testing
3. Set up CI/CD pipeline
4. Create admin dashboard
5. Add more trading features

### Long Term (Quarter 1)

1. Scale infrastructure
2. Add mobile app
3. Implement advanced features
4. Launch token (if planned)
5. Expand to other blockchains

---

## 📞 SUPPORT RESOURCES

**Documentation:**
- Next.js: https://nextjs.org/docs
- Privy: https://docs.privy.io/
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

**Dashboards:**
- Vercel: https://vercel.com/dashboard
- Privy: https://dashboard.privy.io/
- Supabase: https://app.supabase.com/
- Stripe: https://dashboard.stripe.com/

**Support:**
- Vercel: support@vercel.com
- Privy: support@privy.io
- Supabase: support@supabase.com

---

## ✅ COMPLETION CHECKLIST

- [ ] Phase 1: Configuration audit completed
- [ ] Phase 2: Production deployment successful
- [ ] Phase 3: Fresh reset (if needed)
- [ ] Phase 4: Backend/Frontend verified
- [ ] Phase 5: All API keys configured
- [ ] Phase 6: Monitoring set up
- [ ] Phase 7: Final verification passed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team notified
- [ ] Users can access platform

---

**Status:** READY FOR DEPLOYMENT
**Current Phase:** Phase 2 - Production Deployment
**Next Action:** Verify Vercel deployment status and test production

---

**Created:** 2026-01-12 by Claude Code Agent
**Branch:** claude/crypto-analytics-platform-5dULn
**Last Commit:** 4bfeea2 - "fix: Update production domain from app.senkai.xyz to senkai.xyz"
