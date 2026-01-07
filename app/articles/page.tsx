"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp } from "lucide-react";
import { timeAgo } from "@/lib/utils";

const articles = [
  {
    id: "1",
    title: "Complete Guide to Cryptocurrency Trading in 2024",
    description:
      "Learn the fundamentals of crypto trading, technical analysis, and risk management strategies.",
    publishedAt: Date.now() - 86400000,
    author: "Sarah Chen",
    readTime: "15 min read",
    category: "Education",
    isVip: false,
  },
  {
    id: "2",
    title: "Advanced DeFi Strategies for Yield Optimization",
    description:
      "Deep dive into sophisticated DeFi protocols and strategies to maximize your returns while managing risks.",
    publishedAt: Date.now() - 172800000,
    author: "Michael Roberts",
    readTime: "20 min read",
    category: "DeFi",
    isVip: true,
  },
  {
    id: "3",
    title: "Understanding On-Chain Analytics: A Beginner's Guide",
    description:
      "Learn how to interpret blockchain data and use on-chain metrics to inform your investment decisions.",
    publishedAt: Date.now() - 259200000,
    author: "Alex Kumar",
    readTime: "12 min read",
    category: "Analytics",
    isVip: false,
  },
];

export default function ArticlesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Educational Articles</h1>
          <p className="text-muted-foreground mt-2">
            In-depth guides and analysis from crypto experts
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{article.category}</Badge>
                  {article.isVip && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                      VIP
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg line-clamp-2">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{article.author}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </span>
                    <span>{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
