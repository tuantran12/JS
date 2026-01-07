"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatCurrency,
  formatPercentage,
  formatCompactCurrency,
  getChangeColor,
  timeAgo,
} from "@/lib/utils";
import { RefreshCw, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import type { TradingPair, TimeFrame } from "@/lib/types";
import { useAppStore } from "@/lib/store";
import { ChartPopup } from "./ChartPopup";

export function TradingPairsTable() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedTimeframe, setSelectedTimeframe, isRefreshing, setIsRefreshing } = useAppStore();
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);

  const fetchPairs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsRefreshing(true);

      const response = await axios.get("/api/prices");
      setPairs(response.data.data);
      setLastUpdate(response.data.lastUpdated);
    } catch (err) {
      console.error("Error fetching trading pairs:", err);
      setError("Failed to load trading pairs");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [setIsRefreshing]);

  useEffect(() => {
    fetchPairs();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchPairs, 10000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, fetchPairs]);

  const handleRefresh = () => {
    fetchPairs();
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8 text-muted-foreground">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {selectedPair && (
        <ChartPopup
          pair={selectedPair}
          onClose={() => setSelectedPair(null)}
        />
      )}
      <Card className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border-[#FFFF02]/20 text-white">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white text-xl font-bold mb-1">Trading Pairs</CardTitle>
              <div className="text-xs text-gray-500">
                Last updated: {timeAgo(lastUpdate)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Tabs
                value={selectedTimeframe}
                onValueChange={(value) => setSelectedTimeframe(value as TimeFrame)}
              >
                <TabsList className="bg-[#1a1a1a] border border-[#FFFF02]/20">
                  <TabsTrigger value="1H" className="data-[state=active]:bg-[#FFFF02] data-[state=active]:text-[#121212]">1H</TabsTrigger>
                  <TabsTrigger value="4H" className="data-[state=active]:bg-[#FFFF02] data-[state=active]:text-[#121212]">4H</TabsTrigger>
                  <TabsTrigger value="12H" className="data-[state=active]:bg-[#FFFF02] data-[state=active]:text-[#121212]">12H</TabsTrigger>
                  <TabsTrigger value="24H" className="data-[state=active]:bg-[#FFFF02] data-[state=active]:text-[#121212]">24H</TabsTrigger>
                  <TabsTrigger value="1W" className="data-[state=active]:bg-[#FFFF02] data-[state=active]:text-[#121212]">1W</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-[#1a1a1a] border-[#FFFF02]/20 hover:bg-[#FFFF02]/10 hover:border-[#FFFF02] text-white"
              >
                <RefreshCw
                  className={cn("h-4 w-4", isRefreshing && "animate-spin")}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-[#1a1a1a] animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#FFFF02]/20">
                  <th className="text-left p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Coin</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Change</th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Buy Volume
                  </th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Sell Volume
                  </th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">
                    Net Flow
                  </th>
                  <th className="text-right p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair) => (
                  <tr
                    key={pair.symbol}
                    className="border-b border-gray-800/50 hover:bg-[#1a1a1a]/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-white text-base">{pair.name}</div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {pair.symbol.replace("USDT", "")}
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-4">
                      <div className="font-mono text-white text-base font-semibold">
                        {formatCurrency(pair.price, pair.price < 1 ? 4 : 2)}
                      </div>
                    </td>
                    <td className="text-right p-4">
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={cn(
                            "font-semibold text-base",
                            getChangeColor(pair.priceChangePercent)
                          )}
                        >
                          {formatPercentage(pair.priceChangePercent)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {pair.priceChange >= 0 ? "+" : ""}
                          {formatCurrency(pair.priceChange, pair.price < 1 ? 4 : 2)}
                        </span>
                      </div>
                    </td>
                    <td className="text-right p-4 hidden md:table-cell">
                      <div className="font-semibold text-green-500 text-sm">
                        {formatCompactCurrency(pair.buyVolume)}
                      </div>
                    </td>
                    <td className="text-right p-4 hidden md:table-cell">
                      <div className="font-semibold text-red-500 text-sm">
                        {formatCompactCurrency(pair.sellVolume)}
                      </div>
                    </td>
                    <td className="text-right p-4 hidden lg:table-cell">
                      <span
                        className={cn(
                          "font-semibold text-sm",
                          getChangeColor(pair.netFlow)
                        )}
                      >
                        {pair.netFlow >= 0 ? "+" : ""}
                        {formatCompactCurrency(Math.abs(pair.netFlow))}
                      </span>
                    </td>
                    <td className="text-right p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-[#1a1a1a] border-[#FFFF02]/20 text-white hover:bg-[#FFFF02]/10 hover:border-[#FFFF02] transition-all"
                        onMouseEnter={() => setSelectedPair(pair)}
                        onClick={() => setSelectedPair(pair)}
                      >
                        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                        <span className="hidden sm:inline text-sm">Chart</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  );
}
