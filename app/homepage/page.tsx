"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

// Disable Next.js Image optimization for external images temporarily
const ExternalImage = ({ src, alt, width, height, className, priority, style }: any) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

export default function Homepage() {
  return (
    <div className="bg-[#121212] text-white">
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Why SENKAI Section */}
      <WhySenkaiSection />
      
      {/* How It Works Section */}
      <HowItWorksSection />
      
      {/* Token Utility Section */}
      <TokenUtilitySection />
      
      {/* Roadmap Section */}
      <RoadmapSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="min-h-[85vh] lg:min-h-[80vh] flex flex-col md:flex-row">
      <div className="w-full md:w-[40%] bg-[#FFFF02] flex items-end">
        <div className="w-full animate-fadeInUp">
          <ExternalImage
            src="https://blowfi.com/wp-content/uploads/2025/10/Image.webp"
            alt="SENKAI Hero"
            width={800}
            height={800}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
      
      <div className="w-full md:w-[60%] flex flex-col justify-end">
        <div className="w-full relative -mt-16 md:-mt-20 lg:-mt-24">
          <ExternalImage
            src="https://blowfi.com/wp-content/uploads/2025/10/Grow-1.svg"
            alt="Grow"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>
        
        <div className="relative w-[20%] md:w-[17%] -mt-8 md:-mt-6">
          <div className="relative">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/ia1.png"
              alt="AI"
              width={200}
              height={200}
              className="w-full h-auto"
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-full bg-no-repeat bg-bottom bg-contain"
              style={{
                backgroundImage: "url('https://blowfi.com/wp-content/uploads/2025/10/Logo-Grow.svg')"
              }}
            />
          </div>
        </div>
        
        <div className="border-t border-[#FFFF02] px-6 md:px-8 py-4 md:py-6">
          <div className="animate-fadeIn">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/TEXT.svg"
              alt="Text"
              width={800}
              height={200}
              className="w-full h-auto max-w-full"
            />
          </div>
        </div>
        
        <div className="bg-[#FFFF02] border-l border-[#121212] px-4 md:px-6 lg:px-8">
          <CarouselSection />
        </div>
      </div>
    </section>
  );
}

// Carousel Section
function CarouselSection() {
  return (
    <div className="py-4">
      <div className="relative">
        <ExternalImage
          src="https://blowfi.com/wp-content/uploads/2025/10/Frame-2.svg"
          alt="Frame"
          width={800}
          height={100}
          className="w-full h-auto animate-fadeInUp"
        />
      </div>
    </div>
  );
}

