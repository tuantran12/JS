"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";

interface TokenHolding {
  mint: string;
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  usdValue: number;
  price: number;
  change24h: number;
  logoURI?: string;
}

// Mock data
const mockHoldings: TokenHolding[] = [
  {
    mint: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    balance: 12.5,
    decimals: 9,
    usdValue: 1281.25,
    price: 102.5,
    change24h: 5.2,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  },
  {
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    balance: 5420.50,
    decimals: 6,
    usdValue: 5420.50,
    price: 1.00,
    change24h: 0.01,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
  },
  {
    mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    symbol: "RAY",
    name: "Raydium",
    balance: 850.0,
    decimals: 6,
    usdValue: 2754.00,
    price: 3.24,
    change24h: -2.8,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png"
  },
  {
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    symbol: "BONK",
    name: "Bonk",
    balance: 15000000,
    decimals: 5,
    usdValue: 180.00,
    price: 0.000012,
    change24h: 12.5,
    logoURI: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I"
  },
];

export default function PortfolioPage() {
  const { connected, publicKey } = useWallet();
  const [hideBalances, setHideBalances] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalValue = mockHoldings.reduce((sum, holding) => sum + holding.usdValue, 0);
  const totalChange = 324.50; // Mock 24h change
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center">
          <Wallet className="h-16 w-16 text-[#FFFF02] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to view your portfolio
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <PieChart className="h-8 w-8 text-[#FFFF02]" />
                Portfolio
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="p-2 hover:bg-[#FFFF02]/10 rounded-lg transition-colors"
                title={hideBalances ? "Show balances" : "Hide balances"}
              >
                {hideBalances ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 hover:bg-[#FFFF02]/10 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Total Value Card */}
        <div className="bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-2">Total Portfolio Value</p>
              <h2 className="text-4xl md:text-5xl font-bold font-mono mb-3">
                {hideBalances ? "••••••" : `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </h2>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-semibold ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {hideBalances ? "•••" : `${totalChange >= 0 ? '+' : ''}$${Math.abs(totalChange).toFixed(2)}`}
                </span>
                <span className={`text-sm ${totalChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {hideBalances ? "••%" : `${totalChange >= 0 ? '+' : ''}${totalChangePercent.toFixed(2)}%`} (24h)
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <DollarSign className="h-24 w-24 text-[#FFFF02] opacity-20" />
            </div>
          </div>
        </div>

        {/* Holdings List */}
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#FFFF02]/10">
            <h3 className="text-xl font-bold">Token Holdings</h3>
          </div>

          <div className="divide-y divide-[#FFFF02]/10">
            {mockHoldings.map((holding) => (
              <div
                key={holding.mint}
                className="p-6 hover:bg-[#FFFF02]/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* Token Info */}
                  <div className="flex items-center gap-4 flex-1">
                    {holding.logoURI && (
                      <img
                        src={holding.logoURI}
                        alt={holding.symbol}
                        className="w-12 h-12 rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-lg">{holding.symbol}</h4>
                      <p className="text-sm text-gray-400">{holding.name}</p>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="text-right flex-1">
                    <p className="font-bold text-lg font-mono">
                      {hideBalances ? "•••••" : holding.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                    </p>
                    <p className="text-sm text-gray-400">
                      {hideBalances ? "••••" : `$${holding.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </p>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right flex-1">
                    <p className="font-semibold font-mono">
                      {hideBalances ? "••••" : `$${holding.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`}
                    </p>
                    <div className={`flex items-center justify-end gap-1 text-sm ${holding.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {holding.change24h >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span>
                        {hideBalances ? "••%" : `${holding.change24h >= 0 ? '+' : ''}${holding.change24h.toFixed(2)}%`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-4">
                    <Link
                      href="/swap"
                      className="px-4 py-2 bg-[#FFFF02] text-[#0a0a0a] font-semibold text-sm rounded-lg hover:bg-[#FFFF33] transition-colors"
                    >
                      Trade
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/swap"
            className="p-6 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl hover:border-[#FFFF02] hover:bg-[#FFFF02]/5 transition-all text-center"
          >
            <TrendingUp className="h-8 w-8 text-[#FFFF02] mx-auto mb-3" />
            <h4 className="font-bold mb-1">Trade Tokens</h4>
            <p className="text-sm text-gray-400">Swap tokens instantly</p>
          </Link>

          <Link
            href="/analytics"
            className="p-6 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl hover:border-[#FFFF02] hover:bg-[#FFFF02]/5 transition-all text-center"
          >
            <PieChart className="h-8 w-8 text-[#FFFF02] mx-auto mb-3" />
            <h4 className="font-bold mb-1">Analytics</h4>
            <p className="text-sm text-gray-400">View market insights</p>
          </Link>

          <Link
            href="/copy-trading"
            className="p-6 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl hover:border-[#FFFF02] hover:bg-[#FFFF02]/5 transition-all text-center"
          >
            <TrendingUp className="h-8 w-8 text-[#FFFF02] mx-auto mb-3" />
            <h4 className="font-bold mb-1">Copy Trading</h4>
            <p className="text-sm text-gray-400">Follow top traders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
