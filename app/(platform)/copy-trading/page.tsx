"use client";

import { useState } from "react";
import {
  Users,
  TrendingUp,
  Copy,
  Star,
  DollarSign,
  Activity,
  CheckCircle2,
  Settings,
  Info,
} from "lucide-react";
import Link from "next/link";

interface Trader {
  id: string;
  username: string;
  address: string;
  followers: number;
  totalProfit: number;
  winRate: number;
  avgReturn: number;
  totalTrades: number;
  rating: number;
  isFollowing: boolean;
}

const mockTraders: Trader[] = [
  {
    id: "1",
    username: "SolanaWhale",
    address: "7xKXt...9dKp",
    followers: 2847,
    totalProfit: 234567.89,
    winRate: 73.5,
    avgReturn: 12.4,
    totalTrades: 458,
    rating: 4.8,
    isFollowing: false,
  },
  {
    id: "2",
    username: "DeFiMaster",
    address: "8yNXw...2hLm",
    followers: 1923,
    totalProfit: 187432.12,
    winRate: 68.2,
    avgReturn: 9.8,
    totalTrades: 312,
    rating: 4.6,
    isFollowing: true,
  },
  {
    id: "3",
    username: "CryptoSage",
    address: "3kLMn...4jQr",
    followers: 1654,
    totalProfit: 156789.45,
    winRate: 71.8,
    avgReturn: 11.2,
    totalTrades: 389,
    rating: 4.7,
    isFollowing: false,
  },
  {
    id: "4",
    username: "TokenHunter",
    address: "5pRTy...7xKl",
    followers: 1432,
    totalProfit: 142356.78,
    winRate: 65.4,
    avgReturn: 8.6,
    totalTrades: 267,
    rating: 4.5,
    isFollowing: false,
  },
  {
    id: "5",
    username: "SolTrader",
    address: "9qWEx...3mNb",
    followers: 1289,
    totalProfit: 128945.23,
    winRate: 69.7,
    avgReturn: 10.3,
    totalTrades: 298,
    rating: 4.6,
    isFollowing: true,
  },
];

export default function CopyTradingPage() {
  const [traders, setTraders] = useState<Trader[]>(mockTraders);
  const [sortBy, setSortBy] = useState<"profit" | "winRate" | "followers">("profit");

  const handleFollowToggle = (traderId: string) => {
    setTraders((prev) =>
      prev.map((trader) =>
        trader.id === traderId
          ? { ...trader, isFollowing: !trader.isFollowing }
          : trader
      )
    );
  };

  const sortedTraders = [...traders].sort((a, b) => {
    if (sortBy === "profit") return b.totalProfit - a.totalProfit;
    if (sortBy === "winRate") return b.winRate - a.winRate;
    return b.followers - a.followers;
  });

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <header className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFFF02]/10 rounded-lg">
                <Copy className="h-6 w-6 md:h-8 md:w-8 text-[#FFFF02]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Copy <span className="text-[#FFFF02]">Trading</span>
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Follow top traders and automate your success
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-[#FFFF02] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-7xl">
        {/* Info Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-[#FFFF02] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-white mb-2">
                What is Copy Trading?
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Copy trading allows you to automatically replicate the trades of
                experienced traders. When a trader you follow makes a trade, our
                smart contracts execute the same trade in your wallet with your
                chosen position size and risk parameters. All trades are
                non-custodial - you maintain full control of your funds.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users className="h-6 w-6" />}
            title="Following"
            value={traders.filter((t) => t.isFollowing).length.toString()}
            subtitle="Active traders"
          />
          <StatCard
            icon={<Activity className="h-6 w-6" />}
            title="Copied Trades"
            value="47"
            subtitle="This month"
          />
          <StatCard
            icon={<DollarSign className="h-6 w-6" />}
            title="Profit"
            value="+$12,456"
            subtitle="Total earnings"
            positive
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Top Traders</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 hidden md:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-[#FFFF02]"
            >
              <option value="profit">Total Profit</option>
              <option value="winRate">Win Rate</option>
              <option value="followers">Followers</option>
            </select>
          </div>
        </div>

        {/* Traders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedTraders.map((trader) => (
            <TraderCard
              key={trader.id}
              trader={trader}
              onFollowToggle={handleFollowToggle}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-8 text-center">
          <Settings className="h-12 w-12 text-[#FFFF02] mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">
            Want to Become a Signal Provider?
          </h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Earn fees when other traders copy your strategies. Build your
            reputation and monetize your trading expertise on SENKAI.
          </p>
          <Link
            href="/profile"
            className="inline-block px-8 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  positive,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  positive?: boolean;
}) {
  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[#FFFF02]/10 rounded-lg text-[#FFFF02]">
          {icon}
        </div>
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p
        className={`text-2xl md:text-3xl font-bold font-mono ${
          positive ? "text-green-500" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

function TraderCard({
  trader,
  onFollowToggle,
}: {
  trader: Trader;
  onFollowToggle: (id: string) => void;
}) {
  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 hover:border-[#FFFF02]/50 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFFF02]/20 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-[#FFFF02]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{trader.username}</h3>
            <p className="text-sm text-gray-400 font-mono">{trader.address}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-[#FFFF02] fill-[#FFFF02]" />
          <span className="text-sm font-semibold text-white">
            {trader.rating}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Profit</p>
          <p className="text-lg font-bold text-green-500 font-mono">
            ${trader.totalProfit.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Win Rate</p>
          <p className="text-lg font-bold text-white font-mono">
            {trader.winRate}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Avg Return</p>
          <p className="text-lg font-bold text-[#FFFF02] font-mono">
            +{trader.avgReturn}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Trades</p>
          <p className="text-lg font-bold text-white font-mono">
            {trader.totalTrades}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#FFFF02]/10">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Users className="h-4 w-4" />
          <span>{trader.followers.toLocaleString()} followers</span>
        </div>
        <button
          onClick={() => onFollowToggle(trader.id)}
          className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            trader.isFollowing
              ? "bg-[#FFFF02]/20 text-[#FFFF02] border border-[#FFFF02]/50 hover:bg-[#FFFF02]/30"
              : "bg-[#FFFF02] text-[#0a0a0a] hover:bg-[#FFFF33]"
          }`}
        >
          {trader.isFollowing ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Following
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Follow
            </>
          )}
        </button>
      </div>
    </div>
  );
}
