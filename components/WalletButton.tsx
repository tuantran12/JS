"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet } from "lucide-react";

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <div className="wallet-button-wrapper">
      <WalletMultiButton className="!bg-gradient-to-r !from-[#FFFF02] !to-[#FFFF33] !text-[#121212] !font-bold !text-sm !rounded-lg !px-6 !py-2.5 hover:!opacity-90 !transition-opacity !border-0" />

      <style jsx global>{`
        .wallet-adapter-button {
          background: linear-gradient(to right, #FFFF02, #FFFF33) !important;
          color: #121212 !important;
          font-weight: 700 !important;
          border: none !important;
          border-radius: 0.5rem !important;
          padding: 0.625rem 1.5rem !important;
          font-size: 0.875rem !important;
          transition: opacity 0.3s !important;
        }

        .wallet-adapter-button:hover:not([disabled]) {
          opacity: 0.9 !important;
        }

        .wallet-adapter-button[disabled] {
          opacity: 0.6 !important;
          cursor: not-allowed !important;
        }

        .wallet-adapter-dropdown {
          background: #1a1a1a !important;
          border: 1px solid rgba(255, 255, 2, 0.2) !important;
          border-radius: 0.75rem !important;
        }

        .wallet-adapter-dropdown-list {
          background: #1a1a1a !important;
        }

        .wallet-adapter-dropdown-list-item {
          background: transparent !important;
          color: white !important;
        }

        .wallet-adapter-dropdown-list-item:hover {
          background: rgba(255, 255, 2, 0.1) !important;
        }

        .wallet-adapter-modal-wrapper {
          background: rgba(0, 0, 0, 0.8) !important;
          backdrop-filter: blur(8px) !important;
        }

        .wallet-adapter-modal {
          background: #1a1a1a !important;
          border: 1px solid rgba(255, 255, 2, 0.2) !important;
          border-radius: 1rem !important;
        }

        .wallet-adapter-modal-title {
          color: white !important;
        }

        .wallet-adapter-modal-button-close {
          color: rgba(255, 255, 255, 0.7) !important;
        }

        .wallet-adapter-modal-button-close:hover {
          color: #FFFF02 !important;
        }
      `}</style>
    </div>
  );
}
