import { NextResponse } from "next/server";
import { getFearGreedIndex, handleApiError } from "@/lib/api";

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
  } catch (error) {
    console.error("Error fetching fear & greed index:", error);
    return NextResponse.json(
      { error: handleApiError(error) },
      { status: 500 }
    );
  }
}
