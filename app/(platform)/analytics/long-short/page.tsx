"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLineChart } from "@/components/SimpleLineChart";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function LongShortPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/long-short");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching long/short data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
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
            <h1 className="text-3xl font-bold">Long/Short Ratio Analysis</h1>
            <p className="text-muted-foreground mt-1">
              Track trader positioning across major exchanges
            </p>
          </div>
        </div>

        {data && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Average Long/Short Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-2">
                  {data.averageRatio.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.averageRatio > 1
                    ? "More traders are long"
                    : "More traders are short"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ratio by Exchange</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {data.byExchange.map((exchange: any) => (
                    <div
                      key={exchange.exchange}
                      className="p-4 border rounded-lg"
                    >
                      <div className="font-semibold mb-2">{exchange.exchange}</div>
                      <div className="text-2xl font-bold">
                        {exchange.ratio.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Long: {(exchange.longAccount * 100).toFixed(1)}% | Short:{" "}
                        {(exchange.shortAccount * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Ratio Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart
                  data={data.historicalData.map((item: any) => ({
                    timestamp: item.timestamp,
                    value: item.ratio,
                  }))}
                  color="#3b82f6"
                  type="area"
                  height={350}
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
