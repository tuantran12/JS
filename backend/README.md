# 🚀 SENKAI Backend API

Express.js backend for SENKAI platform with Privy wallet integration, Solana blockchain, and auto-trading features.

## 📦 Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Auth:** Privy Server SDK
- **Blockchain:** Solana (@solana/web3.js)
- **Deployment:** Vercel Serverless Functions

## 🚀 Deploy to Vercel

### Prerequisites
1. PostgreSQL database (use Supabase free tier)
2. Privy account and credentials
3. Vercel account

### Deployment Steps

1. **Push to GitHub**
```bash
git push origin your-branch
```

2. **Create Vercel Project**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Select this `backend/` folder as Root Directory
   - Framework Preset: Other

3. **Configure Environment Variables**

Go to Project Settings → Environment Variables → Add:

```bash
# Database (REQUIRED)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Privy (REQUIRED)
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# Security (REQUIRED)
JWT_SECRET=your_random_32_char_secret

# Frontend URL
FRONTEND_URL=https://your-frontend.vercel.app

# Solana
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
PLATFORM_WALLET_PRIVATE_KEY=your_wallet_private_key

# APIs (Optional)
COINMARKETCAP_API_KEY=your_key
```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your API will be live at `https://your-backend.vercel.app`

## 📡 API Endpoints

All routes are prefixed with `/api`

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/login       - Privy login
POST /api/auth/verify      - Verify token
```

### User Management
```
GET    /api/users/me       - Get current user
PUT    /api/users/me       - Update profile
GET    /api/users/stats    - Get user stats
```

### Staking
```
GET    /api/stakes         - Get user stakes
POST   /api/stakes         - Create stake
PUT    /api/stakes/:id     - Claim rewards
```

### Subscriptions
```
GET    /api/subscriptions  - Get plans
POST   /api/subscriptions  - Subscribe
GET    /api/subscriptions/my - Get user subscription
```

### Copy Trading
```
GET    /api/copy/traders   - Get top traders
POST   /api/copy/follow    - Follow trader
DELETE /api/copy/unfollow  - Unfollow trader
GET    /api/copy/positions - Get positions
```

### Transactions
```
GET    /api/transactions   - Get user transactions
POST   /api/transactions   - Create transaction
```

### Referrals
```
GET    /api/referrals      - Get referral stats
POST   /api/referrals/claim - Claim rewards
```

### Market Data
```
GET    /api/market/dashboard - Market overview
GET    /api/market/tokens    - Token prices
```

## 🗄️ Database Setup

The backend uses Prisma ORM. After deploying:

1. **Generate Prisma Client**
```bash
npx prisma generate
```

2. **Run Migrations**
```bash
npx prisma db push
```

Or use Vercel build script (already configured in package.json).

## ⚠️ Important Notes

### Vercel Serverless Limitations
- **Max execution time:** 10s (Hobby), 60s (Pro)
- **No persistent connections:** Database connections close after each request
- **No background workers:** Auto-trading workers won't run on Vercel

### Workers (Auto-Trading)
The workers in `/src/workers/` **will NOT run** on Vercel serverless.

For 24/7 auto-trading, deploy workers separately:
- **Option 1:** Railway (recommended, $5/month)
- **Option 2:** Render (free tier available)
- **Option 3:** DigitalOcean App Platform

## 🔧 Local Development

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run db:generate
npm run db:push
npm run dev
```

Server runs on http://localhost:3001

## 📝 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `PRIVY_APP_ID` | ✅ | From Privy Dashboard |
| `PRIVY_APP_SECRET` | ✅ | From Privy Dashboard |
| `JWT_SECRET` | ✅ | Random 32+ char string |
| `FRONTEND_URL` | ✅ | Frontend domain |
| `SOLANA_RPC_URL` | ⚪ | Solana RPC endpoint |
| `PLATFORM_WALLET_PRIVATE_KEY` | ⚪ | For platform operations |
| `COINMARKETCAP_API_KEY` | ⚪ | Market data API |

## 📚 Prisma Schema

Database schema is in `/prisma/schema.prisma`

Main models:
- User
- Subscription
- Stake
- Transaction
- Referral
- CopyTradeFollow
- SmartWallet

## 🔒 Security

- Rate limiting: 200 requests per 15 minutes
- CORS enabled for frontend domain
- Helmet.js for HTTP headers security
- Request size limit: 10kb
- JWT token expiration: 7 days

## 📦 Build Info

- Build target: Vercel Serverless
- Entry point: `/api/index.js`
- Routes: All `/api/*` requests routed to Express app
- Auto-generated: Prisma Client during build

## 🆘 Troubleshooting

### Build Fails
- Check DATABASE_URL is valid PostgreSQL string
- Ensure all required env vars are set
- Check Prisma schema is valid

### API Returns 500
- Check Vercel Function Logs
- Verify database connection
- Check Privy credentials

### CORS Errors
- Set FRONTEND_URL correctly
- Check frontend domain matches

## 📞 Support

For issues, check:
1. Vercel deployment logs
2. Database connection
3. Environment variables
4. Privy dashboard

---

**Ready to deploy!** 🎉
