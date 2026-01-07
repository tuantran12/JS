import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";

export async function GET() {
  try {
    // Note: ETF data requires specialized data providers or manual tracking
    // For demo purposes, we'll generate realistic sample data
    // In production, use services like Bloomberg API, CoinGlass, or manual data entry

    const generateETFData = () => {
      // Generate last 30 days of ETF flow data
      const days = 30;
      const data = [];
      let cumulativeInflow = 50000000000; // Start at ~$50B (realistic starting point)

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate realistic daily flows with positive bias
        const dailyFlow = (Math.random() - 0.3) * 500000000; // -$150M to +$350M bias positive
        cumulativeInflow += dailyFlow;

        data.push({
          date: date.toISOString().split('T')[0],
          inflow: Math.max(0, dailyFlow),
          outflow: Math.max(0, -dailyFlow),
          netFlow: dailyFlow,
          cumulativeInflow,
        });
      }

      return data;
    };

    const historicalData = generateETFData();
    const latest = historicalData[historicalData.length - 1];

    // Calculate daily average over last 30 days (only positive net flows)
    const positiveFlows = historicalData.filter(item => item.netFlow > 0);
    const totalNetFlow = positiveFlows.reduce((sum, item) => sum + item.netFlow, 0);
    const dailyAverage = positiveFlows.length > 0 ? totalNetFlow / positiveFlows.length : 0;

    // Calculate total NAV (approximate) - typically 2.0-2.8x cumulative inflow
    const totalNav = latest.cumulativeInflow * (2.0 + Math.random() * 0.8);

    return NextResponse.json({
      data: {
        cumulativeInflow: latest.cumulativeInflow,
        dailyAverage,
        totalNav,
        historicalData,
      },
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error("Error fetching ETF data:", error);
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    );
  }
}
