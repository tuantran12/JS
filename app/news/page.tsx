"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock } from "lucide-react";
import { timeAgo } from "@/lib/utils";

// Mock news data (in production, fetch from a crypto news API)
const newsArticles = [
  {
    id: "1",
    title: "Bitcoin Surges Past $50,000 as Institutional Demand Increases",
    description:
      "Major financial institutions continue to show growing interest in cryptocurrency investments, driving Bitcoin's price higher.",
    url: "#",
    publishedAt: Date.now() - 3600000, // 1 hour ago
    source: "CryptoNews",
    category: "Market",
    isVip: false,
  },
  {
    id: "2",
    title: "Ethereum 2.0 Upgrade: What Investors Need to Know",
    description:
      "The latest Ethereum upgrade brings significant improvements to scalability and energy efficiency.",
    url: "#",
    publishedAt: Date.now() - 7200000, // 2 hours ago
    source: "BlockchainDaily",
    category: "Technology",
    isVip: true,
  },
  {
    id: "3",
    title: "SEC Announces New Guidelines for Cryptocurrency Exchanges",
    description:
      "Regulatory clarity increases as the SEC provides updated framework for digital asset platforms.",
    url: "#",
    publishedAt: Date.now() - 10800000, // 3 hours ago
    source: "RegulatoryWatch",
    category: "Regulation",
    isVip: false,
  },
  {
    id: "4",
    title: "DeFi Protocol Reaches $10 Billion in Total Value Locked",
    description:
      "Decentralized finance continues its explosive growth with major protocols hitting new milestones.",
    url: "#",
    publishedAt: Date.now() - 14400000, // 4 hours ago
    source: "DeFiInsider",
    category: "DeFi",
    isVip: false,
  },
  {
    id: "5",
    title: "Central Banks Explore Digital Currency Partnerships",
    description:
      "Multiple central banks collaborate on CBDC research and development initiatives.",
    url: "#",
    publishedAt: Date.now() - 18000000, // 5 hours ago
    source: "FinanceToday",
    category: "CBDC",
    isVip: true,
  },
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Crypto News</h1>
          <p className="text-muted-foreground mt-2">
            Latest news and updates from the cryptocurrency world
          </p>
        </div>

        <div className="grid gap-4">
          {newsArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      {article.isVip && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                          VIP
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                      </a>
                    </CardTitle>
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{article.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium">{article.source}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
