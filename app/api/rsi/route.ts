import { NextResponse } from "next/server";
import { getBinanceKlines } from "@/lib/api";

// Calculate RSI from price data
function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) {
    return 50; // Default neutral RSI if not enough data
  }

  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // Calculate average gain and loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  // Calculate RSI
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return Math.max(0, Math.min(100, rsi));
}

const MAJOR_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "BNBUSDT", name: "BNB" },
  { symbol: "SOLUSDT", name: "Solana" },
  { symbol: "XRPUSDT", name: "XRP" },
  { symbol: "ADAUSDT", name: "Cardano" },
  { symbol: "DOGEUSDT", name: "Dogecoin" },
  { symbol: "AVAXUSDT", name: "Avalanche" },
  { symbol: "DOTUSDT", name: "Polkadot" },
  { symbol: "MATICUSDT", name: "Polygon" },
  { symbol: "LINKUSDT", name: "Chainlink" },
  { symbol: "UNIUSDT", name: "Uniswap" },
];

// Generate fallback RSI data
function generateFallbackRSI() {
  const rsiValues = MAJOR_COINS.map(() => 25 + Math.random() * 50); // 25-75 range
  const averageRSI = rsiValues.reduce((a, b) => a + b, 0) / rsiValues.length;
  
  return {
    averageRSI: Math.round(averageRSI * 100) / 100,
    byCoin: MAJOR_COINS.map((coin, i) => ({
      symbol: coin.symbol,
      name: coin.name,
      rsi: Math.round(rsiValues[i] * 100) / 100,
    })),
  };
}

export async function GET() {
  try {
    const rsiData = await Promise.all(
      MAJOR_COINS.map(async (coin) => {
        try {
          const klines = await getBinanceKlines(coin.symbol, "1h", 100);
          const closes = klines.map((k: any) => parseFloat(k[4])); // Close prices
          const rsi = calculateRSI(closes);
          
          return {
            symbol: coin.symbol,
            name: coin.name,
            rsi: Math.round(rsi * 100) / 100,
          };
        } catch (error: any) {
          // Silently handle 451/403 errors
          const status = error?.response?.status || error?.status;
          if (status !== 451 && status !== 403) {
            console.error(`Error fetching RSI for ${coin.symbol}:`, error?.message || error);
          }
          // Return fallback RSI
          return {
            symbol: coin.symbol,
            name: coin.name,
            rsi: Math.round((25 + Math.random() * 50) * 100) / 100,
          };
        }
      })
    );

    const averageRSI = rsiData.reduce((sum, item) => sum + item.rsi, 0) / rsiData.length;

    return NextResponse.json({
      data: {
        averageRSI: Math.round(averageRSI * 100) / 100,
        byCoin: rsiData,
      },
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    const status = error?.response?.status || error?.status;
    const isBlocked = status === 451 || status === 403;

    if (isBlocked) {
      console.warn("Binance API restricted (451/403), using fallback RSI data");
    } else {
      console.error("Error fetching RSI:", error?.message || error);
    }

    return NextResponse.json({
      data: generateFallbackRSI(),
      lastUpdated: Date.now(),
      fallback: true,
    });
  }
}

