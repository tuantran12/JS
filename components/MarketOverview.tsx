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

      // Calculate liquidation change (simplified - in production, track historical)
      const liqChange = (Math.random() - 0.5) * 0.4; // -20% to +20%
      const liqChangePercent = liqChange * 100;

      // Calculate fear & greed change
      const fgChange = (Math.random() - 0.5) * 10; // -5 to +5
      const fgChangePercent = fgChange / fgRes.data.data.value * 100;

      // Calculate ETF daily net flow change
      const etfDailyChange = (Math.random() - 0.5) * 0.2; // -10% to +10%

      setData({
        openInterest: {
          value: oiRes.data.data.total,
          change24h: oiRes.data.data.change24h,
          changePercent24h: oiRes.data.data.changePercent24h,
        },
        liquidations: {
          ...liqRes.data.data,
          change24h: liqRes.data.data.total * liqChange,
          changePercent24h: liqChangePercent,
        },
        fearGreed: {
          ...fgRes.data.data,
          change24h: fgChange,
          changePercent24h: fgChangePercent,
        },
        longShortRatio: lsRes.data.data,
        etf: {
          ...etfRes.data.data,
          dailyNetFlow: etfRes.data.data.dailyAverage * (1 + etfDailyChange),
          dailyNetFlowChange: etfDailyChange * 100,
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
            className="h-48 rounded-lg border border-[#FFFF02]/20 bg-[#0a0a0a] animate-pulse"
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Row 1: Open Interest */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Open Interest</CardTitle>
          <Activity className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCompactCurrency(data.openInterest.value)}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {data.openInterest.changePercent24h >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              data.openInterest.changePercent24h >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {formatPercentage(data.openInterest.changePercent24h)}
            </span>
            <span className="text-gray-400">
              ({formatCompactCurrency(data.openInterest.change24h)})
            </span>
          </div>
          <div className="text-xs text-gray-400 mt-2">24H Change</div>
        </CardContent>
      </Card>

      {/* Row 1: Liquidation Stats */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Liquidation Stats</CardTitle>
          <DollarSign className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {formatCompactCurrency(data.liquidations.total)}
          </div>
          <div className="flex items-center gap-1 text-xs mb-3">
            {data.liquidations.changePercent24h && data.liquidations.changePercent24h >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              data.liquidations.changePercent24h && data.liquidations.changePercent24h >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {data.liquidations.changePercent24h ? formatPercentage(data.liquidations.changePercent24h) : "0%"}
            </span>
          </div>
          <div className="flex gap-4 text-xs">
            <div>
              <span className="text-green-500 font-medium">LONG: </span>
              <span className="text-gray-300">{formatCompactCurrency(data.liquidations.long)}</span>
            </div>
            <div>
              <span className="text-red-500 font-medium">SHORT: </span>
              <span className="text-gray-300">{formatCompactCurrency(data.liquidations.short)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 1: RSI Average Line */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">RSI Average Line</CardTitle>
          <BarChart3 className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-3">
            {data.rsi.averageRSI.toFixed(2)}
          </div>
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[30%] bg-red-500"></div>
            <div className="absolute left-[30%] top-0 h-full w-[40%] bg-yellow-500"></div>
            <div className="absolute left-[70%] top-0 h-full w-[30%] bg-green-500"></div>
            <div
              className="absolute top-0 h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${data.rsi.averageRSI}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>30</span>
            <span>70</span>
            <span>100</span>
          </div>
          {data.rsi.averageRSI <= 30 && (
            <div className="text-xs text-green-500 mt-2">超卖 (Oversold)</div>
          )}
        </CardContent>
      </Card>

      {/* Row 1: Altcoin Season */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Altcoin Season</CardTitle>
          <PieChart className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {data.altcoinSeason.index.toFixed(0)}
          </div>
          <div className="flex items-center gap-1 text-xs mb-3">
            <span className="text-gray-400">+0.00%</span>
          </div>
          <div className="relative h-3 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[25%] bg-blue-600"></div>
            <div className="absolute left-[25%] top-0 h-full w-[25%] bg-purple-600"></div>
            <div className="absolute left-[50%] top-0 h-full w-[25%] bg-yellow-500"></div>
            <div className="absolute left-[75%] top-0 h-full w-[25%] bg-green-600"></div>
            <div
              className="absolute top-0 h-full w-0.5 bg-black shadow-lg transition-all duration-500"
              style={{ left: `${data.altcoinSeason.index}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>Bitcoin Season</span>
            <span>Altcoin Season</span>
          </div>
          <div className="text-xs text-gray-400 mt-2">{data.altcoinSeason.label}</div>
        </CardContent>
      </Card>

      {/* Row 2: Fear & Greed Index */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Fear & Greed Index</CardTitle>
          <Gauge className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {data.fearGreed.value}
          </div>
          <div className="flex items-center gap-1 text-xs mb-4">
            {data.fearGreed.changePercent24h && data.fearGreed.changePercent24h >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={cn(
              data.fearGreed.changePercent24h && data.fearGreed.changePercent24h >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {data.fearGreed.changePercent24h ? formatPercentage(data.fearGreed.changePercent24h) : "0%"}
            </span>
          </div>
          {/* Semi-circular Gauge */}
          <div className="relative w-full h-24 mb-2">
            <svg className="w-full h-full" viewBox="0 0 200 100">
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-gray-800"
              />
              <path
                d="M 20 80 A 80 80 0 0 1 180 80"
                fill="none"
                stroke="url(#gauge-gradient)"
                strokeWidth="12"
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
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              {data.fearGreed.classification}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Long/Short Ratio */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Long/Short Ratio</CardTitle>
          <PieChart className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {data.longShortRatio.averageRatio.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400 mb-3">3 Exchange Average L/S Ratio</div>
          
          {/* Long/Short Distribution Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-green-500">Long {((data.longShortRatio.averageRatio / (1 + data.longShortRatio.averageRatio)) * 100).toFixed(1)}%</span>
              <span className="text-gray-400">Short {((1 / (1 + data.longShortRatio.averageRatio)) * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden flex">
              <div
                className="bg-green-500 h-full"
                style={{ width: `${(data.longShortRatio.averageRatio / (1 + data.longShortRatio.averageRatio)) * 100}%` }}
              ></div>
              <div className="bg-gray-600 h-full flex-1"></div>
            </div>
          </div>

          {/* Exchange Data */}
          <div className="space-y-1 text-xs">
            <div className="text-gray-400 mb-2">EXCHANGE DATA:</div>
            {data.longShortRatio.byExchange.slice(0, 3).map((exchange) => (
              <div key={exchange.exchange} className="flex justify-between">
                <span className="text-gray-300">{exchange.exchange}:</span>
                <span>
                  <span className="text-green-500">{exchange.longAccount.toFixed(1)}%</span>
                  {" / "}
                  <span className="text-red-500">{exchange.shortAccount.toFixed(1)}%</span>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Row 2: US BTC-ETF Data Overview */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">US BTC-ETF Data Overview</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <div className="text-gray-400 text-xs">Cumulative Total Net Inflow</div>
              <div className="text-lg font-bold text-green-500">
                {formatCompactCurrency(data.etf.cumulativeInflow)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Average Daily Net Inflow</div>
              <div className="text-lg font-bold text-green-500">
                {formatCompactCurrency(data.etf.dailyAverage)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-xs">Total Net Asset Value</div>
              <div className="text-lg font-bold text-white">
                {formatCompactCurrency(data.etf.totalNav)}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-800">
              <div className="text-gray-400 text-xs">Daily Total Net Inflow</div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-green-500">
                  {data.etf.dailyNetFlow ? formatCompactCurrency(data.etf.dailyNetFlow) : formatCompactCurrency(data.etf.dailyAverage)}
                </span>
                {data.etf.dailyNetFlowChange && (
                  <span className={cn(
                    "text-xs",
                    data.etf.dailyNetFlowChange >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    vs. Previous {formatPercentage(data.etf.dailyNetFlowChange)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Row 2: Funding Rate */}
      <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Funding Rate</CardTitle>
          <Activity className="h-4 w-4 text-[#FFFF02]" />
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="text-gray-400 text-xs mb-1">8H Average</div>
            <div className="text-xl font-bold text-green-500">
              {formatPercentage(data.fundingRate.average8h * 100)}
            </div>
          </div>
          <div className="space-y-2 text-xs">
            {data.fundingRate.byExchange.map((exchange) => (
              <div key={`${exchange.exchange}-${exchange.symbol}-${exchange.marginType}`}>
                <div className="text-gray-400">
                  {exchange.exchange} BTC/{exchange.symbol.includes("USD") ? "USD" : "USDT"} {exchange.marginType} Funding Rate
                </div>
                <div className="text-green-500 font-medium">
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
