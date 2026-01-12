"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatNumber, formatPercentage, getChangeColor } from "@/lib/utils";
import { Activity, DollarSign, TrendingUp, TrendingDown, PieChart, AlertCircle, BarChart3, Gauge } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

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
    change24h?: number;
    changePercent24h?: number;
  };
  fearGreed: {
    value: number;
    classification: string;
    change24h?: number;
    changePercent24h?: number;
  };
  longShortRatio: {
    averageRatio: number;
    byExchange: Array<{
      exchange: string;
      ratio: number;
      longAccount: number;
      shortAccount: number;
    }>;
  };
  etf: {
    cumulativeInflow: number;
    dailyAverage: number;
    totalNav: number;
    dailyNetFlow?: number;
    dailyNetFlowChange?: number;
  };
  rsi: {
    averageRSI: number;
  };
  altcoinSeason: {
    index: number;
    label: string;
  };
  fundingRate: {
    average8h: number;
    byExchange: Array<{
      exchange: string;
      symbol: string;
      marginType: string;
      rate: number;
    }>;
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

      const [oiRes, liqRes, fgRes, lsRes, etfRes, rsiRes, altRes, frRes] = await Promise.all([
        axios.get("/api/open-interest"),
        axios.get("/api/liquidations"),
        axios.get("/api/fear-greed"),
        axios.get("/api/long-short"),
        axios.get("/api/etf"),
        axios.get("/api/rsi"),
        axios.get("/api/altcoin-season"),
        axios.get("/api/funding-rate"),
      ]);

      // Use actual data from API responses, no random calculations
      setData({
        openInterest: {
          value: oiRes.data.data.total,
          change24h: oiRes.data.data.change24h || 0,
          changePercent24h: oiRes.data.data.changePercent24h || 0,
        },
        liquidations: {
          ...liqRes.data.data,
          change24h: liqRes.data.data.change24h || 0,
          changePercent24h: liqRes.data.data.changePercent24h || 0,
        },
        fearGreed: {
          ...fgRes.data.data,
          change24h: fgRes.data.data.change24h || 0,
          changePercent24h: fgRes.data.data.changePercent24h || 0,
        },
        longShortRatio: lsRes.data.data,
        etf: {
          ...etfRes.data.data,
          dailyNetFlow: etfRes.data.data.dailyNetFlow || etfRes.data.data.dailyAverage || 0,
          dailyNetFlowChange: etfRes.data.data.dailyNetFlowChange || 0,
        },
        rsi: rsiRes.data.data,
        altcoinSeason: altRes.data.data,
        fundingRate: frRes.data.data,
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
            className="h-56 rounded-xl border border-[#FFFF02]/10 bg-[#0a0a0a] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-400">
        <AlertCircle className="mr-2 h-5 w-5" />
        {error || "Failed to load data"}
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {/* Row 1: Open Interest */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Open Interest</CardTitle>
            <Activity className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-bold text-white">
            {formatCompactCurrency(data.openInterest.value)}
          </div>
          <div className="flex items-center gap-2">
            {data.openInterest.changePercent24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              "text-sm font-semibold",
              data.openInterest.changePercent24h >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {formatPercentage(data.openInterest.changePercent24h)}
            </span>
            <span className="text-xs text-gray-500">
              ({formatCompactCurrency(data.openInterest.change24h)})
            </span>
          </div>
          <div className="text-xs text-gray-500 font-medium">24H Change</div>
        </CardContent>
      </Card>

      {/* Row 1: Liquidation Stats */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Liquidation Stats</CardTitle>
            <DollarSign className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-bold text-white">
            {formatCompactCurrency(data.liquidations.total)}
          </div>
          <div className="flex items-center gap-2">
            {data.liquidations.changePercent24h && data.liquidations.changePercent24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              "text-sm font-semibold",
              data.liquidations.changePercent24h && data.liquidations.changePercent24h >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {data.liquidations.changePercent24h ? formatPercentage(data.liquidations.changePercent24h) : "0%"}
            </span>
          </div>
          <div className="flex gap-4 pt-2 border-t border-gray-800">
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">LONG</div>
              <div className="text-base font-semibold text-green-500">
                {formatCompactCurrency(data.liquidations.long)}
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1">SHORT</div>
              <div className="text-base font-semibold text-red-500">
                {formatCompactCurrency(data.liquidations.short)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 1: RSI Average Line */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">RSI Average Line</CardTitle>
            <BarChart3 className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-bold text-white">
            {data.rsi.averageRSI.toFixed(2)}
          </div>
          <div className="relative h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
            <div className="absolute left-0 top-0 h-full w-[30%] bg-red-500/30"></div>
            <div className="absolute left-[30%] top-0 h-full w-[40%] bg-yellow-500/30"></div>
            <div className="absolute left-[70%] top-0 h-full w-[30%] bg-green-500/30"></div>
            <div
              className="absolute top-0 h-full bg-blue-500 transition-all duration-500 rounded-full"
              style={{ width: `${data.rsi.averageRSI}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>0</span>
            <span>30</span>
            <span>70</span>
            <span>100</span>
          </div>
          {data.rsi.averageRSI <= 30 && (
            <div className="text-xs text-green-500 font-medium pt-1">超卖 (Oversold)</div>
          )}
        </CardContent>
      </Card>

      {/* Row 1: Altcoin Season */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Altcoin Season</CardTitle>
            <PieChart className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-3xl font-bold text-white">
            {data.altcoinSeason.index.toFixed(0)}
          </div>
          <div className="relative h-4 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-full overflow-hidden border border-gray-800">
            <div
              className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500 z-10"
              style={{ left: `${data.altcoinSeason.index}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 font-medium">
            <span>Bitcoin Season</span>
            <span>Altcoin Season</span>
          </div>
          <div className="text-xs text-gray-400 pt-1">{data.altcoinSeason.label}</div>
        </CardContent>
      </Card>

      {/* Row 2: Fear & Greed Index */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Fear & Greed Index</CardTitle>
            <Gauge className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-white">
            {data.fearGreed.value}
          </div>
          <div className="flex items-center gap-2">
            {data.fearGreed.changePercent24h && data.fearGreed.changePercent24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={cn(
              "text-sm font-semibold",
              data.fearGreed.changePercent24h && data.fearGreed.changePercent24h >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {data.fearGreed.changePercent24h ? formatPercentage(data.fearGreed.changePercent24h) : "0%"}
            </span>
          </div>
          {/* Semi-circular Gauge */}
          <div className="relative w-full h-20">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-gray-900"
              />
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="url(#gauge-gradient)"
                strokeWidth="10"
                strokeDasharray={`${(data.fearGreed.value / 100) * 251.2} 251.2`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400 font-medium">
              {data.fearGreed.classification}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Long/Short Ratio */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Long/Short Ratio</CardTitle>
            <PieChart className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-3xl font-bold text-white">
            {data.longShortRatio.averageRatio.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 font-medium">3 Exchange Average L/S Ratio</div>
          
          {/* Long/Short Distribution Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-500 font-semibold">Long {((data.longShortRatio.averageRatio / (1 + data.longShortRatio.averageRatio)) * 100).toFixed(1)}%</span>
              <span className="text-gray-400">Short {((1 / (1 + data.longShortRatio.averageRatio)) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className="bg-green-500 h-full transition-all duration-300"
                style={{ width: `${(data.longShortRatio.averageRatio / (1 + data.longShortRatio.averageRatio)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Exchange Data */}
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <div className="text-xs text-gray-500 font-semibold uppercase">Exchange Data</div>
            {data.longShortRatio.byExchange.slice(0, 3).map((exchange) => (
              <div key={exchange.exchange} className="flex justify-between text-xs">
                <span className="text-gray-400">{exchange.exchange}:</span>
                <span>
                  <span className="text-green-500 font-medium">{exchange.longAccount.toFixed(1)}%</span>
                  <span className="text-gray-600 mx-1">/</span>
                  <span className="text-red-500 font-medium">{exchange.shortAccount.toFixed(1)}%</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 2: US BTC-ETF Data Overview */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">US BTC-ETF Data</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-500 mb-1">Cumulative Total Net Inflow</div>
              <div className="text-lg font-bold text-green-500">
                {formatCompactCurrency(data.etf.cumulativeInflow)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Average Daily Net Inflow</div>
              <div className="text-lg font-bold text-green-500">
                {formatCompactCurrency(data.etf.dailyAverage)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Net Asset Value</div>
              <div className="text-lg font-bold text-white">
                {formatCompactCurrency(data.etf.totalNav)}
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-800">
            <div className="text-xs text-gray-500 mb-1">Daily Total Net Inflow</div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-green-500">
                {data.etf.dailyNetFlow ? formatCompactCurrency(data.etf.dailyNetFlow) : formatCompactCurrency(data.etf.dailyAverage)}
              </span>
              {data.etf.dailyNetFlowChange && (
                <span className={cn(
                  "text-xs font-semibold",
                  data.etf.dailyNetFlowChange >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  vs. Previous {formatPercentage(data.etf.dailyNetFlowChange)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Funding Rate */}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 hover:border-[#FFFF02]/40 transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Funding Rate</CardTitle>
            <Activity className="h-4 w-4 text-[#FFFF02]/60" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">8H Average</div>
            <div className="text-2xl font-bold text-green-500">
              {formatPercentage(data.fundingRate.average8h * 100)}
            </div>
          </div>
          <div className="space-y-2.5 pt-2 border-t border-gray-800">
            {data.fundingRate.byExchange.map((exchange) => (
              <div key={`${exchange.exchange}-${exchange.symbol}-${exchange.marginType}`}>
                <div className="text-xs text-gray-500 mb-0.5">
                  {exchange.exchange} BTC/{exchange.symbol.includes("USD") ? "USD" : "USDT"} {exchange.marginType}
                </div>
                <div className="text-sm font-semibold text-green-500">
                  {formatPercentage(exchange.rate * 100)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
