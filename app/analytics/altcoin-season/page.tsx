"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function AltcoinSeasonPage() {
  // Altcoin season index: 0-100, where 100 = full altcoin season
  // Calculated based on altcoin performance vs Bitcoin
  const [altcoinIndex, setAltcoinIndex] = useState(65);

  useEffect(() => {
    // Simulate changing data
    const interval = setInterval(() => {
      setAltcoinIndex((prev) => {
        const change = (Math.random() - 0.5) * 5;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeasonLabel = (index: number) => {
    if (index >= 75) return "Strong Altcoin Season";
    if (index >= 50) return "Altcoin Season";
    if (index >= 25) return "Bitcoin Season";
    return "Strong Bitcoin Season";
  };

  const getSeasonColor = (index: number) => {
    if (index >= 75) return "text-positive";
    if (index >= 50) return "text-blue-500";
    if (index >= 25) return "text-yellow-500";
    return "text-negative";
  };

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
            <h1 className="text-3xl font-bold">Altcoin Season Index</h1>
            <p className="text-muted-foreground mt-1">
              Track market dominance: Bitcoin vs Altcoins
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className={`text-5xl font-bold ${getSeasonColor(altcoinIndex)}`}>
                {altcoinIndex.toFixed(1)}
              </div>
              <div className="text-xl text-muted-foreground">
                {getSeasonLabel(altcoinIndex)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Season Indicator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative h-8 bg-gradient-to-r from-negative via-yellow-500 to-positive rounded-full overflow-hidden">
                <div
                  className="absolute top-0 h-full w-1 bg-white shadow-lg transition-all duration-500"
                  style={{ left: `${altcoinIndex}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Bitcoin Season</span>
                <span>Neutral</span>
                <span>Altcoin Season</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Bitcoin Dominance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(100 - altcoinIndex).toFixed(1)}%
              </div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-negative transition-all duration-500"
                  style={{ width: `${100 - altcoinIndex}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Altcoin Dominance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{altcoinIndex.toFixed(1)}%</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-positive transition-all duration-500"
                  style={{ width: `${altcoinIndex}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Understanding Altcoin Season</h3>
            <p className="text-sm text-muted-foreground mb-4">
              The Altcoin Season Index measures the performance of the top 50
              altcoins versus Bitcoin over the last 90 days. When 75% or more of
              the top 50 coins perform better than Bitcoin, it&apos;s considered
              &quot;Altcoin Season.&quot;
            </p>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>
                <strong>0-25:</strong> Strong Bitcoin Season - BTC outperforming most
                altcoins
              </li>
              <li>
                <strong>25-50:</strong> Bitcoin Season - BTC performing better than
                altcoins
              </li>
              <li>
                <strong>50-75:</strong> Altcoin Season - Altcoins gaining ground
              </li>
              <li>
                <strong>75-100:</strong> Strong Altcoin Season - Most altcoins
                outperforming BTC
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
