"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Bot,
  DollarSign,
  BarChart3,
  Copy,
  Settings,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Dashboard Header */}
      <div className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Dashboard
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Welcome back! Here&apos;s your trading overview
              </p>
            </div>
            <Link
              href="/profile"
              className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Portfolio Value"
            value="$24,567.89"
            change="+12.5%"
            positive
            icon={<DollarSign className="h-6 w-6" />}
          />
          <StatCard
            title="Total Trades"
            value="142"
            change="+8"
            positive
            icon={<Activity className="h-6 w-6" />}
          />
          <StatCard
            title="Following Traders"
            value="5"
            change="+2"
            positive
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="AI Insights Used"
            value="37"
            change="+15"
            positive
            icon={<Bot className="h-6 w-6" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Analytics"
              description="View market insights"
              icon={<BarChart3 className="h-8 w-8" />}
              href="/analytics"
              color="blue"
            />
            <QuickActionCard
              title="Copy Trading"
              description="Follow top traders"
              icon={<Copy className="h-8 w-8" />}
              href="/copy-trading"
              color="green"
            />
            <QuickActionCard
              title="AI Chat"
              description="Get trading advice"
              icon={<Bot className="h-8 w-8" />}
              href="/chat"
              color="purple"
            />
            <QuickActionCard
              title="Profile"
              description="Manage your account"
              icon={<Settings className="h-8 w-8" />}
              href="/profile"
              color="yellow"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Trades */}
          <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#FFFF02]" />
              Recent Trades
            </h3>
            <div className="space-y-3">
              <TradeItem
                token="SOL/USDC"
                type="buy"
                amount="2.5 SOL"
                price="$102.45"
                time="2 hours ago"
              />
              <TradeItem
                token="RAY/USDC"
                type="sell"
                amount="150 RAY"
                price="$3.24"
                time="5 hours ago"
              />
              <TradeItem
                token="BONK/USDC"
                type="buy"
                amount="1M BONK"
                price="$0.000012"
                time="1 day ago"
              />
            </div>
            <Link
              href="/analytics"
              className="block text-center mt-4 text-sm text-[#FFFF02] hover:text-[#FFFF33] transition-colors"
            >
              View All Trades →
            </Link>
          </div>

          {/* Following */}
          <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#FFFF02]" />
              Top Performing Traders
            </h3>
            <div className="space-y-3">
              <TraderItem
                name="SolanaWhale"
                profit="+24.5%"
                trades={45}
              />
              <TraderItem
                name="DeFiMaster"
                profit="+18.2%"
                trades={32}
              />
              <TraderItem
                name="CryptoSage"
                profit="+15.7%"
                trades={28}
              />
            </div>
            <Link
              href="/copy-trading"
              className="block text-center mt-4 text-sm text-[#FFFF02] hover:text-[#FFFF33] transition-colors"
            >
              Discover More Traders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
  positive,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">{title}</span>
        <div className="p-2 bg-[#FFFF02]/10 rounded-lg text-[#FFFF02]">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-3">
        <span className="text-2xl md:text-3xl font-bold font-mono">
          {value}
        </span>
        <span
          className={`text-sm font-semibold ${
            positive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  description,
  icon,
  href,
  color,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: "blue" | "green" | "purple" | "yellow";
}) {
  const colorClasses = {
    blue: "hover:border-blue-500/50 hover:bg-blue-500/10",
    green: "hover:border-green-500/50 hover:bg-green-500/10",
    purple: "hover:border-purple-500/50 hover:bg-purple-500/10",
    yellow: "hover:border-[#FFFF02]/50 hover:bg-[#FFFF02]/10",
  };

  return (
    <Link
      href={href}
      className={`bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 transition-all ${colorClasses[color]}`}
    >
      <div className="text-[#FFFF02] mb-3">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </Link>
  );
}

function TradeItem({
  token,
  type,
  amount,
  price,
  time,
}: {
  token: string;
  type: "buy" | "sell";
  amount: string;
  price: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
      <div className="flex items-center gap-3">
        {type === "buy" ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
        <div>
          <p className="font-semibold text-sm">{token}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-mono">{amount}</p>
        <p className="text-xs text-gray-500">{price}</p>
      </div>
    </div>
  );
}

function TraderItem({
  name,
  profit,
  trades,
}: {
  name: string;
  profit: string;
  trades: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#FFFF02]/20 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5 text-[#FFFF02]" />
        </div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-gray-500">{trades} trades</p>
        </div>
      </div>
      <span className="text-green-500 font-semibold text-sm">{profit}</span>
    </div>
  );
}
