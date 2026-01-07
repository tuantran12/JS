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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-10 lg:space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Market Analytics
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Real-time cryptocurrency market data and insights
            </p>
          </div>

          {/* Market Overview Cards */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-[#FFFF02] rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Market Overview</h2>
            </div>
            <MarketOverview />
          </section>

          {/* Trading Pairs Table */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-[#FFFF02] rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Trading Pairs</h2>
            </div>
            <TradingPairsTable />
          </section>
        </div>
      </div>
    </div>
  );
}
