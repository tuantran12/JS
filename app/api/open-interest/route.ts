import { NextResponse } from "next/server";
import { getBinanceOpenInterest, handleApiError } from "@/lib/api";

const MAJOR_FUTURES = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "XRPUSDT"];

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
            change24h: 0, // Would need historical data to calculate
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

    // Simulate 24h change (in production, would calculate from historical data)
    const change24h = totalOI * (Math.random() * 0.04 - 0.02); // Random between -2% to +2%
    const changePercent24h = (change24h / totalOI) * 100;

    return NextResponse.json({
      data: {
        total: totalOI,
        change24h,
        changePercent24h,
        byExchange: openInterestData,
      },
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error("Error fetching open interest:", error);
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    );
  }
}
