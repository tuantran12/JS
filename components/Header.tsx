"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

export function Header() {
  return (
    <>
      {/* Desktop Header - Always Dark Mode */}
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#FFFF02]/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFFF02] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                <Image
                  src="/logo.svg"
                  alt="SENKAI Logo"
                  width={382}
                  height={89}
                  className="h-8 md:h-10 w-auto object-contain relative z-10"
                  priority
                />
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8 lg:gap-12">
              <Link 
                href="/analytics" 
                className="relative text-white font-semibold text-sm lg:text-base hover:text-[#FFFF02] transition-colors group"
              >
                <span className="relative z-10">Analytics</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFFF02] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="https://blowfi.com/white-paper" 
                className="relative text-white font-semibold text-sm lg:text-base hover:text-[#FFFF02] transition-colors group"
              >
                <span className="relative z-10">White Paper</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFFF02] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="#" 
                className="relative text-white font-semibold text-sm lg:text-base hover:text-[#FFFF02] transition-colors group"
              >
                <span className="relative z-10">Document</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFFF02] group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link 
                href="#" 
                className="relative text-white font-semibold text-sm lg:text-base hover:text-[#FFFF02] transition-colors group"
              >
                <span className="relative z-10">For Partner</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFFF02] group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href="https://linktr.ee/senkai"
                className="hidden lg:block text-white/70 hover:text-[#FFFF02] text-sm font-medium transition-colors"
              >
                linktr.ee/senkai
              </Link>
              <Link
                href="https://app.senkai.xyz/"
                className="relative px-6 py-2.5 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-sm rounded-lg overflow-hidden group"
              >
                <span className="relative z-10">Launch App</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFFF33] to-[#FFFF02] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-[#FFFF02] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#FFFF02]/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="SENKAI Logo"
                width={382}
                height={89}
                className="h-7 w-auto object-contain"
                priority
              />
            </Link>
            <Link
              href="https://app.senkai.xyz/"
              className="px-4 py-2 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-xs rounded-lg"
            >
              Launch
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-[#FFFF02]/20">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-around py-3">
            <Link href="/analytics" className="text-white/70 hover:text-[#FFFF02] text-xs font-medium transition-colors">
              Analytics
            </Link>
            <Link href="https://blowfi.com/white-paper" className="text-white/70 hover:text-[#FFFF02] text-xs font-medium transition-colors">
              White Paper
            </Link>
            <Link href="#" className="text-white/70 hover:text-[#FFFF02] text-xs font-medium transition-colors">
              Document
            </Link>
          </nav>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-20"></div>
    </>
  );
}
