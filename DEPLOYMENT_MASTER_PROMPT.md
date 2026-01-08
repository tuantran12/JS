# 🚀 SENKAI PLATFORM - MASTER DEPLOYMENT PROMPT

> **Purpose**: This document serves as the master orchestration guide for deploying the SENKAI cryptocurrency trading platform. It clearly divides responsibilities between code development (completed) and external integrations/deployment (to be executed).

---

## 📋 TABLE OF CONTENTS

1. [Project Overview](#project-overview)
2. [Work Division](#work-division)
3. [Pre-Deployment Checklist](#pre-deployment-checklist)
4. [External Integrations Required](#external-integrations-required)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 PROJECT OVERVIEW

**SENKAI** is a comprehensive Web3 trading platform built on Solana blockchain with:

- **Marketing Website**: Landing page, whitepaper, articles (`senkai.xyz`)
- **Product App**: Full trading platform (`app.senkai.xyz` or `senkai.xyz/dashboard`)

### Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Blockchain**: Solana (SPL tokens, Jupiter DEX, Wallet Adapter)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe (fiat) + Solana Pay (crypto)
- **AI**: Hugging Face (Mistral-7B-Instruct)
- **Deployment**: Vercel
- **Authentication**: Wallet-based (Phantom, Solflare)

---

## 🔀 WORK DIVISION

### ✅ COMPLETED (Development - Code Ready)

**Code Implementation**: All features implemented, tested, and committed to Git.

#### Core Features:
1. **Wallet Integration** ✓
   - Solana wallet adapter (Phantom, Solflare)
   - Wallet button in header (platform routes only)
   - WalletProvider setup in platform layout

2. **Trading/Swap** ✓
   - `/swap` page with Jupiter DEX integration
   - Token selection, quotes, price impact
   - Swap execution with transaction signing

3. **Copy Trading** ✓
   - `/copy-trading` page with trader discovery
   - Follow/unfollow functionality
   - Performance metrics display

4. **AI Chat** ✓
   - `/chat` page with Mistral-7B integration
   - Real-time chat interface
   - API route `/api/chat` for Hugging Face

5. **Portfolio** ✓
   - `/portfolio` page with token holdings
   - P&L tracking, balance display
   - Hide/show balances toggle

6. **Notifications** ✓
   - `/notifications` page with notification center
   - Mark as read, delete, filter by type
   - Notification settings link

7. **Subscription Management** ✓
   - `/subscription` page with plan selection
   - Stripe checkout integration
   - `/subscription/success` callback page
   - API routes: `/api/stripe/create-checkout-session`, `/api/webhooks/stripe`

8. **Transactions** ✓
   - `/transactions` page with history
   - Export to CSV functionality
   - Filter and search

9. **Analytics Suite** ✓
   - 7 analytics pages (ETF, Liquidations, RSI, OI, Long/Short, Altcoin Season)
   - Real-time market data APIs

10. **Profile & Settings** ✓
    - `/profile` page with 5 tabs
    - Account, Notifications, API Keys, Security, Referrals

11. **Infrastructure** ✓
    - Database schema (Supabase)
    - Environment variables template
    - Vercel configuration
    - Route groups architecture (marketing/platform)

---

### 🔄 REQUIRED (Deployment - External Integrations)

**External Integrations**: These require access to third-party services and deployment platforms.

---

## 📝 PRE-DEPLOYMENT CHECKLIST

### Code Repository
- [ ] All code committed to Git repository
- [ ] Branch: `claude/crypto-analytics-platform-Q5hi6`
- [ ] Build passes: `npm run build` (verified ✓)
- [ ] No TypeScript errors
- [ ] No ESLint errors

### Dependencies Installed
- [ ] `npm install` completed
- [ ] All packages in `package.json` resolved

---

## 🔌 EXTERNAL INTEGRATIONS REQUIRED

### 1. SUPABASE SETUP

**Task**: Create and configure Supabase database

**Steps**:
1. Create new Supabase project
   - Project name: `senkai-platform`
   - Region: US East (or closest to users)
   - Password: Generate strong password

2. Run database schema
   - Navigate to SQL Editor
   - Copy contents of `/supabase/schema.sql`
   - Execute SQL script
   - Verify all tables created

3. Configure authentication
   - Enable Email auth (if needed)
   - Configure OAuth providers (optional)
   - Set Site URL to production domain

4. Get API credentials
   - Project URL: `https://[project-id].supabase.co`
   - Anon key: From Settings > API
   - Service role key: From Settings > API (keep secret!)

5. Update Vercel environment variables (see below)

---

### 2. STRIPE CONFIGURATION

**Task**: Set up Stripe for subscription payments

**Steps**:
1. Create Stripe account (or use existing)
   - Complete business verification
   - Activate account

2. Create products and prices
   - Navigate to Products > Create Product

   **Pro Plan**:
   - Name: "SENKAI Pro"
   - Monthly: $49/month → Get Price ID
   - Annual: $470/year → Get Price ID

   **Premium Plan**:
   - Name: "SENKAI Premium"
   - Monthly: $149/month → Get Price ID
   - Annual: $1430/year → Get Price ID

3. Update code with Price IDs
   - Edit `/app/(platform)/subscription/page.tsx`
   - Replace `stripePriceIdMonthly` and `stripePriceIdAnnual` with actual Stripe Price IDs

4. Get API keys
   - Secret key: `sk_live_...` (for backend)
   - Publishable key: `pk_live_...` (for frontend)

5. Configure webhooks
   - Endpoint URL: `https://senkai.xyz/api/webhooks/stripe`
   - Events to listen:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Get webhook secret: `whsec_...`

6. Update Vercel environment variables (see below)

---

### 3. HUGGING FACE API

**Task**: Get Hugging Face API key for AI chat

**Steps**:
1. Create Hugging Face account: https://huggingface.co
2. Go to Settings > Access Tokens
3. Create new token:
   - Name: "SENKAI Platform"
   - Type: Read
4. Copy API key: `hf_...`
5. Update Vercel environment variable: `HUGGINGFACE_API_KEY`

---

### 4. SOLANA CONFIGURATION

**Task**: Deploy SENKAI token and configure Solana endpoints

**Steps**:
1. **Solana RPC Endpoint**:
   - Option 1 (Free): `https://api.mainnet-beta.solana.com`
   - Option 2 (Recommended): Use paid RPC provider
     - Helius: https://helius.dev
     - QuickNode: https://quicknode.com
     - Get RPC URL and update `NEXT_PUBLIC_SOLANA_RPC_URL`

2. **Deploy SENKAI Token** (Optional - if not done):
   - Follow `/programs/senkai/README.md`
   - Use Solana CLI to create SPL token
   - Get token mint address
   - Update `NEXT_PUBLIC_SENKAI_TOKEN_MINT`

3. **Merchant Wallet**:
   - Create or use existing Solana wallet
   - Update `NEXT_PUBLIC_MERCHANT_WALLET` with public key

---

### 5. VERCEL DEPLOYMENT

**Task**: Deploy application to Vercel

**Steps**:

#### 5.1. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

#### 5.2. Link Project
```bash
cd /path/to/JS
vercel link
```

#### 5.3. Configure Environment Variables

Navigate to Vercel Dashboard > Project Settings > Environment Variables

**Add the following variables** (Production, Preview, Development):

```env
# App Configuration
NEXT_PUBLIC_APP_URL=https://senkai.xyz
NEXT_PUBLIC_APP_NAME=SENKAI

# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=<YOUR_SOLANA_RPC_URL>
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SENKAI_TOKEN_MINT=<YOUR_TOKEN_MINT>
NEXT_PUBLIC_MERCHANT_WALLET=<YOUR_WALLET_ADDRESS>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_PROJECT_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SUPABASE_SERVICE_KEY>

# Hugging Face
HUGGINGFACE_API_KEY=<YOUR_HUGGINGFACE_KEY>
NEXT_PUBLIC_AI_MODEL=mistralai/Mistral-7B-Instruct-v0.2

# Stripe
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>
STRIPE_WEBHOOK_SECRET=<YOUR_STRIPE_WEBHOOK_SECRET>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<YOUR_STRIPE_PUBLISHABLE_KEY>

# Jupiter Aggregator
NEXT_PUBLIC_JUPITER_API_URL=https://quote-api.jup.ag/v6

# Optional - Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### 5.4. Deploy
```bash
# Deploy to production
vercel --prod
```

#### 5.5. Configure Custom Domain

1. Go to Vercel Dashboard > Project Settings > Domains
2. Add custom domain: `senkai.xyz`
3. Add subdomain: `app.senkai.xyz` (optional)
4. Follow DNS configuration instructions

**DNS Records** (Add these to your domain registrar):

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

---

### 6. MIDDLEWARE CONFIGURATION (Optional)

**Task**: Add domain-based routing for subdomain

If using `app.senkai.xyz` subdomain, create `middleware.ts`:

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  // If accessing app subdomain, ensure we're in platform routes
  if (hostname.startsWith('app.')) {
    const pathname = request.nextUrl.pathname;

    // If on app subdomain but accessing marketing pages, redirect to main domain
    if (pathname === '/' || pathname.startsWith('/whitepaper') ||
        pathname.startsWith('/articles') || pathname.startsWith('/news')) {
      const url = request.nextUrl.clone();
      url.host = hostname.replace('app.', '');
      return NextResponse.redirect(url);
    }

    // If on app subdomain and on root, redirect to dashboard
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Functional Testing

1. **Marketing Site** (`senkai.xyz`)
   - [ ] Landing page loads
   - [ ] Whitepaper accessible
   - [ ] Articles/News pages work
   - [ ] "Launch App" button redirects correctly

2. **Platform App** (`senkai.xyz/dashboard` or `app.senkai.xyz`)
   - [ ] Wallet connection works (Phantom/Solflare)
   - [ ] Dashboard displays correctly
   - [ ] Analytics pages load data
   - [ ] AI Chat responds to messages
   - [ ] Copy Trading page loads traders
   - [ ] Portfolio page shows mock data
   - [ ] Notifications page works
   - [ ] Subscription page loads
   - [ ] Transactions page displays

3. **Trading Functionality**
   - [ ] Swap page loads
   - [ ] Jupiter API returns quotes
   - [ ] Can initiate swap (test with small amount)

4. **Payment Flow**
   - [ ] Subscription page loads plans
   - [ ] "Subscribe Now" redirects to Stripe
   - [ ] Test payment completes (use Stripe test card: `4242 4242 4242 4242`)
   - [ ] Webhook receives events
   - [ ] Success page displays

5. **Performance**
   - [ ] PageSpeed Insights score > 90
   - [ ] First Contentful Paint < 1.5s
   - [ ] Time to Interactive < 3s
   - [ ] No console errors

---

## 🐛 TROUBLESHOOTING

### Common Issues

#### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### Wallet Connection Fails
- Verify Solana RPC URL is correct
- Check browser console for errors
- Ensure wallet extension is installed
- Try different wallet (Phantom vs Solflare)

#### Stripe Webhook Not Receiving Events
- Verify webhook URL is correct: `https://senkai.xyz/api/webhooks/stripe`
- Check webhook secret matches `.env`
- Use Stripe CLI to test locally:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhooks/stripe
  ```

#### Hugging Face API Fails
- Verify API key is correct
- Check rate limits (free tier: 30 requests/min)
- Try different model if needed
- Check Hugging Face status page

#### Supabase Connection Fails
- Verify project URL and keys
- Check IP allowlist settings (allow all for Vercel)
- Verify database schema was run
- Check RLS policies are correct

#### Domain Not Resolving
- Wait 24-48 hours for DNS propagation
- Verify DNS records in domain registrar
- Use `dig senkai.xyz` to check DNS
- Clear browser cache

---

## 📞 SUPPORT

### For Development Issues
- Email: dev@senkai.xyz
- GitHub Issues: https://github.com/tuantran12/JS/issues

### For Deployment Issues
- Vercel Support: https://vercel.com/help
- Discord: discord.gg/senkai

---

## 📄 IMPORTANT FILES REFERENCE

### Configuration Files
- `/package.json` - Dependencies and scripts
- `/.env.example` - Environment variables template
- `/vercel.json` - Vercel deployment config
- `/supabase/schema.sql` - Database schema

### Key Pages
- `/app/(marketing)/page.tsx` - Landing page
- `/app/(platform)/dashboard/page.tsx` - Dashboard
- `/app/(platform)/swap/page.tsx` - Trading page
- `/app/(platform)/subscription/page.tsx` - Subscription management

### API Routes
- `/app/api/chat/route.ts` - AI chat endpoint
- `/app/api/stripe/create-checkout-session/route.ts` - Stripe checkout
- `/app/api/webhooks/stripe/route.ts` - Stripe webhooks

### Documentation
- `/DEPLOYMENT.md` - Detailed deployment guide
- `/programs/senkai/README.md` - Solana contracts guide
- `/README.md` - Project overview

---

## 🎯 EXECUTION CHECKLIST FOR CLAUDE EXTENSION

**Use this checklist when executing deployment**:

1. [ ] **Supabase Setup**
   - [ ] Create project
   - [ ] Run schema
   - [ ] Get credentials
   - [ ] Update Vercel env vars

2. [ ] **Stripe Configuration**
   - [ ] Create products
   - [ ] Get price IDs
   - [ ] Update code with price IDs
   - [ ] Configure webhooks
   - [ ] Get API keys
   - [ ] Update Vercel env vars

3. [ ] **Hugging Face**
   - [ ] Get API key
   - [ ] Update Vercel env vars

4. [ ] **Solana Setup**
   - [ ] Get RPC endpoint
   - [ ] Deploy/get token mint (if needed)
   - [ ] Update Vercel env vars

5. [ ] **Vercel Deployment**
   - [ ] Link project
   - [ ] Set all environment variables
   - [ ] Deploy to production
   - [ ] Configure custom domain
   - [ ] Update DNS records

6. [ ] **Post-Deployment Tests**
   - [ ] Test all pages load
   - [ ] Test wallet connection
   - [ ] Test swap functionality
   - [ ] Test payment flow
   - [ ] Verify performance metrics

---

## 🚀 FINAL NOTES

- **Estimated Time**: 2-3 hours for complete deployment
- **Required Access**: Supabase account, Stripe account, Vercel account, Domain registrar access
- **Skill Level**: Intermediate (familiar with deployment platforms)
- **Support**: Claude extension should handle all third-party integrations autonomously

**Status**: Code complete, ready for deployment ✅

**Next Action**: Execute external integrations following this prompt

---

*Last Updated: January 2026*
*Version: 1.0*
*Repository: https://github.com/tuantran12/JS*
