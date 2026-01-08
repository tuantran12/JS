"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

const features = [
  "Real-time alerts for major market movements",
  "Exclusive trading signals and analysis",
  "Advanced charting tools and indicators",
  "Priority access to new features",
  "Ad-free experience",
  "Dedicated support channel",
  "Private community access",
  "Weekly market reports",
];

export default function VIPPage() {
  return (
    <div className="bg-[#000000] text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] rounded-full mb-4">
              <Crown className="h-8 w-8 text-[#121212]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">VIP Membership</h1>
            <p className="text-gray-400 text-lg">
              Unlock premium features and insights
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
              <CardHeader>
                <CardTitle className="text-center text-white">Monthly</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2 text-white">$29</div>
                <div className="text-gray-400 mb-4">per month</div>
                <Button className="w-full bg-[#FFFF02] text-[#121212] hover:bg-[#FFFF33]">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#FFFF02] relative bg-[#0a0a0a] text-white">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#FFFF02] text-[#121212]">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-center text-white">Yearly</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2 text-white">$249</div>
                <div className="text-gray-400 mb-1">per year</div>
                <div className="text-sm text-[#FFFF02] mb-4">Save $99/year</div>
                <Button className="w-full bg-[#FFFF02] text-[#121212] hover:bg-[#FFFF33]">Get Started</Button>
              </CardContent>
            </Card>

            <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
              <CardHeader>
                <CardTitle className="text-center text-white">Lifetime</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold mb-2 text-white">$999</div>
                <div className="text-gray-400 mb-4">one-time</div>
                <Button className="w-full border-2 border-[#FFFF02] text-[#FFFF02] hover:bg-[#FFFF02] hover:text-[#121212]">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#0a0a0a] border-[#FFFF02]/20 text-white">
            <CardHeader>
              <CardTitle className="text-white">VIP Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 md:grid-cols-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${className}`}>
      {children}
    </span>
  );
}
