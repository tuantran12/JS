import { NextResponse } from "next/server";
import { getFearGreedIndex, handleApiError } from "@/lib/api";

// Generate fallback fear & greed data
function generateFallbackFearGreed() {
  const value = Math.floor(30 + Math.random() * 40); // 30-70 range (realistic market range)
  let classification = "Neutral";
  if (value < 25) classification = "Extreme Fear";
  else if (value < 45) classification = "Fear";
  else if (value < 55) classification = "Neutral";
  else if (value < 75) classification = "Greed";
  else classification = "Extreme Greed";

  return {
    value,
    classification,
    timestamp: Date.now(),
  };
}

export async function GET() {
  try {
    const data = await getFearGreedIndex();

    // Calculate 24h change (simplified - in production, compare with previous day)
    // For now, return 0 change as we don't have historical data
    const value = parseInt(data.value);
    return NextResponse.json({
      data: {
        value,
        classification: data.value_classification,
        timestamp: parseInt(data.timestamp) * 1000,
        change24h: 0,
        changePercent24h: 0,
      },
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    // Check for 451 (geographic restriction) or 403 (forbidden) errors
    const status = error?.response?.status || error?.status;
    const isBlocked = status === 451 || status === 403;

    if (isBlocked) {
      console.warn("Fear & Greed API restricted (451/403), using fallback data");
    } else {
      console.error("Error fetching fear & greed index:", error?.message || error);
    }

    // Always return fallback data to prevent app crash
    const fallbackData = generateFallbackFearGreed();
    return NextResponse.json({
      data: {
        ...fallbackData,
        change24h: 0,
        changePercent24h: 0,
      },
      lastUpdated: Date.now(),
      fallback: true,
    });
  }
}
