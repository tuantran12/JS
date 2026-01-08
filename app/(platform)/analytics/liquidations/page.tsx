"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatPercentage } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function LiquidationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/liquidations");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching liquidations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
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
            <h1 className="text-3xl font-bold">Liquidation Analysis</h1>
            <p className="text-muted-foreground mt-1">
              24-hour liquidation data across all exchanges
            </p>
          </div>
        </div>

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total Liquidations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(data.total)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Last 24 hours
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Long Liquidations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-positive">
                    {formatCompactCurrency(data.long)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {data.longPercent.toFixed(2)}% of total
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Short Liquidations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-negative">
                    {formatCompactCurrency(data.short)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {data.shortPercent.toFixed(2)}% of total
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Long vs Short Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Longs</span>
                      <span className="text-sm text-muted-foreground">
                        {data.longPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-positive"
                        style={{ width: `${data.longPercent}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Shorts</span>
                      <span className="text-sm text-muted-foreground">
                        {data.shortPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-negative"
                        style={{ width: `${data.shortPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Understanding Liquidations</h3>
                <p className="text-sm text-muted-foreground">
                  Liquidations occur when a trader&apos;s position is forcibly closed due to
                  insufficient margin. High liquidation volumes often indicate increased
                  market volatility and can signal potential trend reversals. When long
                  liquidations dominate, it suggests a downward price movement, while
                  high short liquidations indicate upward price pressure.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
