"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t border-[#FFFF02]/10 overflow-hidden">
      {/* Futuristic Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#FFFF02 1px, transparent 1px), linear-gradient(90deg, #FFFF02 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFFF02] opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FFFF02] opacity-5 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-[#FFFF02] blur-xl opacity-20"></div>
              <Image
                src="/logo.svg"
                alt="SENKAI Logo"
                width={382}
                height={89}
                className="w-36 md:w-40 h-auto object-contain relative z-10"
              />
            </div>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              AI-powered crypto trading platform. Trade smarter with intelligent automation.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/SenkAI_Agent"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#FFFF02]/20 flex items-center justify-center hover:border-[#FFFF02] hover:bg-[#FFFF02]/10 transition-all group"
              >
                <svg className="w-6 h-6 text-white group-hover:text-[#FFFF02] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              <Link
                href="https://t.me/senkai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#FFFF02]/20 flex items-center justify-center hover:border-[#FFFF02] hover:bg-[#FFFF02]/10 transition-all group"
              >
                <svg className="w-6 h-6 text-white group-hover:text-[#FFFF02] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </Link>
              <Link
                href="#"
                className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-[#FFFF02]/20 flex items-center justify-center hover:border-[#FFFF02] hover:bg-[#FFFF02]/10 transition-all group"
              >
                <svg className="w-6 h-6 text-white group-hover:text-[#FFFF02] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg md:text-xl">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="https://app.senkai.xyz/" className="text-gray-400 hover:text-[#FFFF02] transition-colors text-sm md:text-base">
                  Launch App
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-gray-400 hover:text-[#FFFF02] transition-colors text-sm md:text-base">
                  White Paper
                </Link>
              </li>
              <li>
                <Link href="https://linktr.ee/senkai" className="text-gray-400 hover:text-[#FFFF02] transition-colors text-sm md:text-base">
                  Linktree
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-white font-bold text-lg md:text-xl">Connect</h3>
            <div className="space-y-3">
              <p className="text-gray-400 text-sm md:text-base">
                Join our community and stay updated
              </p>
              <div className="flex flex-col gap-2">
                <Link href="https://x.com/SenkAI_Agent" className="text-[#FFFF02] hover:text-[#FFFF33] text-sm md:text-base transition-colors">
                  @SenkAI_Agent
                </Link>
                <Link href="https://t.me/senkai" className="text-[#FFFF02] hover:text-[#FFFF33] text-sm md:text-base transition-colors">
                  t.me/senkai
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#FFFF02]/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              2025 SENKAI © All Rights Reserved
            </p>
            <p className="text-gray-500 text-sm">
              Built on <span className="text-[#FFFF02]">Solana</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
