# 🆕 FRESH VERCEL PROJECT SETUP GUIDE

**Date:** 2026-01-12
**Purpose:** Complete guide to create a fresh Vercel project from scratch

---

## 📋 PREREQUISITES

Before starting, ensure you have:

- [ ] GitHub account with repo access (tuantran12/JS)
- [ ] Vercel account (https://vercel.com/)
- [ ] All environment variables prepared (.env.production.local.template)
- [ ] Domain ready (senkai.xyz)
- [ ] All API keys collected

---

## 🚀 METHOD 1: VERCEL DASHBOARD (RECOMMENDED)

### Step 1: Clean Slate (If Replacing Existing Project)

**If you have an existing Vercel project:**

```bash
# Option A: Delete old project
1. Go to: https://vercel.com/dashboard
2. Select existing SENKAI project
3. Settings → Advanced → Delete Project
4. Confirm deletion

# Option B: Keep old project for backup
- Leave existing project as is
- Create new project with different name
```

### Step 2: Create New Vercel Project

**Navigate to New Project:**
```
1. Go to: https://vercel.com/new
2. Or Dashboard → Add New → Project
```

**Import Git Repository:**
```
3. Select: Import Git Repository
4. Search for: tuantran12/JS
5. Click: Import
```

**Configure Project Settings:**
```
6. Project Name: senkai-platform (or your preference)
7. Framework Preset: Next.js (auto-detected)
8. Root Directory: ./ (leave as default)
9. Build Command: npm run build (auto-filled)
10. Output Directory: .next (auto-filled)
11. Install Command: npm install (auto-filled)
```

**Select Branch:**
```
12. Production Branch: claude/crypto-analytics-platform-5dULn
    (Or select main if you want to use main branch)
```

**Important: Don't deploy yet!**
```
13. Click: Configure Project (not Deploy)
```

### Step 3: Configure Environment Variables

**Add ALL Environment Variables BEFORE first deployment:**

```
14. In project configuration screen
15. Scroll to: Environment Variables section
16. Click: Add Environment Variable
```

**Critical Variables (Add First):**

```bash
# Authentication
NEXT_PUBLIC_PRIVY_APP_ID
Value: cmjmrxm39022pl10ct4kdn95w
Environments: ✅ Production ✅ Preview ✅ Development

PRIVY_APP_ID
Value: cmjmrxm39022pl10ct4kdn95w
Environments: ✅ Production ✅ Preview ✅ Development

# Application
NEXT_PUBLIC_APP_URL
Value: https://senkai.xyz
Environments: ✅ Production only

NEXT_PUBLIC_APP_NAME
Value: SENKAI
Environments: ✅ Production ✅ Preview ✅ Development

NODE_ENV
Value: production
Environments: ✅ Production only

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL
Value: https://[your-project].supabase.co
Environments: ✅ Production ✅ Preview ✅ Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✅ Production ✅ Preview ✅ Development

SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environments: ✅ Production only (sensitive)

# Blockchain
NEXT_PUBLIC_SOLANA_RPC_URL
Value: https://api.mainnet-beta.solana.com
Environments: ✅ Production ✅ Preview ✅ Development

NEXT_PUBLIC_SOLANA_NETWORK
Value: mainnet-beta
Environments: ✅ Production ✅ Preview ✅ Development
```

**Payment Variables:**

```bash
STRIPE_SECRET_KEY
Value: sk_test_... (or sk_live_... for production)
Environments: ✅ Production ✅ Preview

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_... (or pk_live_... for production)
Environments: ✅ Production ✅ Preview ✅ Development

STRIPE_WEBHOOK_SECRET
Value: whsec_...
Environments: ✅ Production only
```

**AI & APIs:**

```bash
HUGGINGFACE_API_KEY
Value: hf_...
Environments: ✅ Production ✅ Preview

NEXT_PUBLIC_COINGECKO_API_KEY
Value: CG-... (optional)
Environments: ✅ Production ✅ Preview ✅ Development

NEXT_PUBLIC_COINMARKETCAP_API_KEY
Value: ... (optional)
Environments: ✅ Production ✅ Preview
```

**Security:**

```bash
JWT_SECRET
Value: [generated-secret-32chars]
Environments: ✅ Production only

NEXTAUTH_SECRET
Value: [generated-secret-32chars]
Environments: ✅ Production only

NEXTAUTH_URL
Value: https://senkai.xyz
Environments: ✅ Production only
```

**Feature Flags (Optional):**

```bash
NEXT_PUBLIC_ENABLE_COPY_TRADING
Value: true
Environments: ✅ Production ✅ Preview ✅ Development

NEXT_PUBLIC_ENABLE_AI_CHAT
Value: true
Environments: ✅ Production ✅ Preview ✅ Development

NEXT_PUBLIC_ENABLE_REFERRALS
Value: true
Environments: ✅ Production ✅ Preview ✅ Development

NEXT_PUBLIC_DEBUG_MODE
Value: false
Environments: ✅ Production only
```

**Tip:** Use the bulk import feature if available:
```
17. Click: "Add from .env.local"
18. Paste contents from .env.production.local.template
19. Adjust values as needed
```

### Step 4: Deploy

```
20. After all environment variables are set
21. Click: Deploy
22. Wait for build to complete (3-5 minutes)
23. Monitor build logs for errors
```

**Expected Output:**
```
✓ Compiling...
✓ Linting and checking validity of types...
✓ Collecting page data...
✓ Generating static pages (37/37)
✓ Collecting build traces...
✓ Finalizing page optimization...

Build Completed in 3m 24s
```

### Step 5: Configure Custom Domain

**After successful deployment:**

```
24. Go to: Project Dashboard
25. Click: Settings → Domains
26. Click: Add Domain
27. Enter: senkai.xyz
28. Click: Add
```

**DNS Configuration (if using external DNS):**

```
29. Vercel will provide DNS records:
    - Type: A
    - Name: @
    - Value: 76.76.21.21

    - Type: CNAME
    - Name: www
    - Value: cname.vercel-dns.com

30. Add these records to your DNS provider
31. Wait for DNS propagation (5-60 minutes)
32. Verify: Domain shows "Active" in Vercel
```

**If using Vercel DNS:**

```
29. Click: "Use Vercel Nameservers"
30. Go to your domain registrar
31. Update nameservers to Vercel's:
    - ns1.vercel-dns.com
    - ns2.vercel-dns.com
32. Wait for propagation
```

### Step 6: Configure Production Settings

**Build & Development Settings:**

```
33. Go to: Settings → General
34. Verify:
    - Build Command: npm run build
    - Output Directory: .next
    - Install Command: npm install
    - Development Command: npm run dev
```

**Git Integration:**

```
35. Go to: Settings → Git
36. Configure:
    - Production Branch: claude/crypto-analytics-platform-5dULn
    - ✅ Automatically Deploy: Production Branch
    - ✅ Automatically Deploy: Preview Branches
    - ⬜ Ignored Build Step: (leave unchecked)
```

**Functions:**

```
37. Go to: Settings → Functions
38. Configure:
    - Region: Washington, D.C., USA (iad1)
    - Timeout: 10s (Hobby) or 60s (Pro)
```

**Environment Variables Protection:**

```
39. Go to: Settings → Environment Variables
40. For sensitive vars (STRIPE_SECRET_KEY, JWT_SECRET):
    - Click: ... (three dots)
    - Select: Change Environments
    - Uncheck Preview/Development if not needed
    - Save
```

---

## 🖥️ METHOD 2: VERCEL CLI (For Developers)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login

```bash
vercel login
```

### Step 3: Initialize Project

```bash
# In your project root
cd /home/user/JS

# Initialize Vercel project
vercel

# Follow prompts:
# ? Set up and deploy "~/JS"? [Y/n] Y
# ? Which scope? [your-account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? senkai-platform
# ? In which directory is your code located? ./
# ? Want to override the settings? [y/N] N

# This creates a new project and deploys to preview URL
```

### Step 4: Add Environment Variables

**Option A: Via CLI (one by one)**
```bash
vercel env add NEXT_PUBLIC_PRIVY_APP_ID
# Enter value when prompted
# Select environments: Production, Preview, Development
```

**Option B: Via Dashboard**
```bash
# Easier for bulk import
# Go to: https://vercel.com/dashboard
# Select project → Settings → Environment Variables
# Import from .env file
```

### Step 5: Deploy to Production

```bash
# Deploy to production
vercel --prod

# Or with specific branch
git checkout claude/crypto-analytics-platform-5dULn
vercel --prod

# Wait for build
# Get production URL
```

### Step 6: Link Custom Domain

```bash
# Add domain via CLI
vercel domains add senkai.xyz

# Or via dashboard (recommended)
# Go to: Settings → Domains → Add
```

---

## 🔒 SECURITY BEST PRACTICES

### Environment Variables Security

**DO:**
- ✅ Use Vercel's encrypted storage
- ✅ Separate test/production keys
- ✅ Rotate secrets regularly (90 days)
- ✅ Limit environment access (Production only for sensitive vars)
- ✅ Use different keys per environment

**DON'T:**
- ❌ Commit .env files to git
- ❌ Share secrets in Slack/email
- ❌ Use production keys in development
- ❌ Reuse same secret across services
- ❌ Store secrets in code

### API Keys Protection

```bash
# Use Vercel's encrypted secrets for:
- Stripe secret keys
- Database service role keys
- JWT secrets
- NextAuth secrets
- API keys (if very sensitive)

# OK to use regular env vars for:
- Public API URLs
- Feature flags
- Non-sensitive configs
```

---

## 🧪 POST-DEPLOYMENT VERIFICATION

### Step 1: Check Deployment Status

```bash
# Via Dashboard
1. Go to: Vercel Dashboard → Your Project
2. Check: Latest deployment status
3. Look for: ✓ Ready

# Via CLI
vercel ls
# Should show: Ready (Production)
```

### Step 2: Test Production URLs

```bash
# Homepage
curl -I https://senkai.xyz/
# Expected: HTTP/2 200 OK

# API endpoint
curl https://senkai.xyz/api/prices
# Expected: JSON response

# Check SSL
curl -vI https://senkai.xyz/ 2>&1 | grep -i "SSL certificate"
# Expected: SSL certificate verify ok
```

### Step 3: Browser Testing

```
1. Open: https://senkai.xyz/
2. Check: Homepage loads without errors
3. Open DevTools (F12) → Console
4. Verify: No critical errors
5. Check: Network tab for failed requests
```

### Step 4: Privy Authentication Test

```
1. Click: "Launch App" or "Connect Wallet"
2. Verify: Privy modal appears
3. Test: Email login
4. Verify: Embedded wallet created
5. Test: External wallet (Phantom)
```

### Step 5: Lighthouse Audit

```
1. Open Chrome DevTools
2. Lighthouse tab
3. Run audit (Production)
4. Check scores:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90
```

---

## 🚨 TROUBLESHOOTING

### Build Fails

**Check:**
```
1. Build logs in Vercel Dashboard
2. TypeScript errors: npm run build locally
3. Missing dependencies: npm install
4. Environment variables set correctly
```

**Common Issues:**
```
- Missing NEXT_PUBLIC_* vars
- TypeScript strict mode errors
- Import path issues
- Dependencies version conflicts
```

### Domain Not Working

**Check:**
```
1. DNS propagation: https://dnschecker.org/
2. Vercel domain status (should be "Active")
3. SSL certificate issued (automatic, may take 5-10 min)
4. Correct DNS records added
```

### API Routes Return 500

**Check:**
```
1. Function logs in Vercel Dashboard
2. Environment variables set for Production
3. API keys valid and not expired
4. External APIs accessible from Vercel IPs
```

### Privy Modal Not Showing

**Check:**
```
1. NEXT_PUBLIC_PRIVY_APP_ID set correctly
2. senkai.xyz in Privy allowed origins
3. Browser console for errors
4. Network tab for blocked requests
```

---

## 📊 VERCEL PROJECT STRUCTURE

After setup, your Vercel project should look like:

```
Vercel Dashboard
└── senkai-platform
    ├── Deployments
    │   └── Production (senkai.xyz)
    │       └── Latest: 4bfeea2 (✓ Ready)
    ├── Settings
    │   ├── General
    │   │   ├── Project Name: senkai-platform
    │   │   └── Framework: Next.js
    │   ├── Domains
    │   │   ├── senkai.xyz (Production)
    │   │   └── www.senkai.xyz → senkai.xyz
    │   ├── Git
    │   │   └── Production Branch: claude/crypto-analytics-platform-5dULn
    │   ├── Environment Variables
    │   │   └── 35+ variables configured
    │   ├── Functions
    │   │   ├── Region: iad1
    │   │   └── Timeout: 10s
    │   └── Team
    │       └── [Your team members]
    └── Analytics
        └── [Usage stats]
```

---

## ✅ COMPLETION CHECKLIST

### Pre-Deployment
- [ ] GitHub repo accessible
- [ ] Vercel account ready
- [ ] All env vars collected
- [ ] Domain DNS ready
- [ ] API keys valid

### Vercel Setup
- [ ] New project created
- [ ] Git repository linked
- [ ] Production branch selected
- [ ] All env vars added (35+)
- [ ] Sensitive vars protected
- [ ] Build command verified
- [ ] Framework preset correct

### Domain Configuration
- [ ] Domain added to project
- [ ] DNS records configured
- [ ] SSL certificate issued
- [ ] Domain status: Active
- [ ] HTTPS working

### Post-Deployment
- [ ] Build successful
- [ ] Homepage loads
- [ ] API endpoints working
- [ ] Privy authentication working
- [ ] All pages accessible
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Lighthouse score >80

---

## 📞 SUPPORT

**If you encounter issues:**

1. **Check Vercel Logs:**
   - Dashboard → Deployments → View Function Logs

2. **Vercel Documentation:**
   - https://vercel.com/docs

3. **Vercel Support:**
   - https://vercel.com/support
   - support@vercel.com

4. **Community:**
   - GitHub Discussions: https://github.com/vercel/next.js/discussions
   - Discord: https://vercel.com/discord

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Monitor Performance**
   - Check Vercel Analytics
   - Set up Sentry error tracking
   - Monitor API usage

2. **Set Up CI/CD**
   - Already done with Vercel!
   - Auto-deploys on git push

3. **Configure Webhooks** (if needed)
   - Stripe webhook: https://senkai.xyz/api/webhooks/stripe
   - Add endpoint in Stripe Dashboard

4. **Team Access**
   - Invite team members to Vercel project
   - Configure access levels

5. **Documentation**
   - Update README with deployment info
   - Document environment variables
   - Create runbook for common issues

---

## 💰 VERCEL PRICING

**Hobby (Free):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ Git integration
- ⚠️ 10s function timeout
- ⚠️ Single team member

**Pro ($20/month):**
- ✅ Everything in Hobby
- ✅ 1 TB bandwidth
- ✅ 60s function timeout
- ✅ Team members
- ✅ Priority support
- ✅ Advanced analytics

**Recommendation:** Start with Hobby, upgrade to Pro when needed

---

**Status:** READY TO DEPLOY
**Estimated Setup Time:** 30-60 minutes
**Last Updated:** 2026-01-12

---

**Created by:** Claude Code Agent
**Branch:** claude/crypto-analytics-platform-5dULn
**Purpose:** Fresh Vercel project setup from scratch
