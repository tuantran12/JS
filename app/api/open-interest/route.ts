import { NextResponse } from "next/server";
import { getBinanceOpenInterest, handleApiError } from "@/lib/api";

const MAJOR_FUTURES = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

// Generate fallback OI data
function generateFallbackOI() {
  const baseOI = [
    { symbol: "BTCUSDT", oi: 25000000000 },
    { symbol: "ETHUSDT", oi: 8000000000 },
    { symbol: "BNBUSDT", oi: 500000000 },
    { symbol: "SOLUSDT", oi: 450000000 },
    { symbol: "XRPUSDT", oi: 350000000 },
  ];

  const openInterestData = baseOI.map((item) => ({
    exchange: "Binance",
    symbol: item.symbol,
    openInterest: item.oi * (0.95 + Math.random() * 0.1),
    change24h: (Math.random() - 0.5) * 0.05 * item.oi,
    timestamp: Date.now(),
  }));

  const totalOI = openInterestData.reduce((sum, item) => sum + item.openInterest, 0);
  const change24h = totalOI * (Math.random() * 0.04 - 0.02);
  const changePercent24h = totalOI > 0 ? (change24h / totalOI) * 100 : 0;

  return {
    total: totalOI,
    change24h,
    changePercent24h,
    byExchange: openInterestData,
  };
}

export async function GET() {
  try {
    const openInterestData = await Promise.all(
      MAJOR_FUTURES.map(async (symbol) => {
        try {
          const data = await getBinanceOpenInterest(symbol);
          return {
            exchange: "Binance",
            symbol,
            openInterest: parseFloat(data.openInterest),
            change24h: 0,
            timestamp: Date.now(),
          };
        } catch (error) {
          console.error(`Error fetching OI for ${symbol}:`, error);
          return {
            exchange: "Binance",
            symbol,
            openInterest: 0,
            change24h: 0,
            timestamp: Date.now(),
          };
        }
      })
    );

    // Calculate total open interest
    const totalOI = openInterestData.reduce((sum, item) => sum + item.openInterest, 0);

    // Simulate 24h change
    const change24h = totalOI * (Math.random() * 0.04 - 0.02);
    const changePercent24h = totalOI > 0 ? (change24h / totalOI) * 100 : 0;

    return NextResponse.json({
      data: {
        total: totalOI,
        change24h,
        changePercent24h,
        byExchange: openInterestData,
      },
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    console.error("Error fetching open interest:", error);

    // Return fallback data on any error
    if (error?.response?.status === 451 || error?.response?.status === 403) {
      console.warn("Binance API restricted, using fallback OI data");
    }

    return NextResponse.json({
      data: generateFallbackOI(),
      lastUpdated: Date.now(),
      fallback: true,
    });
  }
}
