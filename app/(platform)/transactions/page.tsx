"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ExternalLink,
  Filter,
  Calendar,
  Download,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { getTransactionHistory } from "@/lib/wallet-utils";

type TransactionType = "swap" | "copy_trade" | "receive" | "send";
type TransactionStatus = "confirmed" | "pending" | "failed";

interface Transaction {
  id: string;
  signature: string;
  fullSignature: string;
  type: TransactionType;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  status: TransactionStatus;
  timestamp: Date;
  fee: number;
}

function parseTransactionType(tx: any): TransactionType {
  // Simple heuristic - defaults to send for now
  // Can be improved with proper transaction parsing
  return "send";
}

export default function TransactionsPage() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchTransactions = useCallback(async () => {
    if (!publicKey || !connected) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      const txHistory = await getTransactionHistory(connection, publicKey, 20);

      const parsedTxs: Transaction[] = txHistory.map((tx, index) => {
        const signature = tx.signature;
        const type = parseTransactionType(tx);
        const timestamp = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
        const status: TransactionStatus = tx.err ? "failed" : "confirmed";

        // Extract fee from transaction
        let fee = 0;
        if (tx.transaction?.meta?.fee) {
          fee = tx.transaction.meta.fee / 1000000000; // Convert lamports to SOL
        }

        return {
          id: index.toString(),
          signature: signature.slice(0, 4) + "..." + signature.slice(-4),
          fullSignature: signature,
          type,
          fromToken: "SOL",
          toToken: "SOL",
          fromAmount: 0, // Would need to parse transaction details
          toAmount: 0,
          status,
          timestamp,
          fee,
        };
      });

      setTransactions(parsedTxs);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [publicKey, connected, connection]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchTransactions();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.type === filter;
    const matchesSearch =
      searchQuery === "" ||
      tx.signature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.fromToken.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.toToken.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "swap":
        return "Swap";
      case "copy_trade":
        return "Copy Trade";
      case "send":
        return "Send";
      case "receive":
        return "Receive";
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    if (type === "send") {
      return <ArrowUpRight className="h-5 w-5 text-red-500" />;
    } else if (type === "receive") {
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    } else {
      return <ArrowUpRight className="h-5 w-5 text-[#FFFF02]" />;
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const exportTransactions = () => {
    const csv = [
      ["Signature", "Type", "From", "To", "Amount From", "Amount To", "Fee", "Status", "Time"],
      ...filteredTransactions.map((tx) => [
        tx.fullSignature,
        getTypeLabel(tx.type),
        tx.fromToken,
        tx.toToken,
        tx.fromAmount,
        tx.toAmount,
        tx.fee,
        tx.status,
        tx.timestamp.toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `senkai-transactions-${Date.now()}.csv`;
    a.click();
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-16 w-16 text-[#FFFF02] mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to view transaction history
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

  if (loading && !isRefreshing) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-16 w-16 text-[#FFFF02] mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Loading Transactions...</h2>
          <p className="text-gray-400">Fetching transaction history</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Transactions</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="inline-block px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors"
          >
            Try Again
          </button>
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
                <Calendar className="h-8 w-8 text-[#FFFF02]" />
                Transaction History
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={exportTransactions}
                className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
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

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by signature or token..."
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-lg text-white placeholder-gray-500 outline-none focus:border-[#FFFF02]"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
            {(["all", "swap", "copy_trade", "send", "receive"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  filter === type
                    ? "bg-[#FFFF02] text-[#0a0a0a]"
                    : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                }`}
              >
                {type === "all" ? "All" : getTypeLabel(type)}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0a0a] border-b border-[#FFFF02]/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Signature</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Fee</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFFF02]/10">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FFFF02]/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        <span className="font-semibold text-sm">{getTypeLabel(tx.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm">
                        {tx.signature}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-400">
                        {tx.fee.toFixed(6)} SOL
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">{formatTime(tx.timestamp)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "confirmed"
                            ? "bg-green-500/20 text-green-500"
                            : tx.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`https://solscan.io/tx/${tx.fullSignature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFFF02] hover:text-[#FFFF33] transition-colors flex items-center gap-1 text-sm"
                      >
                        View
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No transactions found</h3>
              <p className="text-gray-500">
                {transactions.length === 0
                  ? "Your wallet has no recent transactions"
                  : "Try adjusting your filters"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
