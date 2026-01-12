# 📊 SENKAI PROJECT STRUCTURE ANALYSIS

> **Purpose**: Chi tiết phân tích cấu trúc project, phân biệt rõ ràng giữa Marketing Website và Platform App

---

## 🏗️ KIẾN TRÚC TỔNG QUAN

Project SENKAI sử dụng **Next.js 14 Route Groups** để tách biệt hoàn toàn 2 phần:

```
senkai.xyz/                    → Marketing Website (Brand/Content)
senkai.xyz/dashboard           → Platform App (Product/Trading)
app.senkai.xyz/                → Platform App (Alternative subdomain)
```

---

## 📂 CẤU TRÚC THỨ MỤC CHI TIẾT

### 1️⃣ MARKETING WEBSITE (Brand/Content)
**Mục đích**: Thu hút người dùng, giới thiệu sản phẩm, nội dung giáo dục

#### 📁 Pages (7 trang)
```
app/(marketing)/
├── page.tsx                    → Landing page (senkai.xyz/)
├── whitepaper/page.tsx         → Whitepaper (senkai.xyz/whitepaper)
├── articles/page.tsx           → Articles/Blog (senkai.xyz/articles)
├── news/page.tsx               → News (senkai.xyz/news)
├── pricing/page.tsx            → Pricing page (senkai.xyz/pricing)
├── vip/page.tsx               → VIP info (senkai.xyz/vip)
└── layout.tsx                 → Marketing layout (Header + Footer)
```

**Đặc điểm**:
- ✅ Không cần wallet connection
- ✅ Nội dung tĩnh (static content)
- ✅ SEO-optimized
- ✅ Public access (không cần authentication)
- ✅ Header có button "Launch App"

---

### 2️⃣ PLATFORM APP (Product/Trading)
**Mục đích**: Ứng dụng trading thực tế, tính năng Web3, yêu cầu wallet

#### 📁 Pages (18 trang chức năng)

**Dashboard & Overview**
```
app/(platform)/
├── dashboard/page.tsx          → Main dashboard (senkai.xyz/dashboard)
└── analytics/page.tsx          → Analytics overview
```

**Analytics Tools (7 công cụ phân tích)**
```
app/(platform)/analytics/
├── etf/page.tsx               → ETF data analysis
├── liquidations/page.tsx      → Liquidations tracking
├── rsi/page.tsx               → RSI indicator
├── open-interest/page.tsx     → Open Interest analysis
├── long-short/page.tsx        → Long/Short ratio
├── altcoin-season/page.tsx    → Altcoin season index
└── funding-rate/              → Funding rate (via API)
```

**Trading Features**
```
app/(platform)/
├── swap/page.tsx              → Token swap (Jupiter DEX)
├── copy-trading/page.tsx      → Copy trading platform
├── portfolio/page.tsx         → Portfolio/Holdings view
└── transactions/page.tsx      → Transaction history
```

**User Management**
```
app/(platform)/
├── profile/page.tsx           → User profile (5 tabs)
├── notifications/page.tsx     → Notification center
├── subscription/page.tsx      → Subscription plans
└── subscription/success/page.tsx  → Payment success callback
```

**AI Features**
```
app/(platform)/
└── chat/page.tsx              → AI Chat (Hugging Face)
```

**Layout**
```
app/(platform)/
└── layout.tsx                 → Platform layout with WalletProvider
```

**Đặc điểm**:
- ✅ Yêu cầu wallet connection (Phantom/Solflare)
- ✅ Real-time data từ blockchain
- ✅ Tương tác với Solana blockchain
- ✅ Giao dịch on-chain
- ✅ Header có "Wallet Connect" button
- ✅ Authentication qua wallet signature

---

## 🔌 API ROUTES (Chia sẻ cho cả 2 phần)

### Analytics APIs (9 endpoints)
```
app/api/
├── altcoin-season/route.ts    → Altcoin season data
├── etf/route.ts               → ETF flows data
├── fear-greed/route.ts        → Fear & Greed Index
├── funding-rate/route.ts      → Funding rates
├── klines/route.ts            → Candlestick data
├── liquidations/route.ts      → Liquidation events
├── long-short/route.ts        → Long/Short ratios
├── open-interest/route.ts     → Open Interest data
├── prices/route.ts            → Real-time prices
└── rsi/route.ts               → RSI calculations
```

**Sử dụng**: Analytics pages trong Platform

### AI APIs (1 endpoint)
```
app/api/
└── chat/route.ts              → Hugging Face AI chat
```

**Sử dụng**: Chat page trong Platform

