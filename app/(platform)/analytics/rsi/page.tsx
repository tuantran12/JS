"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const COINS = [
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "BNB", name: "BNB" },
  { symbol: "XRP", name: "XRP" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "ADA", name: "Cardano" },
  { symbol: "DOGE", name: "Dogecoin" },
  { symbol: "AVAX", name: "Avalanche" },
  { symbol: "DOT", name: "Polkadot" },
  { symbol: "MATIC", name: "Polygon" },
  { symbol: "LINK", name: "Chainlink" },
  { symbol: "UNI", name: "Uniswap" },
  { symbol: "ATOM", name: "Cosmos" },
  { symbol: "LTC", name: "Litecoin" },
  { symbol: "NEAR", name: "NEAR Protocol" },
];

const TIMEFRAMES = ["15m", "1h", "4h", "1d", "1w"];

// Simulate RSI data (in production, calculate from price data)
const generateRSI = () => Math.floor(Math.random() * 100);

const getRSIColor = (rsi: number) => {
  if (rsi >= 70) return "text-negative"; // Overbought
  if (rsi <= 30) return "text-positive"; // Oversold
  return "text-muted-foreground"; // Neutral
};

const getRSILabel = (rsi: number) => {
  if (rsi >= 70) return "Overbought";
  if (rsi <= 30) return "Oversold";
  return "Neutral";
};

export default function RSIPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("4h");

  const rsiData = COINS.map((coin) => ({
    ...coin,
    rsi: generateRSI(),
  }));

  const averageRSI =
    rsiData.reduce((sum, item) => sum + item.rsi, 0) / rsiData.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/analytics">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">RSI Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Relative Strength Index across major cryptocurrencies
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Card className="flex-1 mr-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Average RSI Line
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageRSI.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {getRSILabel(averageRSI)}
              </div>
            </CardContent>
          </Card>

          <Tabs
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <TabsList>
              {TIMEFRAMES.map((tf) => (
                <TabsTrigger key={tf} value={tf}>
                  {tf}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>RSI by Cryptocurrency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="text-left p-3 font-medium">Coin</th>
                    <th className="text-right p-3 font-medium">RSI Value</th>
                    <th className="text-right p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Indicator</th>
                  </tr>
                </thead>
                <tbody>
                  {rsiData.map((coin) => (
                    <tr key={coin.symbol} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {coin.symbol}
                          </div>
                        </div>
                      </td>
                      <td className="text-right p-3">
                        <span className={`text-lg font-bold ${getRSIColor(coin.rsi)}`}>
                          {coin.rsi.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <span className={getRSIColor(coin.rsi)}>
                          {getRSILabel(coin.rsi)}
                        </span>
                      </td>
                      <td className="text-right p-3">
                        <div className="flex items-center justify-end">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                coin.rsi >= 70
                                  ? "bg-negative"
                                  : coin.rsi <= 30
                                  ? "bg-positive"
                                  : "bg-blue-500"
                              }`}
                              style={{ width: `${coin.rsi}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Understanding RSI</h3>
            <p className="text-sm text-muted-foreground">
              The Relative Strength Index (RSI) is a momentum oscillator that measures
              the speed and magnitude of price changes. Values above 70 indicate
              overbought conditions (potential sell signal), while values below 30
              indicate oversold conditions (potential buy signal). RSI is typically
              calculated over a 14-period timeframe.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
