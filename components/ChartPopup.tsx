"use client";

import { useState, useEffect } from "react";
import { X, Wifi } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { TradingPair } from "@/lib/types";
import axios from "axios";

interface ChartPopupProps {
  pair: TradingPair;
  onClose: () => void;
}

export function ChartPopup({ pair, onClose }: ChartPopupProps) {
  const [timeframe, setTimeframe] = useState("1h");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch chart data (simplified - in production, use a charting library)
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Simulate chart data - in production, fetch from API
        const mockData = Array.from({ length: 50 }, (_, i) => ({
          time: Date.now() - (50 - i) * 60 * 60 * 1000,
          open: pair.price * (0.95 + Math.random() * 0.1),
          high: pair.price * (0.98 + Math.random() * 0.04),
          low: pair.price * (0.92 + Math.random() * 0.06),
          close: pair.price * (0.95 + Math.random() * 0.1),
          volume: pair.buyVolume + pair.sellVolume,
        }));
        setChartData(mockData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [pair, timeframe]);

  const timeframes = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "6h", "8h", "12h", "1d", "1w"];

  // Calculate moving averages (simplified)
  const ma5 = chartData.length > 0 
    ? chartData.slice(-5).reduce((sum, d) => sum + d.close, 0) / Math.min(5, chartData.length)
    : pair.price;
  const ma10 = chartData.length > 0
    ? chartData.slice(-10).reduce((sum, d) => sum + d.close, 0) / Math.min(10, chartData.length)
    : pair.price;
  const ma20 = chartData.length > 0
    ? chartData.slice(-20).reduce((sum, d) => sum + d.close, 0) / Math.min(20, chartData.length)
    : pair.price;
  const ma60 = chartData.length > 0
    ? chartData.slice(-60).reduce((sum, d) => sum + d.close, 0) / Math.min(60, chartData.length)
    : pair.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border-2 border-[#FFFF02]/30 rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#FFFF02]/20 bg-[#0a0a0a]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">{pair.symbol} K-Line Chart</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{pair.symbol}</span>
              <Wifi className="h-4 w-4 text-green-500" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFFF02]/10 rounded transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Control Panel */}
        <div className="p-4 border-b border-[#FFFF02]/20 bg-[#0a0a0a] space-y-3">
          {/* Moving Averages */}
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Moving Averages:</span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">MA5</span>
              <span className="text-blue-500">MA10</span>
              <span className="text-purple-500">MA20</span>
              <span className="text-red-500">MA60</span>
            </div>
          </div>

          {/* Timeframes */}
          <div className="flex items-center gap-2 flex-wrap">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors
                  ${timeframe === tf
                    ? "bg-[#FFFF02] text-[#121212]"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20"
                  }
                `}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Tools */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="px-3 py-1 rounded text-sm bg-[#FFFF02] text-[#121212] font-medium">
              MA Line
            </button>
            <button className="px-3 py-1 rounded text-sm bg-green-500 text-white font-medium">
              Volume
            </button>
            <button className="px-3 py-1 rounded text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20 font-medium">
              Trendline
            </button>
            <button className="px-3 py-1 rounded text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20 font-medium">
              Horizontal Line
            </button>
            <button className="px-3 py-1 rounded text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20 font-medium">
              Clear Drawings
            </button>
            <button className="px-3 py-1 rounded text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20 font-medium">
              MACD
            </button>
            <button className="px-3 py-1 rounded text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20 font-medium">
              RSI
            </button>
            <button className="px-3 py-1 rounded text-sm bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20 font-medium">
              Bollinger Bands
            </button>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative h-full bg-[#0a0a0a] p-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400">Loading chart...</div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Simplified Chart Visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="text-lg mb-2">Chart Visualization</div>
                  <div className="text-sm">
                    In production, integrate a charting library like TradingView, Lightweight Charts, or Chart.js
                  </div>
                  <div className="mt-4 text-xs text-gray-600">
                    Current Price: {formatCurrency(pair.price, pair.price < 1 ? 4 : 2)}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    MA5: {formatCurrency(ma5, pair.price < 1 ? 4 : 2)} | 
                    MA10: {formatCurrency(ma10, pair.price < 1 ? 4 : 2)} | 
                    MA20: {formatCurrency(ma20, pair.price < 1 ? 4 : 2)} | 
                    MA60: {formatCurrency(ma60, pair.price < 1 ? 4 : 2)}
                  </div>
                </div>
              </div>

              {/* Price Axis (Right) */}
              <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-400 py-4">
                <span>{formatCurrency(pair.price * 1.1, 2)}</span>
                <span>{formatCurrency(pair.price * 1.05, 2)}</span>
                <span className="text-[#FFFF02] font-bold">{formatCurrency(pair.price, pair.price < 1 ? 4 : 2)}</span>
                <span>{formatCurrency(pair.price * 0.95, 2)}</span>
                <span>{formatCurrency(pair.price * 0.9, 2)}</span>
              </div>

              {/* Volume Bars (Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-around px-4">
                {chartData.slice(-20).map((data, i) => (
                  <div
                    key={i}
                    className="flex-1 mx-0.5 bg-green-500/50 rounded-t"
                    style={{ height: `${(data.volume / Math.max(...chartData.map(d => d.volume))) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

