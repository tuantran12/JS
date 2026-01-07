import { NextResponse } from "next/server";
import { getBinanceAllPrices, handleApiError } from "@/lib/api";
import type { TradingPair } from "@/lib/types";

// Major coins to track
const MAJOR_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin", fallbackPrice: 50000 },
  { symbol: "ETHUSDT", name: "Ethereum", fallbackPrice: 3000 },
  { symbol: "XRPUSDT", name: "XRP", fallbackPrice: 0.55 },
  { symbol: "BNBUSDT", name: "BNB", fallbackPrice: 320 },
  { symbol: "SOLUSDT", name: "Solana", fallbackPrice: 110 },
  { symbol: "DOGEUSDT", name: "Dogecoin", fallbackPrice: 0.08 },
  { symbol: "ADAUSDT", name: "Cardano", fallbackPrice: 0.45 },
  { symbol: "LINKUSDT", name: "Chainlink", fallbackPrice: 15 },
  { symbol: "AVAXUSDT", name: "Avalanche", fallbackPrice: 35 },
  { symbol: "DOTUSDT", name: "Polkadot", fallbackPrice: 7 },
  { symbol: "MATICUSDT", name: "Polygon", fallbackPrice: 0.85 },
  { symbol: "UNIUSDT", name: "Uniswap", fallbackPrice: 11 },
];

// Generate fallback data with realistic variation
function generateFallbackData(): TradingPair[] {
  return MAJOR_COINS.map((coin) => {
    // Add random variation ±3%
    const variation = (Math.random() - 0.5) * 0.06;
    const price = coin.fallbackPrice * (1 + variation);
    const priceChangePercent = (Math.random() - 0.5) * 10; // -5% to +5%
    const priceChange = price * (priceChangePercent / 100);
    const quoteVolume = price * 1000000 * (0.5 + Math.random());

    const buyVolume = quoteVolume * (priceChangePercent >= 0 ? 0.55 : 0.45);
    const sellVolume = quoteVolume - buyVolume;

    return {
      symbol: coin.symbol,
      name: coin.name,
      price,
      priceChange,
      priceChangePercent,
      buyVolume,
      sellVolume,
      volumeChange: priceChange * 1000000,
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
      const buyVolume = quoteVolume * (priceChangePercent >= 0 ? 0.55 : 0.45);
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
    console.error("Error fetching prices:", error);

    // If Binance API is blocked (451) or unavailable, return fallback data
    if (error?.response?.status === 451 || error?.response?.status === 403) {
      console.warn("Binance API restricted, using fallback data");
      return NextResponse.json({
        data: generateFallbackData(),
        lastUpdated: Date.now(),
        fallback: true,
        message: "Live data temporarily unavailable - showing simulated data",
      });
    }

    // For other errors, return fallback data to prevent app crash
    console.warn("API error, using fallback data");
    return NextResponse.json({
      data: generateFallbackData(),
      lastUpdated: Date.now(),
      fallback: true,
      message: "Live data temporarily unavailable - showing simulated data",
    });
  }
}
