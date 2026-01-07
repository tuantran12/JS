import { Metadata } from "next";
import { MarketOverview } from "@/components/MarketOverview";
import { TradingPairsTable } from "@/components/TradingPairsTable";

export const metadata: Metadata = {
  title: "Analytics - Crypto Analytics Platform",
  description: "Real-time cryptocurrency market analytics and data",
};

export default function AnalyticsPage() {
  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Market Analytics</h1>
            <p className="text-gray-400 mt-2">
              Real-time cryptocurrency market data and insights
            </p>
          </div>

          {/* Market Overview Cards */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Market Overview</h2>
            <MarketOverview />
          </section>

          {/* Trading Pairs Table */}
          <section>
            <TradingPairsTable />
          </section>
        </div>
      </div>
    </div>
  );
}
