"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

// Disable Next.js Image optimization for external images temporarily
const ExternalImage = ({ src, alt, width, height, className, priority }: any) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:block bg-[#121212] border-b border-[#121212]">
        <div className="flex items-center">
          {/* Logo Section */}
          <div className="w-[8%] lg:w-[10%] xl:w-[8%] bg-[#FFFF02] border-r border-[#121212] flex justify-center py-5">
            <Link href="/">
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/LOGO-1.svg"
                alt="SENKAI Logo"
                width={100}
                height={50}
                className="h-auto"
              />
            </Link>
          </div>

          {/* Typing Text Section */}
          <div className="w-[20%] lg:w-[20%] xl:w-[20%] bg-[#FFFF02] border-r border-[#121212] px-4 py-5">
            <TypingText />
          </div>

          {/* Navigation Links */}
          <div className="flex-1 bg-[#FFFF02] border-r border-[#121212]">
            <nav className="flex items-center justify-center gap-16 lg:gap-20 py-5">
              <Link href="https://blowfi.com/white-paper" className="text-[#121212] font-semibold text-lg hover:opacity-80 transition">
                White Paper
              </Link>
              <Link href="#" className="text-[#121212] font-semibold text-lg hover:opacity-80 transition">
                Document
              </Link>
              <Link href="#" className="text-[#121212] font-semibold text-lg hover:opacity-80 transition">
                For Partner
              </Link>
            </nav>
          </div>

          {/* Right Section - Linktree & Launch App */}
          <div className="w-[28%] bg-[#FFFF02] border-r border-[#121212]">
            <div className="flex h-full">
              <div className="w-[70%] flex flex-col border-b border-[#121212]">
                <div className="flex-1 flex items-center justify-center border-b border-[#121212]">
                  <Link href="https://linktr.ee/senkai" className="text-[#121212] font-extrabold text-base lg:text-sm">
                    https://linktr.ee/senkai
                  </Link>
                </div>
                <div className="flex-1 flex items-center justify-center bg-white hover-container">
                  <Link href="https://app.senkai.xyz/" className="text-[#121212] font-extrabold text-base lg:text-sm hover:text-[#FFFF02] transition-colors">
                    Launch App
                  </Link>
                </div>
              </div>
              <div className="w-[30%] flex items-center justify-center border-l border-[#121212]">
                <ExternalImage
                  src="https://blowfi.com/wp-content/uploads/2025/10/QR-code.svg"
                  alt="QR Code"
                  width={100}
                  height={100}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#121212] border-b border-[#121212]">
        <div className="flex items-center">
          <div className="w-[25%] bg-[#FFFF02] border-r border-[#121212] flex justify-center py-4">
            <Link href="/">
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/LOGO-1.svg"
                alt="SENKAI Logo"
                width={80}
                height={40}
                className="h-auto"
              />
            </Link>
          </div>
          <div className="flex-1 bg-[#FFFF02] border-r border-[#121212]">
            <nav className="flex items-center justify-center gap-6 lg:gap-10 py-4">
              <Link href="https://blowfi.com/white-paper" className="text-[#121212] font-semibold text-sm hover:opacity-80 transition">
                White Paper
              </Link>
              <Link href="#" className="text-[#121212] font-semibold text-sm hover:opacity-80 transition">
                Document
              </Link>
              <Link href="#" className="text-[#121212] font-semibold text-sm hover:opacity-80 transition">
                For Partner
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white">
        <div className="flex items-center justify-center border-t border-[#121212]">
          <nav className="flex items-center justify-center gap-10 py-3">
            <Link href="#" className="text-[#121212] font-semibold text-sm hover:opacity-80 transition">
              White Paper
            </Link>
            <Link href="#" className="text-[#121212] font-semibold text-sm hover:opacity-80 transition">
              Document
            </Link>
            <Link href="#" className="text-[#121212] font-semibold text-sm hover:opacity-80 transition">
              For Partner
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

// Typing Effect Component
function TypingText() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const texts = useMemo(() => [
    "Find Token Trading?",
    "Wait A Pew.....",
    "Automation Any Transaction!",
    "So Is Easy"
  ], []);

  useEffect(() => {
    const currentFullText = texts[currentIndex];
    
    if (isTyping) {
      if (currentText.length < currentFullText.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentFullText.slice(0, currentText.length + 1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      setCurrentText("");
      setCurrentIndex((prev) => (prev + 1) % texts.length);
      setIsTyping(true);
    }
  }, [currentText, currentIndex, isTyping, texts]);

  return (
    <div className="font-['Urbanist'] font-bold text-xs text-[#121212] leading-relaxed">
      <div className="min-h-[1.6em] relative">
        {currentText}
        {isTyping && <span className="animate-pulse">|</span>}
      </div>
    </div>
  );
}

