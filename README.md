# Crypto Analytics Platform

A comprehensive real-time cryptocurrency data analytics platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

### Market Overview Dashboard
- **Real-time Market Metrics**
  - Open Interest tracking across major exchanges
  - 24-hour Liquidation statistics (Long/Short breakdown)
  - Fear & Greed Index with visual gauge
  - Long/Short Ratio from multiple exchanges
  - US Bitcoin ETF flow data (cumulative inflow, daily average, total NAV)

### Trading Pairs Table
- Live price data for 12+ major cryptocurrencies
- Real-time price changes and percentage movements
- Buy/Sell volume analysis
- Net flow calculations
- Customizable timeframe selection (1H, 4H, 12H, 24H, 1W)
- Auto-refresh every 10 seconds

### Detailed Analytics Pages
1. **Open Interest Analysis** - Track total open interest by exchange
2. **Liquidations** - Monitor liquidation events with long/short distribution
3. **RSI Analysis** - Relative Strength Index for 15+ cryptocurrencies
4. **Long/Short Ratio** - Historical trends and exchange comparison
5. **ETF Data** - US Bitcoin ETF flow tracking with charts
6. **Altcoin Season Index** - Bitcoin vs Altcoin dominance meter

### News & Content
- Latest crypto news with categorization
- Educational articles
- VIP membership features

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI primitives (shadcn/ui style)
- **Charts:** Recharts for data visualization
- **State Management:** Zustand
- **API Calls:** Axios with built-in caching
- **Data Sources:**
  - Binance API (prices, futures data, funding rates)
  - CoinGecko API (market data)
  - Alternative.me API (Fear & Greed Index)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-analytics-platform
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
crypto-analytics/
├── app/
│   ├── analytics/          # Analytics pages
│   │   ├── page.tsx        # Main dashboard
│   │   ├── open-interest/
│   │   ├── liquidations/
│   │   ├── rsi/
│   │   ├── long-short/
│   │   ├── etf/
│   │   └── altcoin-season/
│   ├── api/                # API routes
│   │   ├── prices/
│   │   ├── liquidations/
│   │   ├── fear-greed/
│   │   ├── open-interest/
│   │   ├── long-short/
│   │   └── etf/
│   ├── news/
│   ├── articles/
│   ├── vip/
│   ├── layout.tsx
│   └── page.tsx
├── components/             # React components
│   ├── ui/                # UI primitives
│   ├── Navbar.tsx
│   ├── MarketOverview.tsx
│   ├── TradingPairsTable.tsx
│   ├── MetricCard.tsx
│   └── SimpleLineChart.tsx
├── lib/
│   ├── api.ts             # API utilities with caching
│   ├── types.ts           # TypeScript definitions
│   ├── utils.ts           # Helper functions
│   └── store.ts           # Zustand state management
└── public/
```

## Key Features Implementation

### API Caching
- In-memory caching with configurable TTL
- Automatic cache invalidation
- Retry logic with exponential backoff

### Real-time Updates
- Auto-refresh intervals for different data types
- Manual refresh capability
- Last updated timestamp display

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface

### Error Handling
- Graceful API failure handling
- User-friendly error messages
- Loading states for all async operations

## API Endpoints

### Internal API Routes

- `GET /api/prices` - Fetch current prices for major trading pairs
- `GET /api/liquidations` - Get 24h liquidation data
- `GET /api/fear-greed` - Retrieve Fear & Greed Index
- `GET /api/open-interest` - Get open interest by exchange
- `GET /api/long-short` - Fetch long/short ratio data
- `GET /api/etf` - Get US Bitcoin ETF flow data

### External APIs Used

- **Binance:** `https://api.binance.com/api/v3/`
- **Binance Futures:** `https://fapi.binance.com/fapi/v1/`
- **CoinGecko:** `https://api.coingecko.com/api/v3/`
- **Alternative.me:** `https://api.alternative.me/`

## Environment Variables

No environment variables required for basic functionality. All APIs used are public and free.

For production deployment, consider adding:
```env
NEXT_PUBLIC_API_BASE_URL=your-api-base-url
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy with default settings

The project is optimized for Vercel deployment with:
- Automatic serverless function creation for API routes
- Edge runtime support
- Built-in caching

## Performance Optimizations

- Server-side rendering (SSR) for initial page load
- API response caching
- Debounced user interactions
- Lazy loading for charts
- Optimized bundle size with code splitting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Data provided by Binance, CoinGecko, and Alternative.me
- UI components inspired by shadcn/ui
- Chart library: Recharts

## Future Enhancements

- [ ] WebSocket integration for true real-time updates
- [ ] TradingView Lightweight Charts integration
- [ ] User authentication with NextAuth.js
- [ ] Personalized watchlists and alerts
- [ ] PostgreSQL database with Prisma ORM
- [ ] Advanced technical indicators
- [ ] Portfolio tracking
- [ ] Mobile app (React Native)

## Support

For issues and questions, please open an issue in the GitHub repository.

---

**Note:** This platform is for educational and informational purposes only. It is not financial advice. Always do your own research before making investment decisions.
