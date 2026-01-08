"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleLineChart } from "@/components/SimpleLineChart";
import { formatCompactCurrency } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function ETFPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/etf");
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching ETF data:", error);
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
            <h1 className="text-3xl font-bold">US Bitcoin ETF Data</h1>
            <p className="text-muted-foreground mt-1">
              Track inflows and outflows from US Bitcoin ETFs
            </p>
          </div>
        </div>

        {data && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Cumulative Inflow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(data.cumulativeInflow)}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-positive mt-1">
                    <TrendingUp className="h-3 w-3" />
                    Total since inception
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Daily Average
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(data.dailyAverage)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    30-day average net flow
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Total NAV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCompactCurrency(data.totalNav)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total net asset value
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cumulative Flow Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart
                  data={data.historicalData.map((item: any) => ({
                    timestamp: new Date(item.date).getTime(),
                    value: item.cumulativeInflow,
                  }))}
                  color="#10b981"
                  type="area"
                  height={350}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Daily Flows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-sm text-muted-foreground">
                        <th className="text-left p-3 font-medium">Date</th>
                        <th className="text-right p-3 font-medium">Inflow</th>
                        <th className="text-right p-3 font-medium">Outflow</th>
                        <th className="text-right p-3 font-medium">Net Flow</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.historicalData
                        .slice(-10)
                        .reverse()
                        .map((item: any, index: number) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-3">{item.date}</td>
                            <td className="text-right p-3 text-positive">
                              {formatCompactCurrency(item.inflow)}
                            </td>
                            <td className="text-right p-3 text-negative">
                              {formatCompactCurrency(item.outflow)}
                            </td>
                            <td
                              className={`text-right p-3 font-medium ${
                                item.netFlow >= 0 ? "text-positive" : "text-negative"
                              }`}
                            >
                              {item.netFlow >= 0 ? "+" : ""}
                              {formatCompactCurrency(item.netFlow)}
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
