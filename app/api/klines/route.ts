import { NextResponse } from "next/server";
import { getBinanceKlines } from "@/lib/api";

// Map CoinGecko IDs to Binance symbols
const SYMBOL_MAP: Record<string, string> = {
  "bitcoin": "BTCUSDT",
  "ethereum": "ETHUSDT",
  "ripple": "XRPUSDT",
  "binancecoin": "BNBUSDT",
  "solana": "SOLUSDT",
  "dogecoin": "DOGEUSDT",
  "cardano": "ADAUSDT",
  "chainlink": "LINKUSDT",
  "avalanche-2": "AVAXUSDT",
  "polkadot": "DOTUSDT",
  "matic-network": "MATICUSDT",
  "uniswap": "UNIUSDT",
};

// Generate fallback candlestick data
function generateFallbackKlines(symbol: string, interval: string, limit: number, basePrice: number) {
  const klines = [];
  const now = Date.now();

  // Interval to milliseconds
  const intervalMs: Record<string, number> = {
    '1m': 60 * 1000,
    '3m': 3 * 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '8h': 8 * 60 * 60 * 1000,
    '12h': 12 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1w': 7 * 24 * 60 * 60 * 1000,
  };

  const ms = intervalMs[interval] || 60 * 60 * 1000;

  for (let i = limit - 1; i >= 0; i--) {
    const time = now - i * ms;

    // Generate realistic price movement
    const trend = Math.sin(i / 10) * 0.02; // Overall trend
    const noise = (Math.random() - 0.5) * 0.03; // Random noise
    const movement = trend + noise;

    const open = basePrice * (1 + movement);
    const close = open * (1 + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);
    const volume = basePrice * 100000 * (0.5 + Math.random());

    klines.push({
      time: Math.floor(time / 1000), // Convert to seconds for Lightweight Charts
      open,
      high,
      low,
      close,
      volume,
    });

    basePrice = close; // Update base price for next candle
  }

  return klines;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol") || "BTCUSDT";
    const interval = searchParams.get("interval") || "1h";
    const limit = parseInt(searchParams.get("limit") || "200");

    // Try Binance API first
    try {
      const klines = await getBinanceKlines(symbol, interval, limit);

      // Transform Binance klines format to our format
      const formattedKlines = klines.map((k: any) => ({
        time: Math.floor(k[0] / 1000), // Convert ms to seconds
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
      }));

      return NextResponse.json({
        data: formattedKlines,
        symbol,
        interval,
        source: "binance",
        lastUpdated: Date.now(),
      });
    } catch (binanceError: any) {
      const status = binanceError?.response?.status || binanceError?.status;
      const isBlocked = status === 451 || status === 403;

      if (isBlocked) {
        console.warn(`Binance klines blocked (451/403) for ${symbol}, using fallback data`);
      } else {
        console.error(`Error fetching Binance klines for ${symbol}:`, binanceError?.message);
      }

      // Use fallback data
      // Estimate base price from symbol
      const basePrices: Record<string, number> = {
        "BTCUSDT": 97500,
        "ETHUSDT": 3750,
        "XRPUSDT": 2.85,
        "BNBUSDT": 625,
        "SOLUSDT": 185,
        "DOGEUSDT": 0.32,
        "ADAUSDT": 0.95,
        "LINKUSDT": 22.5,
        "AVAXUSDT": 38,
        "DOTUSDT": 7.5,
        "MATICUSDT": 0.87,
        "UNIUSDT": 13.5,
      };

      const basePrice = basePrices[symbol] || 100;
      const fallbackKlines = generateFallbackKlines(symbol, interval, limit, basePrice);

      return NextResponse.json({
        data: fallbackKlines,
        symbol,
        interval,
        source: "fallback",
        fallback: true,
        lastUpdated: Date.now(),
        message: "Live klines data temporarily unavailable - showing simulated data",
      });
    }
  } catch (error: any) {
    console.error("Error in klines API:", error?.message || error);

    return NextResponse.json(
      {
        error: "Failed to fetch klines data",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
