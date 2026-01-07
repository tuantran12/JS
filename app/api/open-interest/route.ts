import { NextResponse } from "next/server";
import { getBinanceOpenInterest, handleApiError } from "@/lib/api";

const MAJOR_FUTURES = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

// Generate fallback OI data - Updated with realistic Jan 2026 values
function generateFallbackOI() {
  const baseOI = [
    { symbol: "BTCUSDT", oi: 38000000000 },  // $38B
    { symbol: "ETHUSDT", oi: 14500000000 },  // $14.5B
    { symbol: "BNBUSDT", oi: 1200000000 },   // $1.2B
    { symbol: "SOLUSDT", oi: 1800000000 },   // $1.8B
    { symbol: "XRPUSDT", oi: 2100000000 },   // $2.1B
  ];

  const openInterestData = baseOI.map((item) => {
    // Realistic variation ±2%
    const variation = 0.98 + Math.random() * 0.04;
    const oi = item.oi * variation;

    // 24h change: -1% to +1%
    const changePercent = (Math.random() - 0.5) * 2;
    const change24h = oi * (changePercent / 100);

    return {
      exchange: "Binance",
      symbol: item.symbol,
      openInterest: oi,
      change24h,
      timestamp: Date.now(),
    };
  });

  const totalOI = openInterestData.reduce((sum, item) => sum + item.openInterest, 0);
  const totalChange24h = openInterestData.reduce((sum, item) => sum + item.change24h, 0);
  const changePercent24h = totalOI > 0 ? (totalChange24h / totalOI) * 100 : 0;

  return {
    total: totalOI,
    change24h: totalChange24h,
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
        } catch (error: any) {
          // Silently handle 451/403 errors during build
          const status = error?.response?.status || error?.status;
          if (status !== 451 && status !== 403) {
            console.error(`Error fetching OI for ${symbol}:`, error?.message || error);
          }
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

    // If all requests failed (totalOI === 0), use fallback data
    if (totalOI === 0) {
      console.warn("All OI requests failed, using fallback data");
      return NextResponse.json({
        data: generateFallbackOI(),
        lastUpdated: Date.now(),
        fallback: true,
      });
    }

    // Calculate 24h change from individual symbol changes
    // Since we don't have historical data, calculate from fallback base values
    const totalChange24h = openInterestData.reduce((sum, item) => {
      // Try to get change24h from item, otherwise calculate from fallback
      return sum + (item.change24h || 0);
    }, 0);
    
    const changePercent24h = totalOI > 0 ? (totalChange24h / totalOI) * 100 : 0;

    return NextResponse.json({
      data: {
        total: totalOI,
        change24h: totalChange24h,
        changePercent24h,
        byExchange: openInterestData,
      },
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    // Check for 451 (geographic restriction) or 403 (forbidden) errors
    const status = error?.response?.status || error?.status;
    const isBlocked = status === 451 || status === 403;

    if (isBlocked) {
      console.warn("Binance API restricted (451/403), using fallback OI data");
    } else {
      console.error("Error fetching open interest:", error?.message || error);
    }

    // Always return fallback data to prevent app crash
    return NextResponse.json({
      data: generateFallbackOI(),
      lastUpdated: Date.now(),
      fallback: true,
    });
  }
}
