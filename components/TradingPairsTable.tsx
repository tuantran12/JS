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

export function TradingPairsTable() {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedTimeframe, setSelectedTimeframe, isRefreshing, setIsRefreshing } = useAppStore();
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

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
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>Trading Pairs</CardTitle>
          <div className="flex items-center gap-2">
            <Tabs
              value={selectedTimeframe}
              onValueChange={(value) => setSelectedTimeframe(value as TimeFrame)}
            >
              <TabsList>
                <TabsTrigger value="1H">1H</TabsTrigger>
                <TabsTrigger value="4H">4H</TabsTrigger>
                <TabsTrigger value="12H">12H</TabsTrigger>
                <TabsTrigger value="24H">24H</TabsTrigger>
                <TabsTrigger value="1W">1W</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={cn("h-4 w-4", isRefreshing && "animate-spin")}
              />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {timeAgo(lastUpdate)}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm text-muted-foreground">
                  <th className="text-left p-3 font-medium">Coin</th>
                  <th className="text-right p-3 font-medium">Price</th>
                  <th className="text-right p-3 font-medium">Change</th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">
                    Buy Volume
                  </th>
                  <th className="text-right p-3 font-medium hidden md:table-cell">
                    Sell Volume
                  </th>
                  <th className="text-right p-3 font-medium hidden lg:table-cell">
                    Net Flow
                  </th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair) => (
                  <tr
                    key={pair.symbol}
                    className="border-b hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3">
                      <div>
                        <div className="font-medium">{pair.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {pair.symbol.replace("USDT", "")}
                        </div>
                      </div>
                    </td>
                    <td className="text-right p-3 font-mono">
                      {formatCurrency(pair.price, pair.price < 1 ? 4 : 2)}
                    </td>
                    <td className="text-right p-3">
                      <div className="flex flex-col items-end">
                        <span
                          className={cn(
                            "font-medium",
                            getChangeColor(pair.priceChangePercent)
                          )}
                        >
                          {formatPercentage(pair.priceChangePercent)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {pair.priceChange >= 0 ? "+" : ""}
                          {formatCurrency(pair.priceChange, pair.price < 1 ? 4 : 2)}
                        </span>
                      </div>
                    </td>
                    <td className="text-right p-3 hidden md:table-cell">
                      <span className="text-positive">
                        {formatCompactCurrency(pair.buyVolume)}
                      </span>
                    </td>
                    <td className="text-right p-3 hidden md:table-cell">
                      <span className="text-negative">
                        {formatCompactCurrency(pair.sellVolume)}
                      </span>
                    </td>
                    <td className="text-right p-3 hidden lg:table-cell">
                      <span
                        className={cn(
                          "font-medium",
                          getChangeColor(pair.netFlow)
                        )}
                      >
                        {pair.netFlow >= 0 ? "+" : ""}
                        {formatCompactCurrency(Math.abs(pair.netFlow))}
                      </span>
                    </td>
                    <td className="text-right p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Navigate to chart view (to be implemented)
                          console.log(`View chart for ${pair.symbol}`);
                        }}
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Chart</span>
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
  );
}
