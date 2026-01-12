import { NextResponse } from "next/server";
import { getBinanceAllPrices, getCoinGeckoMarkets, handleApiError } from "@/lib/api";
import type { TradingPair } from "@/lib/types";

// Major coins to track with CoinGecko IDs
const MAJOR_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin", coinGeckoId: "bitcoin", fallbackPrice: 97500 },
  { symbol: "ETHUSDT", name: "Ethereum", coinGeckoId: "ethereum", fallbackPrice: 3750 },
  { symbol: "XRPUSDT", name: "XRP", coinGeckoId: "ripple", fallbackPrice: 2.85 },
  { symbol: "BNBUSDT", name: "BNB", coinGeckoId: "binancecoin", fallbackPrice: 625 },
  { symbol: "SOLUSDT", name: "Solana", coinGeckoId: "solana", fallbackPrice: 185 },
  { symbol: "DOGEUSDT", name: "Dogecoin", coinGeckoId: "dogecoin", fallbackPrice: 0.32 },
  { symbol: "ADAUSDT", name: "Cardano", coinGeckoId: "cardano", fallbackPrice: 0.95 },
  { symbol: "LINKUSDT", name: "Chainlink", coinGeckoId: "chainlink", fallbackPrice: 22.5 },
  { symbol: "AVAXUSDT", name: "Avalanche", coinGeckoId: "avalanche-2", fallbackPrice: 38 },
  { symbol: "DOTUSDT", name: "Polkadot", coinGeckoId: "polkadot", fallbackPrice: 7.5 },
  { symbol: "MATICUSDT", name: "Polygon", coinGeckoId: "matic-network", fallbackPrice: 0.87 },
  { symbol: "UNIUSDT", name: "Uniswap", coinGeckoId: "uniswap", fallbackPrice: 13.5 },
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
    // PRIMARY: Try CoinGecko API first (not geo-restricted)
    const coinGeckoIds = MAJOR_COINS.map((c) => c.coinGeckoId);
    const marketData = await getCoinGeckoMarkets(coinGeckoIds);

    // Map CoinGecko data to TradingPair format
    const tradingPairs: TradingPair[] = MAJOR_COINS.map((coin) => {
      const data = marketData.find((m: any) => m.id === coin.coinGeckoId);

      if (!data) {
        throw new Error(`No data for ${coin.coinGeckoId}`);
      }

      const price = data.current_price || 0;
      const priceChange = data.price_change_24h || 0;
      const priceChangePercent = data.price_change_percentage_24h || 0;
      const quoteVolume = data.total_volume || 0;

      // Calculate buy/sell volume based on price movement
      // More realistic: when price goes up, buy volume is higher; when down, sell volume is higher
      const buyVolumeRatio = priceChangePercent >= 0
        ? 0.52 + (priceChangePercent / 100) * 0.03  // 52-55% if positive
        : 0.48 + (priceChangePercent / 100) * 0.03; // 45-48% if negative

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
        volumeChange: priceChange * (quoteVolume / price),
        volumeChangePercent: priceChangePercent,
        netFlow,
        lastUpdated: Date.now(),
      };
    });

    return NextResponse.json({
      data: tradingPairs,
      lastUpdated: Date.now(),
      source: "coingecko",
    });
  } catch (coinGeckoError: any) {
    console.warn("CoinGecko API failed, trying Binance:", coinGeckoError?.message);

    // FALLBACK 1: Try Binance API
    try {
      const allPrices = await getBinanceAllPrices();

      const tradingPairs: TradingPair[] = MAJOR_COINS.map((coin) => {
        const data = allPrices.find((p: any) => p.symbol === coin.symbol);

        if (!data) {
          throw new Error(`No Binance data for ${coin.symbol}`);
        }

        const price = parseFloat(data.lastPrice);
        const priceChange = parseFloat(data.priceChange);
        const priceChangePercent = parseFloat(data.priceChangePercent);
        const quoteVolume = parseFloat(data.quoteVolume);

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
          volumeChange: priceChange * parseFloat(data.volume),
          volumeChangePercent: priceChangePercent,
          netFlow,
          lastUpdated: Date.now(),
        };
      });

      return NextResponse.json({
        data: tradingPairs,
        lastUpdated: Date.now(),
        source: "binance",
      });
    } catch (binanceError: any) {
      const status = binanceError?.response?.status || binanceError?.status;
      const isBlocked = status === 451 || status === 403;

      if (isBlocked) {
        console.warn("Binance API also restricted (451/403), using fallback data");
      } else {
        console.error("Both APIs failed:", binanceError?.message);
      }

      // FALLBACK 2: Use simulated data
      return NextResponse.json({
        data: generateFallbackData(),
        lastUpdated: Date.now(),
        fallback: true,
        source: "fallback",
        message: "Live data temporarily unavailable - showing simulated data",
      });
    }
  }
}
