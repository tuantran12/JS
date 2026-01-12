"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Wallet, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";

export function PrivyWalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { wallets } = useWallets();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !ready) {
    return (
      <button
        disabled
        className="bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-sm rounded-lg px-6 py-2.5 opacity-50 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-sm rounded-lg px-6 py-2.5 hover:opacity-90 transition-opacity flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </button>
    );
  }

  // Get primary wallet address
  const primaryWallet = wallets[0];
  const address = primaryWallet?.address;

  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    if (addr.length < 10) return addr;
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Wallet Info Button */}
        <button className="bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-sm rounded-lg px-4 py-2.5 flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          {address ? formatAddress(address) : user?.email?.address || "Connected"}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg px-4 py-2.5 transition-colors flex items-center gap-2"
          title="Disconnect"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
