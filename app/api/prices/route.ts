import { NextResponse } from "next/server";
import { getBinanceAllPrices, handleApiError } from "@/lib/api";
import type { TradingPair } from "@/lib/types";

// Major coins to track - Updated with realistic Jan 2026 market prices
const MAJOR_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin", fallbackPrice: 97500 },
  { symbol: "ETHUSDT", name: "Ethereum", fallbackPrice: 3750 },
  { symbol: "XRPUSDT", name: "XRP", fallbackPrice: 2.85 },
  { symbol: "BNBUSDT", name: "BNB", fallbackPrice: 625 },
  { symbol: "SOLUSDT", name: "Solana", fallbackPrice: 185 },
  { symbol: "DOGEUSDT", name: "Dogecoin", fallbackPrice: 0.32 },
  { symbol: "ADAUSDT", name: "Cardano", fallbackPrice: 0.95 },
  { symbol: "LINKUSDT", name: "Chainlink", fallbackPrice: 22.5 },
  { symbol: "AVAXUSDT", name: "Avalanche", fallbackPrice: 38 },
  { symbol: "DOTUSDT", name: "Polkadot", fallbackPrice: 7.5 },
  { symbol: "MATICUSDT", name: "Polygon", fallbackPrice: 0.87 },
  { symbol: "UNIUSDT", name: "Uniswap", fallbackPrice: 13.5 },
];

// Generate fallback data with realistic variation
function generateFallbackData(): TradingPair[] {
  return MAJOR_COINS.map((coin) => {
    // Add realistic price variation ±1.5% (more realistic than ±3%)
    const variation = (Math.random() - 0.5) * 0.03;
    const price = coin.fallbackPrice * (1 + variation);

    // Realistic 24h change: -3% to +3%
    const priceChangePercent = (Math.random() - 0.5) * 6;
    const priceChange = price * (priceChangePercent / 100);

    // Calculate volume based on market cap (more realistic)
    const baseVolume = coin.fallbackPrice > 1000 ? 50000000 : // BTC, ETH: $50M+
                       coin.fallbackPrice > 100 ? 20000000 :   // BNB, SOL: $20M+
                       coin.fallbackPrice > 10 ? 10000000 :    // LINK, UNI: $10M+
                       5000000;                                 // Others: $5M+

    const quoteVolume = baseVolume * (0.8 + Math.random() * 0.4); // ±20% variation

    // Buy/sell ratio based on price change
    const buyRatio = priceChangePercent >= 0 ?
                     0.52 + (priceChangePercent / 100) : // 52-55% if positive
                     0.48 + (priceChangePercent / 100);  // 45-48% if negative

    const buyVolume = quoteVolume * buyRatio;
    const sellVolume = quoteVolume - buyVolume;

    return {
      symbol: coin.symbol,
      name: coin.name,
      price,
      priceChange,
      priceChangePercent,
      buyVolume,
      sellVolume,
      volumeChange: priceChange * (quoteVolume / price),
      volumeChangePercent: priceChangePercent,
      netFlow: buyVolume - sellVolume,
      lastUpdated: Date.now(),
    };
  });
}

export async function GET() {
  try {
    const allPrices = await getBinanceAllPrices();

    // Filter and format data for major coins
    const tradingPairs: TradingPair[] = MAJOR_COINS.map((coin) => {
      const data = allPrices.find((p: any) => p.symbol === coin.symbol);

      if (!data) {
        return {
          symbol: coin.symbol,
          name: coin.name,
          price: 0,
          priceChange: 0,
          priceChangePercent: 0,
          buyVolume: 0,
          sellVolume: 0,
          volumeChange: 0,
          volumeChangePercent: 0,
          netFlow: 0,
          lastUpdated: Date.now(),
        };
      }

      const price = parseFloat(data.lastPrice);
      const priceChange = parseFloat(data.priceChange);
      const priceChangePercent = parseFloat(data.priceChangePercent);
      const volume = parseFloat(data.volume);
      const quoteVolume = parseFloat(data.quoteVolume);

      // Simulate buy/sell volume (in real app, this would come from order book data)
      // More realistic: when price goes up, buy volume is higher; when down, sell volume is higher
      const buyVolumeRatio = priceChangePercent >= 0 ? 0.52 + Math.random() * 0.06 : 0.48 + Math.random() * 0.06;
      const buyVolume = quoteVolume * buyVolumeRatio;
      const sellVolume = quoteVolume - buyVolume;
      const netFlow = buyVolume - sellVolume;

      return {
        symbol: coin.symbol,
        name: coin.name,
        price,
        priceChange,
        priceChangePercent,
        buyVolume,
        sellVolume,
        volumeChange: priceChange * volume,
        volumeChangePercent: priceChangePercent,
        netFlow,
        lastUpdated: Date.now(),
      };
    });

    return NextResponse.json({
      data: tradingPairs,
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    // Check for 451 (geographic restriction) or 403 (forbidden) errors
    const status = error?.response?.status || error?.status;
    const isBlocked = status === 451 || status === 403;

    if (isBlocked) {
      console.warn("Binance API restricted (451/403), using fallback data");
    } else {
      console.error("Error fetching prices:", error?.message || error);
    }

    // Always return fallback data to prevent app crash
    return NextResponse.json({
      data: generateFallbackData(),
      lastUpdated: Date.now(),
      fallback: true,
      message: "Live data temporarily unavailable - showing simulated data",
    });
  }
}
