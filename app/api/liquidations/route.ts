import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api";

export async function GET() {
  try {
    // Note: Liquidation data requires specialized APIs or WebSocket connections
    // For demo purposes, we'll simulate realistic data
    // In production, use services like Coinglass API or exchange WebSocket feeds

    const generateLiquidationData = () => {
      // Generate realistic liquidation data with variation
      // Long liquidations are typically higher than short
      const baseLong = 60000000 + Math.random() * 80000000; // $60M - $140M
      const baseShort = 20000000 + Math.random() * 40000000; // $20M - $60M
      const total = baseLong + baseShort;

      return {
        total: total,
        long: baseLong,
        short: baseShort,
        longPercent: (baseLong / total) * 100,
        shortPercent: (baseShort / total) * 100,
      };
    };

    const liquidationData = generateLiquidationData();

    return NextResponse.json({
      data: liquidationData,
      lastUpdated: Date.now(),
    });
  } catch (error) {
    console.error("Error fetching liquidations:", error);
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    );
  }
}
