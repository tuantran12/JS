# 🚀 BLOWFI - Web3 Copy Trading Platform

A comprehensive Web3-based copy trading platform on Solana, featuring Privy wallet integration, auto-trading, and social trading features.

## ✨ Features

- 🔐 **Privy Wallet Integration** - Social login + embedded Solana wallets
- 🤖 **24/7 Auto-Trading** - Server-side transaction signing from embedded wallets
- 📊 **Social Trading** - Follow top traders and copy their trades
- 💰 **Staking** - 60-day (15% APR) and Flexible (9.5% APR) options
- 📦 **Subscription Packages** - Starter, Trader, Expert, Ultimate tiers
- 🎁 **Referral Program** - Earn commissions on referrals
- ⚡ **DLOW Points** - Reward tokens for platform engagement
- 📈 **Market Data** - Real-time SOL price, top tokens, and DEX data

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js, Prisma ORM |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Blockchain | Solana, @solana/web3.js, @solana/spl-token |
| Wallet | Privy (Client & Server SDK) |
| APIs | CoinMarketCap, Bitquery GraphQL |

## 📁 Project Structure

```
project/
├── frontend/          # Next.js 14 application
│   ├── src/
│   │   ├── app/      # App router pages
│   │   ├── components/
│   │   └── lib/      # Utilities & API client
│   ├── vercel.json   # Vercel configuration
│   └── package.json
│
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── services/ # Business logic
│   │   ├── workers/  # Background jobs
│   │   └── middleware/
│   ├── prisma/       # Database schema
│   └── package.json
│
├── .gitignore
├── README.md
└── DEPLOY.md         # Deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Privy App ID and App Secret ([Get from Privy Dashboard](https://app.privy.io/))

### Local Development

1. **Clone the repository**

```bash
git clone https://github.com/tuantran12/JS.git
cd JS/project
```

2. **Setup Frontend**

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Privy App ID
npm run dev
```

3. **Setup Backend** (in a new terminal)

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your Privy credentials
npm run db:push
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/health

## 🌐 Deployment to Vercel

### Frontend Deployment

1. **Push code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Import Project"
- Select your GitHub repository
- Set **Root Directory** to `frontend`
- Add Environment Variables:
  - `NEXT_PUBLIC_PRIVY_APP_ID` - Your Privy App ID
  - `NEXT_PUBLIC_BACKEND_URL` - Your backend API URL
  - `NEXT_PUBLIC_SOLANA_RPC` - Solana RPC endpoint
- Click "Deploy"

3. **Vercel will automatically:**
  - Build your Next.js app
  - Deploy to production
  - Provide you with a URL

### Backend Deployment

Backend can be deployed separately using:

- **Option 1: Vercel Serverless Functions** (Recommended)
  - Convert Express routes to Next.js API routes
  - Deploy with frontend as a monorepo

- **Option 2: Railway / Render**
  - Deploy Express.js backend as a separate service
  - Update `NEXT_PUBLIC_BACKEND_URL` in Vercel

- **Option 3: Traditional VPS**
  - Use PM2 for process management
  - Setup Nginx reverse proxy

See [DEPLOY.md](./DEPLOY.md) for detailed deployment instructions.

## 📝 Environment Variables

### Frontend (.env.local)

```env
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_SOLANA_RPC=https://api.mainnet-beta.solana.com
```

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-32-char-secret-here
PRIVY_APP_ID=your-privy-app-id
PRIVY_APP_SECRET=your-privy-app-secret
FRONTEND_URL=http://localhost:3000
COINMARKETCAP_API_KEY=your-api-key
BITQUERY_API_KEY=your-api-key
```

See `.env.example` files for complete list.

## 🔑 Getting Privy Credentials

1. Sign up at [Privy](https://privy.io)
2. Create a new app
3. Get your **App ID** and **App Secret**
4. Add **App ID** to frontend `.env.local`
5. Add both **App ID** and **App Secret** to backend `.env`

## 📚 Documentation

- [DEPLOY.md](./DEPLOY.md) - Detailed deployment guide
- [Frontend README](./frontend/README.md) - Frontend documentation
- [Backend README](./backend/README.md) - Backend documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License

## 🙏 Acknowledgments

- [Privy](https://privy.io) - Wallet infrastructure
- [Solana](https://solana.com) - Blockchain platform
- [CoinMarketCap](https://coinmarketcap.com) - Market data
- [Bitquery](https://bitquery.io) - DEX analytics

---

**Note:** This platform is for educational purposes. Always do your own research before making investment decisions.