// About Section
function AboutSection() {
  return (
    <section className="py-20 md:py-24 lg:py-32 px-4 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#FDF8FF] font-semibold leading-relaxed md:leading-relaxed">
            SENKAI enables effortless crypto trading through intelligent AI agents. By combining natural language prompts with automated execution, we eliminate technical barriers and emotional trading. Trade smarter with AI-powered bots, copy proven strategies, and earn trading credit through staking—all without writing a single line of code.
          </h2>
        </div>
      </div>
      
      {/* GSAP Animation Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined') {
              import('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js').then(() => {
                import('https://unpkg.com/gsap@3/dist/ScrollTrigger.min.js').then(() => {
                  import('https://cdn.jsdelivr.net/npm/split-type@0.3.4/umd/index.min.js').then((SplitType) => {
                    const SplitTypeModule = SplitType.default || SplitType;
                    const split = new SplitTypeModule(".cool-split h2", {
                      types: "words, chars",
                    });
                    
                    if (window.gsap && window.gsap.registerPlugin) {
                      window.gsap.registerPlugin(window.ScrollTrigger);
                      window.gsap.timeline({
                        scrollTrigger: {
                          trigger: ".about",
                          start: "top 10%",
                          end: "+=125%",
                          scrub: 0.5,
                        },
                      }).set(split.chars, {
                        duration: 0.3,
                        color: "white",
                        stagger: 0.1,
                      }, 0.1);
                    }
                  });
                });
              });
            }
          `
        }}
      />
    </section>
  );
}

// Why SENKAI Section
function WhySenkaiSection() {
  return (
    <section className="py-16 lg:py-24 px-4 relative noise-purple">
      <div className="container mx-auto max-w-7xl">
          <div className="border-t border-[#FFFF02] pt-8 pb-12 md:pb-16">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h3 className="text-xl md:text-2xl font-bold text-[#FDF8FF] uppercase">WHY SENKAI</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                <span className="text-[#5B5B5B]">AI-POWERED TRADING</span><br />
                <span className="text-[#5B5B5B]"> WITH</span><br />
                <span className="text-[#5B5B5B]">INTELLIGENT AUTOMATION</span><br />
                <span className="text-[#5B5B5B]">& SCALABLE LIQUIDITY</span>
              </h2>
            </div>
            <div className="hidden lg:flex lg:items-center lg:justify-center">
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/Ecosystem.svg"
                alt="Ecosystem"
                width={600}
                height={600}
                className="w-full h-auto max-w-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <FeatureBox
              icon="https://blowfi.com/wp-content/uploads/2025/10/Frame-1410105677.svg"
              title="AI-Powered Automated Trading"
              features={[
                "Prompt AI Trading: Train AI to execute trades based on personalized strategies.",
                "Copy Trading: Follow and replicate successful trading strategies.",
                "Market Simulation: Test strategies in a simulated environment before live trading."
              ]}
            />
            <FeatureBox
              icon="https://blowfi.com/wp-content/uploads/2025/10/Frame-1410105678-1.svg"
              title="AI Marketplace & Bot Ecosystem"
              features={[
                "Users can create, train, and list AI trading bots on the platform.",
                "Developers can build and monetize their AI bots."
              ]}
            />
            <FeatureBox
              icon="https://blowfi.com/wp-content/uploads/2025/10/Frame-1410105678.svg"
              title="DeFi Lending & Credit System"
              features={[
                "Stake tokens to receive CAT: Which can be used as trading capital.",
                "Staking with assets like SOL, USDT, and USDC: Re-To access trading credit upfront.",
                "Repay borrowed CAT through trading profits."
              ]}
            />
            <FeatureBox
              icon="https://blowfi.com/wp-content/uploads/2025/10/Frame-1410105678-2.svg"
              title="Decentralized & Secure"
              features={[
                "Transparent system powered by on-chain smart contracts.",
                "Secure asset management with non-custodial trading."
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Feature Box Component
function FeatureBox({ icon, title, features }: { icon: string; title: string; features: string[] }) {
  return (
    <div className="bg-[#FFFFFF0D] border border-transparent rounded-xl md:rounded-2xl p-6 md:p-8 hover:border-[#FFFF02] hover:shadow-[0_0_20px_rgba(255,255,2,0.25)] transition-all duration-300 h-full flex flex-col">
      <ExternalImage
        src={icon}
        alt={title}
        width={48}
        height={48}
        className="mb-4 w-12 h-12"
      />
      <h3 className="text-xl md:text-2xl lg:text-2xl font-semibold text-[#FEF6FF96] hover:text-[#FEF6FF] mb-4 transition-colors">
        {title}
      </h3>
      <div className="space-y-2 flex-1">
        {features.map((feature, idx) => (
          <p key={idx} className="text-sm md:text-base text-[#7E807B] leading-relaxed">
            {feature.split(':').map((part, i) => 
              i === 0 ? (
                <span key={i} className="text-[#FEF6FF] font-medium">{part}:</span>
              ) : (
                <span key={i}>{part}</span>
              )
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

// How It Works Section
function HowItWorksSection() {
  return (
    <section className="py-16 lg:py-24 px-4 relative noise-purple">
      <div className="container mx-auto max-w-7xl">
          <div className="border-t border-[#FFFF02] pt-8 pb-12 md:pb-16">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h3 className="text-xl md:text-2xl font-bold text-[#FDF8FF] uppercase">How It Works</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight uppercase">
                <span className="text-[#5B5B5B]">Seamless AI Trading</span><br />
                <span className="text-[#5B5B5B]"> in </span>
                <span className="text-[#FFFF02]">5 Simple Steps</span>
              </h2>
              <p className="text-lg md:text-xl text-[#FEF6FF] font-semibold uppercase mb-6">
                Trade smarter with AI—connect your wallet and start automating now!
              </p>
            </div>
            <div className="bg-[url('https://blowfi.com/wp-content/uploads/2025/10/Back-1.svg')] bg-top bg-no-repeat bg-contain rounded-xl md:rounded-2xl p-6 md:p-8 min-h-[300px] md:min-h-[350px] flex flex-col justify-between">
              <div className="text-right">
                <h3 className="text-2xl md:text-3xl font-bold text-[#121212] mb-3">
                  Get Started on SENKAI AGENT
                </h3>
                <p className="text-sm md:text-base text-[#121212] font-bold mb-6">
                  Effortless AI trading—connect your wallet and start instantly!
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="border-t border-[#121212] pt-4">
                  <Link
                    href="#"
                    className="block text-center bg-[#121212] text-[#FFFF02] font-semibold uppercase py-4 px-6 rounded-lg hover:opacity-90 transition text-sm md:text-base"
                  >
                    Connect SENKAI for Trading
                  </Link>
                </div>
                <p className="text-center text-sm md:text-base font-bold text-[#121212]">
                  Available on Network Solana
                </p>
              </div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#121212] rounded-lg overflow-hidden">
            <StepBox
              step="Step 2"
              title="Select AI Trading Mode"
              description="Choose from Auto-trade, Copy-trade, or Custom AI Bots."
              color="text-[#FFFF02]"
            />
            <StepBox
              step="Step 3"
              title="Stake & Use Token"
              description="Buy or stake to receive CAT for trading."
              color="text-[#FFFF99]"
            />
            <StepBox
              step="Step 4"
              title="Monitor & Optimize"
              description="Track performance and adjust strategies."
              color="text-[#FFFF02]"
            />
            <StepBox
              step="Step 5"
              title="Profit & Withdraw"
              description="Earn profits, withdraw, or reinvest in trading."
              color="text-[#FFFF99]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Step Box Component
function StepBox({ step, title, description, color }: { step: string; title: string; description: string; color: string }) {
  return (
    <div className="min-h-[300px] md:min-h-[350px] bg-[url('https://blowfi.com/wp-content/uploads/2025/10/Color-back.svg')] bg-center bg-no-repeat bg-contain flex flex-col items-center justify-center gap-4 border-r border-[#121212] last:border-r-0 p-6 md:p-8 lg:p-12">
      <button className="bg-white text-[#121212] font-semibold text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded">
        {step}
      </button>
      <h3 className={`text-xl md:text-2xl lg:text-2xl font-bold ${color} text-center uppercase leading-tight px-2`}>
        {title}
      </h3>
      <p className="text-sm md:text-base text-[#FEF6FF] text-center px-2">
        {description}
      </p>
    </div>
  );
}

// Token Utility Section
function TokenUtilitySection() {
  return (
    <section className="py-16 lg:py-24 px-4 relative noise-purple">
      <div className="container mx-auto max-w-7xl">
          <div className="border-t border-[#FFFF02] pt-8 pb-12 md:pb-16">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h3 className="text-xl md:text-2xl font-bold text-[#FDF8FF] uppercase">Token Utility & Economy</h3>
          </div>
          
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight uppercase">
              <span className="text-[#5B5B5B]">Powering AI Trading with a</span><br />
              <span className="text-[#5B5B5B]"> Sustainable </span>
              <span className="text-[#FFFF02]">Token Economy</span>
            </h2>
            <p className="text-lg md:text-xl text-[#FEF6FF] font-semibold uppercase max-w-4xl mx-auto">
              SENKAI&apos;s token model powers AI trading, staking, and credit-based liquidity, ensuring seamless transactions and sustainable growth.
            </p>
          </div>
          
          <div className="flex justify-center">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/Cont.svg"
              alt="Content"
              width={800}
              height={600}
              className="w-full max-w-4xl hidden md:block"
            />
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/Content.svg"
              alt="Content"
              width={800}
              height={600}
              className="w-full max-w-md block md:hidden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Roadmap Section
function RoadmapSection() {
  return (
    <section className="py-16 lg:py-24 px-4 relative noise-purple">
      <div className="container mx-auto max-w-7xl">
          <div className="border-t border-[#FFFF02] pt-8 pb-12 md:pb-16">
          <div className="flex items-center gap-3 mb-8 md:mb-12">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <h3 className="text-xl md:text-2xl font-bold text-[#FDF8FF] uppercase">Roadmap</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-8 md:mb-12 border border-[#252126] rounded-lg overflow-hidden">
            <RoadmapPhase
              title="Phase 1: AI Trading Infrastructure"
              items={[
                "Development of AI Trading Bots (Prompt AI, Copy-trade).",
                "Launch of AI-powered Trading Simulator."
              ]}
            />
            <RoadmapPhase
              title="Phase 2: DeFi Expansion"
              items={[
                "Integration of Lending & Staking Protocols.",
                "Re-staking support to expand liquidity access."
              ]}
            />
            <RoadmapPhase
              title="Phase 3: AI Marketplace & Automation"
              items={[
                "Launch of AI Bot Marketplace for developers.",
                "Expansion of AI-driven trading with on-chain data & real-time analytics."
              ]}
            />
          </div>
          
          <div className="bg-[url('https://blowfi.com/wp-content/uploads/2025/10/Chart.svg')] bg-bottom bg-no-repeat bg-contain min-h-[300px] md:min-h-[400px] rounded-lg"></div>
        </div>
      </div>
    </section>
  );
}

// Roadmap Phase Component
function RoadmapPhase({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-h-[300px] md:min-h-[350px] bg-[#0A0A0A] border-r border-[#252126] last:border-r-0 p-6 md:p-8 lg:p-12 flex flex-col">
      <h3 className="text-xl md:text-2xl lg:text-2xl font-semibold text-[#FFFF02] mb-4 md:mb-6 hover:text-[#FEF6FF] transition-colors">
        {title}
      </h3>
      <div className="space-y-3 flex-1">
        {items.map((item, idx) => (
          <p key={idx} className="text-sm md:text-base text-[#FEF6FF] leading-relaxed">
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-16 lg:py-24 px-4 relative noise-purple">
      <div className="container mx-auto max-w-4xl">
        <div className="border-t border-[#FFFF02] pt-12 md:pt-16 pb-12 md:pb-16">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight uppercase text-[#FEF6FF]">
              Start Trading Smarter with AI
            </h2>
            <p className="text-lg md:text-xl text-[#FEF6FF7A] font-semibold uppercase mb-8 max-w-2xl mx-auto">
              Connect your wallet, trade smarter, and maximize profits with AI automation.
            </p>
            <Link
              href="#"
              className="inline-block bg-[#FFFF02] text-[#121212] font-bold uppercase px-8 md:px-10 py-4 md:py-5 rounded-lg hover:opacity-90 transition text-sm md:text-base"
            >
              Start Trading with AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

