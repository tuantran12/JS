# SENKAI Platform Deployment Guide

Complete guide to deploy the SENKAI cryptocurrency trading platform to production.

## Prerequisites

- Node.js 18.17+ and npm 9+
- Git repository access
- Vercel account
- Supabase account
- Stripe account (for payments)
- Hugging Face account (for AI)
- Solana wallet with SOL (for smart contracts)

## Environment Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/tuantran12/JS.git
cd JS
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in all required values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (server-side only)
- `HUGGINGFACE_API_KEY`: Hugging Face API key for AI features
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `NEXT_PUBLIC_SOLANA_RPC_URL`: Solana RPC endpoint
- `NEXT_PUBLIC_SENKAI_TOKEN_MINT`: SENKAI token mint address (after deployment)

## Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Project name: `senkai-platform`
   - Database password: (generate strong password)
   - Region: Choose closest to your users
   - Pricing plan: Pro (for production)

### 2. Run Database Schema

1. Open SQL Editor in Supabase Dashboard
2. Copy contents of `supabase/schema.sql`
3. Run the SQL script
4. Verify tables are created

### 3. Configure Authentication

1. Go to Authentication > Settings
2. Enable "Enable email confirmations" if needed
3. Configure OAuth providers (Google, Discord, etc.) if needed
4. Update Site URL to your production domain

## Solana Smart Contracts Deployment

### 1. Setup Solana CLI

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"

# Create/import your deployment wallet
solana-keygen new --outfile ~/.config/solana/deployer.json

# Set network to mainnet-beta
solana config set --url https://api.mainnet-beta.solana.com

# Check balance (you need SOL for deployment)
solana balance
```

### 2. Deploy SENKAI Token

```bash
# Create SPL token
spl-token create-token

# Create token account
spl-token create-account <TOKEN_MINT_ADDRESS>

# Mint initial supply (1 billion tokens with 9 decimals)
spl-token mint <TOKEN_MINT_ADDRESS> 1000000000

# Set token metadata (name, symbol, logo)
# Use Metaplex Token Metadata program
```

### 3. Deploy Smart Contracts

```bash
cd programs/senkai
anchor build
anchor deploy --provider.cluster mainnet
```

Save all program IDs and update environment variables.

## Stripe Setup

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete business verification
3. Get API keys from Developers > API keys

### 2. Create Products

Create three products in Stripe:
- **Pro Monthly**: $49/month
- **Pro Annual**: $470/year
- **Premium Monthly**: $149/month
- **Premium Annual**: $1430/year

### 3. Setup Webhooks

1. Go to Developers > Webhooks
2. Add endpoint: `https://senkai.xyz/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Link Project

```bash
vercel link
```

### 4. Configure Environment Variables

Add all environment variables in Vercel Dashboard:
1. Go to Project Settings > Environment Variables
2. Add each variable from `.env.example`
3. Make sure to use production values

### 5. Deploy

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

### 6. Configure Custom Domain

1. Go to Project Settings > Domains
2. Add custom domain: `senkai.xyz`
3. Add custom domain: `app.senkai.xyz`
4. Update DNS records as instructed

## DNS Configuration

Add the following DNS records:

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

## Post-Deployment Checklist

### Security
- [ ] All environment variables set correctly
- [ ] HTTPS enabled on all domains
- [ ] Row Level Security (RLS) enabled on Supabase
- [ ] API keys rotated from test/dev keys
- [ ] Stripe webhook secret configured
- [ ] Rate limiting enabled

### Functionality
- [ ] Test user registration/login
- [ ] Test wallet connection (Phantom, Solflare)
- [ ] Test AI chat functionality
- [ ] Test copy trading follow/unfollow
- [ ] Test Stripe subscription flow
- [ ] Test Solana Pay integration
- [ ] Test referral code generation
- [ ] Test notifications

### Performance
- [ ] Enable Vercel Analytics
- [ ] Configure caching headers
- [ ] Optimize images with next/image
- [ ] Enable compression
- [ ] Monitor Core Web Vitals

### Monitoring
- [ ] Set up Vercel monitoring
- [ ] Configure error tracking (Sentry recommended)
- [ ] Set up uptime monitoring
- [ ] Configure log aggregation
- [ ] Set up performance monitoring

## Maintenance

### Database Backups

Supabase automatically backs up your database daily. For additional safety:
1. Set up weekly manual backups
2. Download and store backups securely
3. Test backup restoration process

### Smart Contract Upgrades

If using upgradeable contracts:
1. Test upgrades on devnet first
2. Announce upgrade to community
3. Execute upgrade during low-traffic periods
4. Verify upgrade success

### Monitoring & Alerts

Set up alerts for:
- API errors (>1% error rate)
- High latency (>2s response time)
- Failed payments
- Database connection issues
- Solana RPC failures

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Database Connection Issues

- Check Supabase service status
- Verify connection string
- Check IP allowlist settings
- Verify SSL certificate

### Solana RPC Issues

- Use multiple RPC endpoints
- Implement retry logic
- Consider using paid RPC services (Helius, QuickNode)

## Support

For deployment support:
- Email: support@senkai.xyz
- Discord: discord.gg/senkai
- GitHub Issues: github.com/tuantran12/JS/issues

## License

Proprietary - SENKAI Platform
Copyright © 2025 SENKAI. All rights reserved.
