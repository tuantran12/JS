import { Metadata } from "next";
import { MarketOverview } from "@/components/MarketOverview";
import { TradingPairsTable } from "@/components/TradingPairsTable";

export const metadata: Metadata = {
  title: "Analytics - Crypto Analytics Platform",
  description: "Real-time cryptocurrency market analytics and data",
};

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Real-time cryptocurrency market data and insights
          </p>
        </div>

        {/* Market Overview Cards */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
          <MarketOverview />
        </section>

        {/* Trading Pairs Table */}
        <section>
          <TradingPairsTable />
        </section>
      </div>
    </div>
  );
}
