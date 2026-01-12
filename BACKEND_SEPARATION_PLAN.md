# 🏗️ BACKEND SEPARATION PLAN - api.senkai.xyz

**Date:** 2026-01-12
**Purpose:** Separate backend from Next.js into standalone API server

---

## 📊 CURRENT vs NEW ARCHITECTURE

### Current Architecture (Monolithic)
```
senkai.xyz
├── Frontend (Next.js)
└── Backend (Next.js API Routes in /app/api/)
    └── All API endpoints embedded
```

### New Architecture (Separated)
```
senkai.xyz (Frontend Only)
└── Next.js static/SSR pages

api.senkai.xyz (Backend Only)
└── Express/NestJS/Fastify API Server
    └── All API endpoints
    └── Separate deployment
```

---

## 🎯 BENEFITS OF SEPARATION

### Advantages

1. **Independent Scaling**
   - Scale frontend and backend separately
   - Different resource allocation

2. **Technology Flexibility**
   - Choose best backend framework
   - Not tied to Next.js

3. **Deployment Independence**
   - Deploy backend without rebuilding frontend
   - Faster deployment cycles

4. **Team Specialization**
   - Frontend team works on senkai.xyz
   - Backend team works on api.senkai.xyz

5. **Better Caching**
   - API responses can be cached globally
   - CDN optimization

### Disadvantages

1. **More Complex Setup**
   - Two separate deployments
   - CORS configuration needed
   - More infrastructure cost

2. **Latency**
   - Network hop between frontend and backend
   - Not as fast as co-located API routes

3. **SSR Complications**
   - Server-side rendering needs to call external API
   - Increased SSR time

---

## 🛠️ BACKEND FRAMEWORK OPTIONS

### Option 1: Express.js (Recommended for Speed)

**Pros:**
- Simple and lightweight
- Large ecosystem
- Easy migration from Next.js API routes
- Minimal boilerplate

**Cons:**
- Less structure than NestJS
- Need to add TypeScript setup

### Option 2: NestJS (Recommended for Scale)

**Pros:**
- TypeScript-first
- Built-in dependency injection
- Modular architecture
- Excellent documentation
- Similar to Angular (if team knows it)

**Cons:**
- More boilerplate
- Steeper learning curve
- Heavier than Express

### Option 3: Fastify

**Pros:**
- Fastest Node.js framework
- TypeScript support
- Schema-based validation
- Plugin architecture

**Cons:**
- Smaller ecosystem than Express
- Less familiar to developers

---

## 📝 RECOMMENDED: EXPRESS.JS BACKEND

I recommend **Express.js** for SENKAI because:
1. Quick to set up
2. Easy migration from current API routes
3. Good performance
4. Large community support

---

## 🚀 IMPLEMENTATION PLAN

### Step 1: Create Backend Project Structure

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors helmet dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon

# Install existing dependencies from main project
npm install axios stripe @supabase/supabase-js

# Initialize TypeScript
npx tsc --init
```

### Step 2: Backend Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts            # Configuration
│   ├── routes/
│   │   ├── prices.ts           # /api/prices
│   │   ├── fearGreed.ts        # /api/fear-greed
│   │   ├── klines.ts           # /api/klines
│   │   ├── chat.ts             # /api/chat
│   │   ├── stripe.ts           # /api/stripe/*
│   │   └── index.ts            # Route aggregator
│   ├── services/
│   │   ├── coingecko.ts        # CoinGecko API service
│   │   ├── binance.ts          # Binance API service
│   │   ├── huggingface.ts      # AI service
│   │   └── stripe.ts           # Payment service
│   ├── middleware/
│   │   ├── auth.ts             # Authentication middleware
│   │   ├── errorHandler.ts    # Error handling
│   │   └── rateLimit.ts        # Rate limiting
│   ├── utils/
│   │   ├── cache.ts            # Caching utility
│   │   └── logger.ts           # Logging utility
│   └── index.ts                # Main server file
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Step 3: Main Server File (backend/src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://senkai.xyz',
    'https://www.senkai.xyz',
    'http://localhost:3000' // Development
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// API Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
```

