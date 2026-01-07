import { NextResponse } from "next/server";
import { getBinanceAllPrices, handleApiError } from "@/lib/api";
import type { TradingPair } from "@/lib/types";

// Major coins to track
const MAJOR_COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "XRPUSDT", name: "XRP" },
  { symbol: "BNBUSDT", name: "BNB" },
  { symbol: "SOLUSDT", name: "Solana" },
  { symbol: "DOGEUSDT", name: "Dogecoin" },
  { symbol: "ADAUSDT", name: "Cardano" },
  { symbol: "LINKUSDT", name: "Chainlink" },
  { symbol: "AVAXUSDT", name: "Avalanche" },
  { symbol: "DOTUSDT", name: "Polkadot" },
  { symbol: "MATICUSDT", name: "Polygon" },
  { symbol: "UNIUSDT", name: "Uniswap" },
];

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
  } catch (error) {
    console.error("Error fetching prices:", error);
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    );
  }
}
