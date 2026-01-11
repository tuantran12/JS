"use client";

import { useState, useEffect, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js";
import {
  ArrowDownUp,
  Settings,
  Info,
  ChevronDown,
  RefreshCw,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: number;
}

const POPULAR_TOKENS: Token[] = [
  {
    address: "So11111111111111111111111111111111111111112",
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
  },
  {
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
  },
  {
    address: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    symbol: "USDT",
    name: "USDT",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg"
  },
  {
    address: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    symbol: "RAY",
    name: "Raydium",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png"
  },
];

export default function SwapPage() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState(0.5);
  const [isLoading, setIsLoading] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [showSlippageSettings, setShowSlippageSettings] = useState(false);

  // Swap tokens
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Get quote from Jupiter
  const getQuote = useCallback(async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount("");
      setQuote(null);
      return;
    }

    setIsLoading(true);
    try {
      const amount = Math.floor(parseFloat(fromAmount) * Math.pow(10, fromToken.decimals));

      const response = await fetch(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken.address}&outputMint=${toToken.address}&amount=${amount}&slippageBps=${Math.floor(slippage * 100)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const quoteData = await response.json();
      setQuote(quoteData);

      // Calculate output amount
      const outAmount = quoteData.outAmount / Math.pow(10, toToken.decimals);
      setToAmount(outAmount.toFixed(6));
    } catch (error) {
      console.error("Error fetching quote:", error);
      setToAmount("0");
    } finally {
      setIsLoading(false);
    }
  }, [fromAmount, fromToken, toToken, slippage]);

  // Execute swap
  const handleSwap = async () => {
    if (!connected || !publicKey || !quote) {
      alert("Please connect your wallet and get a quote first");
      return;
    }

    setIsLoading(true);
    try {
      // Get serialized transactions from Jupiter
      const response = await fetch("https://quote-api.jup.ag/v6/swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get swap transaction");
      }

      const { swapTransaction } = await response.json();

      // Deserialize the transaction
      const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);

      // Sign transaction
      if (!signTransaction) {
        throw new Error("Wallet does not support signing");
      }

      const signedTransaction = await signTransaction(transaction);

      // Send transaction
      const rawTransaction = signedTransaction.serialize();
      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      // Confirm transaction
      await connection.confirmTransaction(txid, "confirmed");

      alert(`Swap successful! Transaction: ${txid}`);

      // Reset form
      setFromAmount("");
      setToAmount("");
      setQuote(null);
    } catch (error: any) {
      console.error("Swap error:", error);
      alert(`Swap failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce quote fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromAmount && parseFloat(fromAmount) > 0) {
        getQuote();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken, slippage, getQuote]);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Zap className="h-8 w-8 text-[#FFFF02]" />
                Swap
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Trade tokens instantly with best prices from Jupiter aggregator
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-2xl">
        {/* Swap Container */}
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-2xl p-6">
          {/* Settings */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Swap Tokens</h2>
            <button
              onClick={() => setShowSlippageSettings(!showSlippageSettings)}
              className="p-2 hover:bg-[#FFFF02]/10 rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-400 hover:text-[#FFFF02]" />
            </button>
          </div>

          {/* Slippage Settings */}
          {showSlippageSettings && (
            <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#FFFF02]/10">
              <p className="text-sm font-semibold mb-3">Slippage Tolerance</p>
              <div className="flex gap-2">
                {[0.1, 0.5, 1.0].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      slippage === value
                        ? "bg-[#FFFF02] text-[#0a0a0a]"
                        : "bg-[#1a1a1a] text-gray-400 hover:text-white"
                    }`}
                  >
                    {value}%
                  </button>
                ))}
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(parseFloat(e.target.value) || 0.5)}
                  className="w-20 px-3 py-2 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-lg text-sm text-white text-center outline-none focus:border-[#FFFF02]"
                  step="0.1"
                  min="0.1"
                  max="50"
                />
              </div>
            </div>
          )}

          {/* From Token */}
          <div className="mb-2">
            <label className="text-sm text-gray-400 mb-2 block">You Pay</label>
            <div className="bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-2xl font-bold text-white outline-none flex-1"
                  disabled={!connected}
                />
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg">
                  {fromToken.logoURI && (
                    <img src={fromToken.logoURI} alt={fromToken.symbol} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-bold">{fromToken.symbol}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Balance: {fromToken.balance?.toFixed(4) || "0.00"}
              </p>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwapTokens}
              className="p-2 bg-[#1a1a1a] border-2 border-[#FFFF02]/20 rounded-lg hover:border-[#FFFF02] hover:bg-[#FFFF02]/10 transition-all"
              disabled={!connected}
            >
              <ArrowDownUp className="h-5 w-5 text-[#FFFF02]" />
            </button>
          </div>

          {/* To Token */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 mb-2 block">You Receive</label>
            <div className="bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <input
                  type="number"
                  value={toAmount}
                  placeholder="0.00"
                  className="bg-transparent text-2xl font-bold text-white outline-none flex-1"
                  disabled
                />
                <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg">
                  {toToken.logoURI && (
                    <img src={toToken.logoURI} alt={toToken.symbol} className="w-6 h-6 rounded-full" />
                  )}
                  <span className="font-bold">{toToken.symbol}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Balance: {toToken.balance?.toFixed(4) || "0.00"}
              </p>
            </div>
          </div>

          {/* Quote Info */}
          {quote && (
            <div className="mb-6 p-4 bg-[#0a0a0a] rounded-lg border border-[#FFFF02]/10">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Rate</span>
                <span className="text-white font-semibold">
                  1 {fromToken.symbol} ≈ {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Price Impact</span>
                <span className={`font-semibold ${quote.priceImpactPct > 1 ? 'text-red-500' : 'text-green-500'}`}>
                  {quote.priceImpactPct ? `${quote.priceImpactPct.toFixed(2)}%` : "< 0.01%"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Route</span>
                <span className="text-white text-xs">Via Jupiter</span>
              </div>
            </div>
          )}

          {/* Swap Button */}
          {connected ? (
            <button
              onClick={handleSwap}
              disabled={!quote || isLoading || !fromAmount || parseFloat(fromAmount) <= 0}
              className="w-full py-4 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#0a0a0a] font-bold text-lg rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : quote ? (
                "Swap"
              ) : (
                "Enter Amount"
              )}
            </button>
          ) : (
            <div className="text-center p-4 bg-[#FFFF02]/10 border border-[#FFFF02]/20 rounded-xl">
              <p className="text-sm text-gray-400">
                Please connect your wallet to start trading
              </p>
            </div>
          )}

          {/* Info */}
          <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              Powered by Jupiter Aggregator. Transactions are executed on Solana blockchain and may take a few seconds to confirm.
            </p>
          </div>
        </div>

        {/* Popular Tokens */}
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-4">Popular Tokens</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {POPULAR_TOKENS.map((token) => (
              <button
                key={token.address}
                onClick={() => setFromToken(token)}
                className="p-4 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl hover:border-[#FFFF02] hover:bg-[#FFFF02]/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  {token.logoURI && (
                    <img src={token.logoURI} alt={token.symbol} className="w-8 h-8 rounded-full" />
                  )}
                  <div className="text-left">
                    <p className="font-bold text-sm">{token.symbol}</p>
                    <p className="text-xs text-gray-500">{token.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
