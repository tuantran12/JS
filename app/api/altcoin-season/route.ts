import { NextResponse } from "next/server";
import { getBinanceAllPrices } from "@/lib/api";

// Calculate altcoin season index based on price performance vs Bitcoin
// Returns 0-100, where 100 = full altcoin season
function calculateAltcoinSeasonIndex(prices: any[]): number {
  try {
    const btcData = prices.find((p: any) => p.symbol === "BTCUSDT");
    if (!btcData) return 50; // Default neutral

    const btcChange = parseFloat(btcData.priceChangePercent || "0");
    
    // Get top altcoins (excluding BTC)
    const altcoins = prices
      .filter((p: any) => p.symbol !== "BTCUSDT")
      .slice(0, 50); // Top 50 altcoins

    if (altcoins.length === 0) return 50;

    // Count how many altcoins outperformed BTC
    let outperformingCount = 0;
    altcoins.forEach((altcoin: any) => {
      const altChange = parseFloat(altcoin.priceChangePercent || "0");
      if (altChange > btcChange) {
        outperformingCount++;
      }
    });

    // Calculate index: percentage of altcoins outperforming BTC
    const index = (outperformingCount / altcoins.length) * 100;
    return Math.max(0, Math.min(100, index));
  } catch (error) {
    console.error("Error calculating altcoin season index:", error);
    return 50; // Default neutral
  }
}

// Generate fallback altcoin season data
function generateFallbackAltcoinSeason() {
  const index = 30 + Math.random() * 40; // 30-70 range
  return {
    index: Math.round(index * 100) / 100,
    label: index >= 75 ? "Strong Altcoin Season" : 
           index >= 50 ? "Altcoin Season" : 
           index >= 25 ? "Bitcoin Season" : 
           "Strong Bitcoin Season",
  };
}

export async function GET() {
  try {
    const allPrices = await getBinanceAllPrices();
    const index = calculateAltcoinSeasonIndex(allPrices);
    
    const label = index >= 75 ? "Strong Altcoin Season" : 
                  index >= 50 ? "Altcoin Season" : 
                  index >= 25 ? "Bitcoin Season" : 
                  "Strong Bitcoin Season";

    return NextResponse.json({
      data: {
        index: Math.round(index * 100) / 100,
        label,
      },
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    const status = error?.response?.status || error?.status;
    const isBlocked = status === 451 || status === 403;

    if (isBlocked) {
      console.warn("Binance API restricted (451/403), using fallback altcoin season data");
    } else {
      console.error("Error fetching altcoin season:", error?.message || error);
    }

    return NextResponse.json({
      data: generateFallbackAltcoinSeason(),
      lastUpdated: Date.now(),
      fallback: true,
    });
  }
}

