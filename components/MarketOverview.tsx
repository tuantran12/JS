"use client";

import { useEffect, useState } from "react";
import { MetricCard } from "./MetricCard";
import { formatCompactCurrency, formatNumber } from "@/lib/utils";
import { Activity, DollarSign, TrendingUp, PieChart, AlertCircle } from "lucide-react";
import axios from "axios";

interface MarketData {
  openInterest: {
    value: number;
    change24h: number;
    changePercent24h: number;
  };
  liquidations: {
    total: number;
    long: number;
    short: number;
    longPercent: number;
    shortPercent: number;
  };
  fearGreed: {
    value: number;
    classification: string;
  };
  longShortRatio: {
    averageRatio: number;
    byExchange: Array<{
      exchange: string;
      ratio: number;
    }>;
  };
  etf: {
    cumulativeInflow: number;
    dailyAverage: number;
    totalNav: number;
  };
}

export function MarketOverview() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [oiRes, liqRes, fgRes, lsRes, etfRes] = await Promise.all([
        axios.get("/api/open-interest"),
        axios.get("/api/liquidations"),
        axios.get("/api/fear-greed"),
        axios.get("/api/long-short"),
        axios.get("/api/etf"),
      ]);

      setData({
        openInterest: {
          value: oiRes.data.data.total,
          change24h: oiRes.data.data.change24h,
          changePercent24h: oiRes.data.data.changePercent24h,
        },
        liquidations: liqRes.data.data,
        fearGreed: fgRes.data.data,
        longShortRatio: lsRes.data.data,
        etf: etfRes.data.data,
      });
    } catch (err) {
      console.error("Error fetching market data:", err);
      setError("Failed to load market data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-lg border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <AlertCircle className="mr-2 h-5 w-5" />
        {error || "Failed to load data"}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Open Interest */}
      <MetricCard
        title="Open Interest"
        value={formatCompactCurrency(data.openInterest.value)}
        change={data.openInterest.changePercent24h}
        changeLabel={formatCompactCurrency(data.openInterest.change24h)}
        tooltip="Total value of all outstanding derivative contracts"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />

      {/* Liquidations */}
      <MetricCard
        title="24h Liquidations"
        value={formatCompactCurrency(data.liquidations.total)}
        tooltip="Total value of liquidated positions in the last 24 hours"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="flex gap-2 text-xs mt-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-positive" />
            <span className="text-muted-foreground">
              Long: {formatCompactCurrency(data.liquidations.long)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-negative" />
            <span className="text-muted-foreground">
              Short: {formatCompactCurrency(data.liquidations.short)}
            </span>
          </div>
        </div>
      </MetricCard>

      {/* Fear & Greed Index */}
      <MetricCard
        title="Fear & Greed Index"
        value={data.fearGreed.value}
        tooltip="Market sentiment indicator from 0 (Extreme Fear) to 100 (Extreme Greed)"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-xs text-muted-foreground mt-1">
          {data.fearGreed.classification}
        </div>
        <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-negative via-yellow-500 to-positive transition-all"
            style={{ width: `${data.fearGreed.value}%` }}
          />
        </div>
      </MetricCard>

      {/* Long/Short Ratio */}
      <MetricCard
        title="Long/Short Ratio"
        value={data.longShortRatio.averageRatio.toFixed(2)}
        tooltip="Average ratio of long to short positions across major exchanges"
        icon={<PieChart className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="flex flex-wrap gap-2 text-xs mt-2">
          {data.longShortRatio.byExchange.slice(0, 3).map((exchange) => (
            <div key={exchange.exchange} className="text-muted-foreground">
              {exchange.exchange}: {exchange.ratio.toFixed(2)}
            </div>
          ))}
        </div>
      </MetricCard>

      {/* US BTC-ETF Cumulative Inflow */}
      <MetricCard
        title="BTC-ETF Cumulative Inflow"
        value={formatCompactCurrency(data.etf.cumulativeInflow)}
        tooltip="Total cumulative inflow into US Bitcoin ETFs"
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />

      {/* US BTC-ETF Daily Average */}
      <MetricCard
        title="BTC-ETF Daily Average"
        value={formatCompactCurrency(data.etf.dailyAverage)}
        tooltip="Average daily net flow into US Bitcoin ETFs"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      />

      {/* US BTC-ETF Total NAV */}
      <MetricCard
        title="BTC-ETF Total NAV"
        value={formatCompactCurrency(data.etf.totalNav)}
        tooltip="Total Net Asset Value of all US Bitcoin ETFs"
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
      />

      {/* RSI Average - Placeholder (should be calculated from API data) */}
      <MetricCard
        title="RSI Average Line"
        value="N/A"
        tooltip="Average Relative Strength Index across major cryptocurrencies"
        icon={<Activity className="h-4 w-4 text-muted-foreground" />}
      >
        <div className="text-xs text-muted-foreground mt-1">
          Scale: 0-100
        </div>
      </MetricCard>
    </div>
  );
}
