"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLineChart } from "@/components/SimpleLineChart";
import { formatCompactCurrency, formatPercentage } from "@/lib/utils";
import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function OpenInterestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/open-interest");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching open interest:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Open Interest Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Track total open interest across major exchanges
            </p>
          </div>
        </div>

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Open Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(data.total)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    24h Change
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(data.change24h)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatPercentage(data.changePercent24h)}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`h-5 w-5 ${
                        data.changePercent24h >= 0
                          ? "text-positive"
                          : "text-negative"
                      }`}
                    />
                    <span className="text-2xl font-bold">
                      {data.changePercent24h >= 0 ? "Bullish" : "Bearish"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Open Interest by Exchange</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-muted-foreground">
                        <th className="text-left p-3 font-medium">Exchange</th>
                        <th className="text-left p-3 font-medium">Symbol</th>
                        <th className="text-right p-3 font-medium">
                          Open Interest
                        </th>
                        <th className="text-right p-3 font-medium">24h Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.byExchange.map((item: any, index: number) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 font-medium">{item.exchange}</td>
                          <td className="p-3">{item.symbol}</td>
                          <td className="text-right p-3 font-mono">
                            {formatCompactCurrency(item.openInterest)}
                          </td>
                          <td className="text-right p-3">
                            {formatPercentage(item.change24h)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
