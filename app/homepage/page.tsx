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
    <section className="min-h-[88vh] lg:min-h-[80vh] flex flex-row px-5 lg:px-5">
      <div className="w-full md:w-[40%] lg:w-[40%] bg-[#FFFF02] flex items-end pb-0">
        <div className="w-full animate-fadeInUp">
          <ExternalImage
            src="https://blowfi.com/wp-content/uploads/2025/10/Image.webp"
            alt="SENKAI Hero"
            width={800}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
      
      <div className="w-full md:w-[60%] flex flex-col justify-end gap-0 pb-0">
        <div className="w-full mb-[-210px] lg:mb-[-157px]">
          <ExternalImage
            src="https://blowfi.com/wp-content/uploads/2025/10/Grow-1.svg"
            alt="Grow"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>
        
        <div className="relative w-[17%] mb-[-20px] lg:mb-[-20px]">
          <div className="relative">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/ia1.png"
              alt="AI"
              width={200}
              height={200}
              className="w-full h-auto"
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-full bg-no-repeat bg-bottom bg-auto"
              style={{
                backgroundImage: "url('https://blowfi.com/wp-content/uploads/2025/10/Logo-Grow.svg')"
              }}
            />
          </div>
        </div>
        
        <div className="border-t border-[#FFFF02] px-8 lg:px-8 py-6">
          <div className="animate-fadeIn">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/TEXT.svg"
              alt="Text"
              width={800}
              height={200}
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="bg-[#FFFF02] border-l border-[#121212] px-4 lg:px-4">
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
    <section className="py-[150px] lg:py-[120px] md:py-[100px] px-0 relative">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="text-center">
          <h2 className="text-[32px] md:text-[32px] text-[#FDF8FF17] font-semibold leading-[40px] md:leading-[40px] mb-4">
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
    <section className="py-16 lg:py-20 px-0 relative noise-purple">
      <div className="container mx-auto px-4 lg:px-16">
          <div className="border-t border-[#FFFF02] pt-8 pb-20">
          <div className="flex items-center gap-2 mb-8">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
            />
            <h3 className="text-2xl font-bold text-[#FDF8FF] uppercase">WHY SENKAI</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <div>
              <h2 className="text-6xl lg:text-[64px] font-black mb-4 leading-[72px]">
                <span className="text-[#5B5B5B]">AI-POWERED TRADING</span><br />
                <span className="text-[#5B5B5B]"> WITH</span><br />
                <span className="text-[#5B5B5B]">INTELLIGENT AUTOMATION</span><br />
                <span className="text-[#5B5B5B]">& SCALABLE LIQUIDITY</span>
              </h2>
            </div>
            <div className="hidden lg:block">
              <ExternalImage
                src="https://blowfi.com/wp-content/uploads/2025/10/Ecosystem.svg"
                alt="Ecosystem"
                width={600}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    <div className="bg-[#FFFFFF0D] border border-transparent rounded-2xl p-8 hover:border-[#FFFF02] hover:shadow-[0_0_20px_rgba(255,255,2,0.25)] transition-all duration-300">
      <ExternalImage
        src={icon}
        alt={title}
        width={48}
        height={48}
        className="mb-4"
      />
      <h3 className="text-2xl lg:text-3xl font-semibold text-[#FEF6FF96] hover:text-[#FEF6FF] mb-4 transition-colors">
        {title}
      </h3>
      <div className="space-y-2">
        {features.map((feature, idx) => (
          <p key={idx} className="text-base text-[#7E807B] leading-6">
            {feature.split(':').map((part, i) => 
              i === 0 ? (
                <span key={i} className="text-[#FEF6FF]">{part}:</span>
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
    <section className="py-16 lg:py-20 px-0 relative noise-purple">
      <div className="container mx-auto px-4 lg:px-16">
          <div className="border-t border-[#FFFF02] pt-8 pb-20">
          <div className="flex items-center gap-2 mb-8">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
            />
            <h3 className="text-2xl font-bold text-[#FDF8FF] uppercase">How It Works</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <div>
              <h2 className="text-6xl lg:text-[64px] font-black mb-4 leading-[72px] uppercase">
                <span className="text-[#5B5B5B]">Seamless AI Trading</span><br />
                <span className="text-[#5B5B5B]"> in </span>
                <span className="text-[#FFFF02]">5 Simple Steps</span>
              </h2>
              <p className="text-xl text-[#FEF6FF] font-semibold uppercase mb-6">
                Trade smarter with AI—connect your wallet and start automating now!
              </p>
            </div>
            <div className="bg-[url('https://blowfi.com/wp-content/uploads/2025/10/Back-1.svg')] bg-top bg-no-repeat bg-contain rounded-2xl p-8 min-h-[38vh]">
              <h3 className="text-3xl lg:text-2xl font-bold text-[#121212] text-right mb-4">
                Get Started on SENKAI AGENT
              </h3>
              <p className="text-base lg:text-sm text-[#121212] font-bold text-right mb-6">
                Effortless AI trading—connect your wallet and start instantly!
              </p>
              <div className="flex flex-col gap-4">
                <div className="border-t border-[#121212] pt-4">
                  <Link
                    href="#"
                    className="block text-center bg-[#121212] text-[#FFFF02] font-semibold uppercase py-5 px-8 rounded-lg hover:opacity-90 transition"
                  >
                    Connect SENKAI for Trading
                  </Link>
                </div>
                <p className="text-center text-base font-bold text-[#121212]">
                  Available on Network Solana
                </p>
              </div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
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
    <div className="min-h-[56vh] md:min-h-[40vh] bg-[url('https://blowfi.com/wp-content/uploads/2025/10/Color-back.svg')] bg-center bg-no-repeat bg-contain flex flex-col items-center justify-center gap-4 border-r border-[#121212] p-8 lg:p-16">
      <button className="bg-white text-[#121212] font-semibold text-sm px-4 py-2 rounded">
        {step}
      </button>
      <h3 className={`text-3xl lg:text-2xl font-bold ${color} text-center uppercase`}>
        {title}
      </h3>
      <p className="text-base text-[#FEF6FF] text-center">
        {description}
      </p>
    </div>
  );
}

// Token Utility Section
function TokenUtilitySection() {
  return (
    <section className="py-16 lg:py-20 px-0 relative noise-purple">
      <div className="container mx-auto px-4 lg:px-16">
          <div className="border-t border-[#FFFF02] pt-8 pb-20">
          <div className="flex items-center gap-2 mb-8">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
            />
            <h3 className="text-2xl font-bold text-[#FDF8FF] uppercase">Token Utility & Economy</h3>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-6xl lg:text-[64px] font-black mb-4 leading-[72px] uppercase hidden md:block">
              <span className="text-[#5B5B5B]">Powering AI Trading with a</span><br />
              <span className="text-[#5B5B5B]"> Sustainable </span>
              <span className="text-[#FFFF02]">Token Economy</span>
            </h2>
            <h2 className="text-6xl lg:text-[64px] font-black mb-4 leading-[72px] uppercase block md:hidden">
              <span className="text-[#5B5B5B]">Powering AI Trading with a Sustainable</span><br />
              <span className="text-[#FFFF02]"> Token Economy</span>
            </h2>
            <p className="text-xl text-[#FEF6FF] font-semibold uppercase hidden md:block">
              SENKAI&apos;s token model powers AI trading, staking, and <br />
              credit-based liquidity,ensuring seamless transactions <br />
              and sustainable growth.
            </p>
            <p className="text-xl text-[#FEF6FF] font-normal block md:hidden">
              SENKAI&apos;s token model powers AI trading, staking, and credit-based liquidity,ensuring seamless transactions and sustainable growth.
            </p>
          </div>
          
          <div className="flex justify-center">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/Cont.svg"
              alt="Content"
              width={800}
              height={600}
              className="w-[80%] hidden md:block"
            />
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/Content.svg"
              alt="Content"
              width={800}
              height={600}
              className="w-[80%] block md:hidden"
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
    <section className="py-16 lg:py-20 px-0 relative noise-purple">
      <div className="container mx-auto px-4 lg:px-16">
          <div className="border-t border-[#FFFF02] pt-8 pb-20">
          <div className="flex items-center gap-2 mb-8">
            <ExternalImage
              src="https://blowfi.com/wp-content/uploads/2025/10/sUB-LOGO.svg"
              alt="Sub Logo"
              width={24}
              height={24}
            />
            <h3 className="text-2xl font-bold text-[#FDF8FF] uppercase">Roadmap</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-[-133px]">
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
          
          <div className="bg-[url('https://blowfi.com/wp-content/uploads/2025/10/Chart.svg')] bg-bottom bg-no-repeat bg-contain min-h-[400px]"></div>
        </div>
      </div>
    </section>
  );
}

// Roadmap Phase Component
function RoadmapPhase({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-h-[40vh] bg-[#0A0A0A] border-r border-[#252126] p-8 lg:p-16 flex flex-col">
      <h3 className="text-2xl lg:text-[28px] font-semibold text-[#FFFF02] mb-6 hover:text-[#FEF6FF] transition-colors">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <p key={idx} className="text-base text-[#FEF6FF] leading-6">
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
    <section className="py-20 lg:py-20 px-0 relative noise-purple">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="border-t border-[#FFFF02] pt-20 pb-14">
          <div className="text-center">
            <h2 className="text-6xl lg:text-[64px] font-black mb-4 leading-[72px] uppercase text-[#FEF6FF]">
              Start Trading Smarter with AI
            </h2>
            <p className="text-xl text-[#FEF6FF7A] font-semibold uppercase mb-8">
              Connect your wallet, trade smarter, and maximize profits with AI automation.
            </p>
            <Link
              href="#"
              className="inline-block bg-[#FFFF02] text-[#121212] font-bold uppercase px-10 py-5 rounded-lg hover:opacity-90 transition mb-8"
            >
              Start Trading with AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