### Step 4: Migrate API Routes

**Example: Prices Route (backend/src/routes/prices.ts)**

```typescript
import { Router } from 'express';
import { getCoinGeckoMarkets, getBinanceAllPrices } from '../services/binance';

const router = Router();

const MAJOR_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin", coinGeckoId: "bitcoin", fallbackPrice: 97500 },
  { symbol: "ETHUSDT", name: "Ethereum", coinGeckoId: "ethereum", fallbackPrice: 3750 },
  // ... rest of coins
];

router.get('/prices', async (req, res, next) => {
  try {
    // Try CoinGecko first
    const coinGeckoIds = MAJOR_COINS.map((c) => c.coinGeckoId);
    const marketData = await getCoinGeckoMarkets(coinGeckoIds);

    const tradingPairs = MAJOR_COINS.map((coin) => {
      const data = marketData.find((m: any) => m.id === coin.coinGeckoId);
      // ... transform data
      return transformedData;
    });

    res.json({
      data: tradingPairs,
      lastUpdated: Date.now(),
      source: "coingecko",
    });
  } catch (error) {
    // Try Binance fallback
    try {
      const allPrices = await getBinanceAllPrices();
      // ... handle Binance data
      res.json({ data, source: "binance" });
    } catch (binanceError) {
      next(binanceError);
    }
  }
});

export default router;
```

### Step 5: Environment Variables (backend/.env.example)

```bash
# Server Configuration
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://senkai.xyz

# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# APIs
HUGGINGFACE_API_KEY=hf_...
COINMARKETCAP_API_KEY=...
COINGECKO_API_KEY=CG-...

# Payment
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://senkai.xyz,https://www.senkai.xyz,http://localhost:3000
```

### Step 6: Deployment Options for Backend

#### Option A: Vercel (Serverless)

**Pros:**
- Easy deployment
- Automatic scaling
- No server management

**Cons:**
- 10-second timeout limit
- Cold starts
- Not ideal for long-running processes

**Setup:**
```json
// vercel.json (in backend/)
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.ts"
    }
  ]
}
```

#### Option B: Railway (Recommended)

**Pros:**
- Full Node.js server
- No timeout limits
- Automatic deployments from Git
- Free tier available
- Custom domains

**Cons:**
- Not as mature as Heroku
- Smaller community

**Setup:**
1. Go to https://railway.app/
2. Connect GitHub repo
3. Select backend folder
4. Add environment variables
5. Deploy
6. Add custom domain: api.senkai.xyz

#### Option C: DigitalOcean App Platform

**Pros:**
- Managed container service
- Good performance
- Predictable pricing
- Built-in monitoring

**Cons:**
- More expensive than Railway
- Less automated than Vercel

**Setup:**
1. Go to https://cloud.digitalocean.com/apps
2. Create new app from GitHub
3. Configure build settings
4. Add environment variables
5. Deploy
6. Add domain: api.senkai.xyz

#### Option D: AWS/Google Cloud (For Scale)

**Use when:**
- Need massive scale
- Want full control
- Have DevOps resources

---

## 🔧 FRONTEND CHANGES NEEDED

### Update API Base URL

**Before (Next.js API Routes):**
```typescript
// Frontend calls relative URLs
fetch('/api/prices')
```

**After (Separate Backend):**
```typescript
// Frontend calls api.senkai.xyz
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.senkai.xyz';

fetch(`${API_BASE_URL}/api/prices`)
```

### Create API Client (frontend/lib/api-client.ts)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.senkai.xyz';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      credentials: 'include', // Send cookies
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Usage:
// const prices = await apiClient.get<PriceData>('/api/prices');
```

### Update All API Calls

```bash
# Find all API calls in frontend
grep -r "fetch('/api/" app/

# Update each to use apiClient
# Before:
const data = await fetch('/api/prices').then(r => r.json());

