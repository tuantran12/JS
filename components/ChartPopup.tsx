"use client";

import { useState, useEffect, useRef } from "react";
import { X, Wifi, WifiOff } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { TradingPair } from "@/lib/types";
import axios from "axios";
import { createChart, ColorType, IChartApi, ISeriesApi } from "lightweight-charts";

interface ChartPopupProps {
  pair: TradingPair;
  onClose: () => void;
}

export function ChartPopup({ pair, onClose }: ChartPopupProps) {
  const [timeframe, setTimeframe] = useState("1h");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>("unknown");
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  const timeframes = ["1m", "3m", "5m", "15m", "30m", "1h", "4h", "6h", "8h", "12h", "1d", "1w"];

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0a0a0a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: "#374151",
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#FFFF02",
          width: 1,
          style: 3,
          labelBackgroundColor: "#FFFF02",
        },
        horzLine: {
          color: "#FFFF02",
          width: 1,
          style: 3,
          labelBackgroundColor: "#FFFF02",
        },
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#10b981",
      downColor: "#ef4444",
      borderUpColor: "#10b981",
      borderDownColor: "#ef4444",
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: "#26a69a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    // Configure volume series price scale margins
    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Fetch chart data
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("/api/klines", {
          params: {
            symbol: pair.symbol,
            interval: timeframe,
            limit: 200,
          },
        });

        const { data, source } = response.data;
        setDataSource(source || "unknown");

        if (!data || data.length === 0) {
          throw new Error("No chart data available");
        }

        // Update candlestick series
        if (candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(data);
        }

        // Update volume series
        if (volumeSeriesRef.current) {
          const volumeData = data.map((d: any) => ({
            time: d.time,
            value: d.volume,
            color: d.close >= d.open ? "#10b98180" : "#ef444480",
          }));
          volumeSeriesRef.current.setData(volumeData);
        }

        // Fit content
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching chart data:", err);
        setError(err?.message || "Failed to load chart data");
        setLoading(false);
      }
    };

    fetchChartData();
  }, [pair.symbol, timeframe]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-6xl h-[90vh] bg-[#0a0a0a] border-2 border-[#FFFF02]/30 rounded-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#FFFF02]/20 bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">{pair.symbol} K-Line Chart</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{pair.name}</span>
              {dataSource === "binance" || dataSource === "coingecko" ? (
                <span title={`Live data from ${dataSource}`}>
                  <Wifi className="h-4 w-4 text-green-500" />
                </span>
              ) : (
                <span title="Simulated data">
                  <WifiOff className="h-4 w-4 text-yellow-500" />
                </span>
              )}
            </div>
            <div className="text-sm">
              <span className="text-gray-400">Price: </span>
              <span className="text-white font-mono font-semibold">
                {formatCurrency(pair.price, pair.price < 1 ? 4 : 2)}
              </span>
            </div>
            <div className="text-sm">
              <span className={pair.priceChangePercent >= 0 ? "text-green-500" : "text-red-500"}>
                {pair.priceChangePercent >= 0 ? "+" : ""}
                {pair.priceChangePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FFFF02]/10 rounded transition-colors"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Timeframes */}
        <div className="p-3 border-b border-[#FFFF02]/20 bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400 mr-2">Timeframe:</span>
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                disabled={loading}
                className={`
                  px-3 py-1 rounded text-sm font-medium transition-colors
                  ${timeframe === tf
                    ? "bg-[#FFFF02] text-[#121212]"
                    : "bg-[#1a1a1a] text-gray-300 hover:bg-[#FFFF02]/20"
                  }
                  ${loading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative flex-1 bg-[#0a0a0a] p-4">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 z-10">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/80 z-10">
              <div className="text-center">
                <div className="text-red-500 text-lg mb-2">Failed to load chart</div>
                <div className="text-gray-500 text-sm">{error}</div>
              </div>
            </div>
          )}
          <div
            ref={chartContainerRef}
            className="w-full h-full"
          />
        </div>

        {/* Footer Info */}
        <div className="p-3 border-t border-[#FFFF02]/20 bg-[#0a0a0a] flex-shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              Source: <span className="text-white">{dataSource}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                24h Volume: <span className="text-white">{formatCurrency(pair.buyVolume + pair.sellVolume, 0)}</span>
              </div>
              <div>
                24h Change: <span className={pair.priceChange >= 0 ? "text-green-500" : "text-red-500"}>
                  {pair.priceChange >= 0 ? "+" : ""}{formatCurrency(pair.priceChange, pair.price < 1 ? 4 : 2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
