# Crypto Analytics Platform

Live demo: [Deploy on Vercel](https://vercel.com/import/project?template=https://github.com/tuantran12/crypto-analytics-platform)

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tuantran12/crypto-analytics-platform)

### Option 1: One-Click Deploy

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Click "Deploy"
4. Done! Your app will be live in 2-3 minutes

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Option 3: GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Deploy"

## Environment Variables

No environment variables required! All APIs used are public and free.

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI (shadcn/ui)
- **Charts:** Recharts
- **State Management:** Zustand
- **APIs:** Binance, CoinGecko, Alternative.me

## Features

✅ Real-time cryptocurrency prices
✅ Market overview with 8+ metrics
✅ Trading pairs table for 12+ coins
✅ Open Interest tracking
✅ Liquidation analysis
✅ RSI indicators
✅ Long/Short ratio trends
✅ Bitcoin ETF flows
✅ Altcoin season index
✅ News and educational content
✅ Fully responsive design

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## API Routes

- `GET /api/prices` - Current prices for major pairs
- `GET /api/liquidations` - 24h liquidation data
- `GET /api/fear-greed` - Fear & Greed Index
- `GET /api/open-interest` - Open interest by exchange
- `GET /api/long-short` - Long/short ratio data
- `GET /api/etf` - US Bitcoin ETF flows

## Project Structure

```
crypto-analytics/
├── app/
│   ├── analytics/       # Analytics pages
│   ├── api/            # API routes
│   ├── news/           # News page
│   ├── articles/       # Articles page
│   └── vip/            # VIP membership
├── components/         # React components
├── lib/               # Utilities and types
└── public/            # Static assets
```

## Performance

- Build Size: ~87.5 kB shared JS
- First Load: < 150 kB
- Lighthouse Score: 95+
- API Caching: 5-60 seconds TTL
- Auto-refresh: 10-30 seconds

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Build fails on Vercel

Make sure you have:
- Node.js 18+ in vercel.json
- All dependencies in package.json
- No TypeScript errors

### API errors

- Check API rate limits
- Verify network access to external APIs
- Check browser console for CORS issues

### Slow loading

- Enable caching in vercel.json
- Use Vercel's Edge Network
- Check API response times

## License

MIT License

## Support

For issues: [GitHub Issues](https://github.com/tuantran12/crypto-analytics-platform/issues)

---

**Made with ❤️ using Next.js and TypeScript**