### Payment APIs (2 endpoints)
```
app/api/stripe/
├── create-checkout-session/route.ts  → Tạo Stripe checkout
└── webhooks/stripe/route.ts          → Stripe webhook handler
```

**Sử dụng**: Subscription pages trong Platform

---

## 🎨 COMPONENTS (Chia sẻ giữa Marketing & Platform)

### Shared Components (Dùng chung)
```
components/
├── Header.tsx                 → Header với logic điều kiện:
│                                 • Marketing routes → "Launch App" button
│                                 • Platform routes → "Wallet Connect" button
├── Footer.tsx                 → Footer (giống nhau)
└── Navbar.tsx                 → Navigation bar (optional)
```

### Platform-Only Components (Chỉ Platform dùng)
```
components/
├── WalletButton.tsx           → Solana wallet connect button
├── ChartPopup.tsx             → Chart modal popup
├── MarketOverview.tsx         → Market statistics
├── MetricCard.tsx             → Metric display card
├── SimpleLineChart.tsx        → Line chart component
└── TradingPairsTable.tsx      → Trading pairs table
```

### UI Components (Dùng chung)
```
components/ui/
├── badge.tsx                  → Badge component
├── button.tsx                 → Button component
├── card.tsx                   → Card component
├── tabs.tsx                   → Tabs component
└── tooltip.tsx                → Tooltip component
```

---

## 📚 LIB (Utilities - Dùng chung)

```
lib/
├── api.ts                     → API fetch utilities
├── api/huggingface.ts         → Hugging Face API client
├── store.ts                   → State management (Zustand)
├── types.ts                   → TypeScript types
└── utils.ts                   → Helper functions (cn, formatters)
```

---

## 🗂️ DATABASE SCHEMA (Platform Only)

```
supabase/schema.sql            → Database schema cho:
                                 • users
                                 • subscriptions
                                 • transactions
                                 • notifications
                                 • copy_trades
                                 • api_keys
```

**Sử dụng**: Chỉ Platform App (sau khi integrate Supabase)

---

## 🌐 ROUTING LOGIC

### Marketing Routes (Public)
```
/                              → Landing page
/whitepaper                    → Whitepaper
/articles                      → Articles
/news                          → News
/pricing                       → Pricing
/vip                           → VIP info
```

### Platform Routes (Wallet Required)
```
/dashboard                     → Dashboard
/analytics                     → Analytics overview
/analytics/etf                 → ETF analysis
/analytics/liquidations        → Liquidations
/analytics/rsi                 → RSI
/analytics/open-interest       → Open Interest
/analytics/long-short          → Long/Short
/analytics/altcoin-season      → Altcoin season
/swap                          → Token swap
/copy-trading                  → Copy trading
/portfolio                     → Portfolio
/transactions                  → Transaction history
/profile                       → User profile
/notifications                 → Notifications
/subscription                  → Subscription management
/chat                          → AI Chat
```

---

## 🎯 PHÂN BIỆT MARKETING VS PLATFORM

| Tiêu chí | Marketing Website | Platform App |
|----------|------------------|--------------|
| **URL** | `senkai.xyz/` | `senkai.xyz/dashboard`, `app.senkai.xyz` |
| **Folder** | `app/(marketing)/` | `app/(platform)/` |
| **Authentication** | ❌ Không cần | ✅ Wallet required |
| **Wallet Integration** | ❌ Không có | ✅ WalletProvider enabled |
| **Header Button** | "Launch App" | "Wallet Connect" |
| **Layout** | `(marketing)/layout.tsx` | `(platform)/layout.tsx` |
| **Blockchain Interaction** | ❌ Không có | ✅ Solana transactions |
| **Real-time Data** | ❌ Static content | ✅ Live market data |
| **Database** | ❌ Không dùng | ✅ Supabase (sau khi integrate) |
| **SEO** | ✅ SEO-optimized | ⚠️ Limited (client-side) |
| **Target Users** | Visitors, Prospects | Active traders, Users |
| **Content Type** | Informational, Educational | Functional, Transactional |
| **Pages** | 7 pages | 18 pages |
| **Deployment** | Static generation | Dynamic (client-side) |

---

## 🔧 MIDDLEWARE LOGIC

```typescript
// middleware.ts
// Phân biệt routing dựa trên pathname:
const pathname = request.nextUrl.pathname;

// Marketing routes
if (pathname === '/' ||
    pathname.startsWith('/whitepaper') ||
    pathname.startsWith('/articles') ||
    pathname.startsWith('/news') ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/vip')) {
  // No wallet required
}

// Platform routes
if (pathname.startsWith('/dashboard') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/swap') ||
    pathname.startsWith('/portfolio') ||
    pathname.startsWith('/notifications') ||
    pathname.startsWith('/subscription') ||
    pathname.startsWith('/transactions') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/chat') ||
    pathname.startsWith('/copy-trading')) {
  // Wallet required (checked client-side)
}
```