# After:
const data = await apiClient.get('/api/prices');
```

---

## 🌐 DOMAIN & DNS CONFIGURATION

### Add Subdomain: api.senkai.xyz

**If using Cloudflare:**
```
1. Go to Cloudflare Dashboard
2. Select senkai.xyz domain
3. DNS → Add Record
4. Type: CNAME
5. Name: api
6. Target: [your-backend-host] (e.g., your-app.railway.app)
7. Proxy status: Proxied (for DDoS protection)
8. Save
```

**If using Vercel DNS:**
```
1. Go to Vercel Dashboard
2. Backend project → Settings → Domains
3. Add domain: api.senkai.xyz
4. Follow instructions to configure DNS
```

---

## ✅ MIGRATION CHECKLIST

### Backend Setup
- [ ] Create backend/ directory
- [ ] Initialize Node.js project
- [ ] Install dependencies
- [ ] Set up TypeScript
- [ ] Create project structure
- [ ] Migrate /api/prices route
- [ ] Migrate /api/fear-greed route
- [ ] Migrate /api/klines route
- [ ] Migrate /api/chat route
- [ ] Migrate /api/stripe routes
- [ ] Migrate all other routes (13 total)
- [ ] Add error handling middleware
- [ ] Add authentication middleware
- [ ] Add rate limiting
- [ ] Configure CORS
- [ ] Test locally (http://localhost:3001)
- [ ] Deploy to hosting provider
- [ ] Configure domain (api.senkai.xyz)
- [ ] Test production endpoints

### Frontend Updates
- [ ] Add NEXT_PUBLIC_API_URL env var
- [ ] Create API client utility
- [ ] Update all fetch('/api/...) calls
- [ ] Test API integration locally
- [ ] Deploy updated frontend
- [ ] Test production integration

### Infrastructure
- [ ] Set up backend hosting (Railway/Vercel/DO)
- [ ] Configure environment variables
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Set up error tracking (Sentry)
- [ ] Configure SSL/HTTPS
- [ ] Test load balancing (if needed)

---

## 🎯 RECOMMENDED APPROACH

### Quick Start (1-2 days)

Use **Railway** + **Express.js**:

1. **Day 1 Morning:** Set up Express backend structure
2. **Day 1 Afternoon:** Migrate 6-7 API routes
3. **Day 1 Evening:** Deploy to Railway, configure api.senkai.xyz
4. **Day 2 Morning:** Migrate remaining routes
5. **Day 2 Afternoon:** Update frontend API calls
6. **Day 2 Evening:** Test end-to-end, deploy frontend

### Alternative (Current Setup Works!)

**Keep Next.js API Routes** if:
- Current setup meets needs
- Want faster development
- Don't need independent scaling
- Team is small

**Only separate backend if:**
- Need independent scaling
- Want microservices architecture
- Have DevOps resources
- Expecting massive traffic

---

## 📊 COST COMPARISON

| Solution | Cost/Month | Pros | Cons |
|----------|------------|------|------|
| Next.js API Routes (Current) | $0-20 | Simple, fast | Coupled deployment |
| Railway | $5-20 | Easy, full server | Startup issues |
| Vercel Functions | $0-20 | Serverless | 10s timeout |
| DigitalOcean | $12+ | Reliable | More config |
| AWS/GCP | $20+ | Scalable | Complex |

---

## 🚨 IMPORTANT DECISION

Before proceeding with backend separation, please confirm:

**Do you want to:**

**A) Keep current setup (Next.js API Routes)**
- ✅ Faster to deploy
- ✅ Simpler architecture
- ✅ Currently working
- ⚠️ Coupled deployment

**B) Separate to api.senkai.xyz**
- ✅ Independent scaling
- ✅ Better for microservices
- ⚠️ More complex
- ⚠️ 1-2 days work

**My recommendation:** If current deployment is working and meeting performance needs, **keep Next.js API Routes** for now. You can always separate later if needed.

---

**What would you like to do?**

1. Continue with current Next.js API Routes and focus on deployment?
2. Start backend separation to api.senkai.xyz?
3. Hybrid approach (keep some routes, separate critical ones)?

Let me know your decision and I'll proceed accordingly! 🚀
