import { NextResponse } from "next/server";
import { getFearGreedIndex, handleApiError } from "@/lib/api";

// Generate fallback fear & greed data
function generateFallbackFearGreed() {
  const value = Math.floor(30 + Math.random() * 40); // 30-70 range
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

    return NextResponse.json({
      data: {
        value: parseInt(data.value),
        classification: data.value_classification,
        timestamp: parseInt(data.timestamp) * 1000,
      },
      lastUpdated: Date.now(),
    });
  } catch (error: any) {
    console.error("Error fetching fear & greed index:", error);

    // Return fallback data on error
    if (error?.response?.status === 451 || error?.response?.status === 403) {
      console.warn("Fear & Greed API restricted, using fallback data");
    }

    return NextResponse.json({
      data: generateFallbackFearGreed(),
      lastUpdated: Date.now(),
      fallback: true,
    });
  }
}