---

## 📊 DEPENDENCIES BY SECTION

### Marketing Dependencies (Minimal)
```json
{
  "next": "14.2.35",
  "react": "^18",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.344.0"  // Icons
}
```

### Platform Dependencies (Full Stack)
```json
{
  // Solana
  "@solana/web3.js": "^1.87.6",
  "@solana/wallet-adapter-react": "^0.15.35",
  "@solana/wallet-adapter-wallets": "^0.19.26",

  // Charts
  "recharts": "^2.10.3",

  // API
  "axios": "^1.6.5",

  // State Management
  "zustand": "^4.4.7",

  // Payments
  "stripe": "^14.10.0",

  // AI
  "@huggingface/inference": "^2.6.1"
}
```

---

## 🚀 BUILD OUTPUT

```
✓ Static pages (Marketing):
  ○ /                                    → Landing
  ○ /whitepaper                          → Whitepaper
  ○ /articles                            → Articles
  ○ /news                                → News
  ○ /pricing                             → Pricing
  ○ /vip                                 → VIP

✓ Dynamic pages (Platform):
  ○ /dashboard                           → Dashboard
  ○ /analytics/*                         → 7 analytics pages
  ○ /swap                                → Swap
  ○ /portfolio                           → Portfolio
  ○ /notifications                       → Notifications
  ○ /subscription                        → Subscription
  ○ /transactions                        → Transactions
  ○ /profile                             → Profile
  ○ /chat                                → AI Chat
  ○ /copy-trading                        → Copy Trading

ƒ API Routes:
  ƒ /api/chat                            → AI endpoint
  ƒ /api/stripe/*                        → Payment endpoints
  ○ /api/analytics/*                     → 9 analytics endpoints
```

---

## 💡 KHUYẾN NGHỊ TỔ CHỨC

### Option 1: Single Domain (Hiện tại)
```
senkai.xyz/                    → Marketing
senkai.xyz/dashboard           → Platform (sau khi connect wallet)
```

**Ưu điểm**:
- ✅ Single domain, dễ quản lý
- ✅ SEO tốt (all content under one domain)
- ✅ Chuyển đổi mượt mà từ marketing → platform

**Nhược điểm**:
- ⚠️ Marketing và Platform share same session
- ⚠️ Bundle size lớn hơn

### Option 2: Subdomain (Optional)
```
senkai.xyz/                    → Marketing only
app.senkai.xyz/                → Platform only
```

**Ưu điểm**:
- ✅ Hoàn toàn tách biệt
- ✅ Bundle size nhỏ hơn cho từng phần
- ✅ Deploy độc lập

**Nhược điểm**:
- ⚠️ Cần configure DNS
- ⚠️ Cần update middleware

---

## 📋 CHECKLIST PHÂN BIỆT

### Marketing Website Checklist
- [ ] **Content**: Informational, educational
- [ ] **Pages**: Landing, Whitepaper, Articles, News, Pricing, VIP
- [ ] **Authentication**: None required
- [ ] **Wallet**: No wallet needed
- [ ] **SEO**: Fully optimized
- [ ] **Target**: Visitors, prospects, researchers
- [ ] **CTA**: "Launch App" button to go to platform

### Platform App Checklist
- [ ] **Content**: Functional, transactional
- [ ] **Pages**: Dashboard, Trading, Analytics, Profile
- [ ] **Authentication**: Wallet-based
- [ ] **Wallet**: Required (Phantom, Solflare)
- [ ] **SEO**: Limited (client-side rendering)
- [ ] **Target**: Active traders, users
- [ ] **CTA**: "Connect Wallet" to start trading

---

## 🎯 SUMMARY

**Marketing Website** (7 pages):
- Mục đích: Thu hút người dùng mới
- Không cần wallet
- Content tĩnh, SEO-friendly
- Folder: `app/(marketing)/`

**Platform App** (18 pages):
- Mục đích: Giao dịch, phân tích, quản lý tài khoản
- Cần wallet Solana
- Dynamic data, blockchain interaction
- Folder: `app/(platform)/`

**Shared**:
- Components: Header, Footer, UI components
- API Routes: Analytics, AI, Payments
- Lib: Utilities, types, helpers

---

*Last Updated: January 2026*
*Repository: https://github.com/tuantran12/JS*
