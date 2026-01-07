"use client";

import Image from "next/image";
import Link from "next/link";

export default function Homepage() {
  return (
    <div className="bg-[#000000] text-white min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
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

// Hero Section - Futuristic
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(#FFFF02 1px, transparent 1px), linear-gradient(90deg, #FFFF02 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#FFFF02] opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#FFFF02] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-10">
            <div className="inline-block relative group">
              <div className="absolute inset-0 bg-[#FFFF02] blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <span className="relative px-6 py-3 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-sm md:text-base rounded-full shadow-lg shadow-[#FFFF02]/50">
                AI-Powered Trading Platform
              </span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.9]">
              <span className="text-white block">Trade</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF02] via-[#FFFF33] to-[#FFFF02] block animate-gradient">
                Smarter
              </span>
              <span className="text-white block">with AI</span>
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Effortless crypto trading through intelligent AI agents. Combine natural language prompts with automated execution—no coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-6">
              <Link
                href="https://app.senkai.xyz/"
                className="group relative px-10 py-5 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#121212] font-bold text-lg rounded-xl overflow-hidden"
              >
                <span className="relative z-10">Launch App</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFFF33] to-[#FFFF02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-0 bg-[#FFFF02] blur-2xl opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </Link>
              <Link
                href="https://blowfi.com/white-paper"
                className="px-10 py-5 border-2 border-[#FFFF02] text-[#FFFF02] font-bold text-lg rounded-xl hover:bg-[#FFFF02] hover:text-[#121212] transition-all backdrop-blur-sm bg-[#FFFF02]/5"
              >
                White Paper
              </Link>
            </div>
          </div>

          {/* Right - Cat Avatar with Futuristic Frame */}
          <div className="flex items-center justify-center lg:justify-end order-first lg:order-last">
            <div className="relative w-full max-w-xl">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-[#FFFF02] rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
              
              {/* Glassmorphism Frame */}
              <div className="relative bg-gradient-to-br from-[#FFFF02]/20 via-[#FFFF02]/10 to-[#FFFF02]/5 rounded-[3rem] p-8 md:p-12 backdrop-blur-xl border-2 border-[#FFFF02]/40 shadow-2xl">
                {/* Inner Grid Pattern */}
                <div className="absolute inset-0 rounded-[3rem] opacity-10" style={{
                  backgroundImage: `linear-gradient(#FFFF02 1px, transparent 1px), linear-gradient(90deg, #FFFF02 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
                
                <div className="aspect-square relative z-10">
                  <Image
                    src="/cat-avatar.png"
                    alt="SENKAI Cat Avatar"
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// About Section - Futuristic
function AboutSection() {
  return (
    <section className="py-32 md:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-10">
          <div className="inline-block">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white">
              What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF02] to-[#FFFF33]">SENKAI</span>?
            </h2>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#FFFF02] blur-2xl opacity-10"></div>
            <p className="relative text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              SENKAI enables effortless crypto trading through intelligent AI agents. By combining natural language prompts with automated execution, we eliminate technical barriers and emotional trading. Trade smarter with AI-powered bots, copy proven strategies, and earn trading credit through staking—all without writing a single line of code.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Section - Futuristic Cards
function FeaturesSection() {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Automated Trading",
      description: "Train AI to execute trades based on personalized strategies. Test in simulation before going live.",
      items: [
        "Prompt AI Trading",
        "Copy Trading",
        "Market Simulation"
      ]
    },
    {
      icon: "🛒",
      title: "AI Marketplace & Bot Ecosystem",
      description: "Create, train, and list AI trading bots. Developers can build and monetize their AI bots.",
      items: [
        "Bot Marketplace",
        "Developer Tools",
        "Monetization"
      ]
    },
    {
      icon: "💎",
      title: "DeFi Lending & Credit System",
      description: "Stake tokens to receive CAT for trading capital. Access credit upfront with SOL, USDT, USDC.",
      items: [
        "Stake to Earn CAT",
        "Trading Credit",
        "Repay with Profits"
      ]
    },
    {
      icon: "🔒",
      title: "Decentralized & Secure",
      description: "Transparent system powered by on-chain smart contracts. Non-custodial trading for maximum security.",
      items: [
        "On-Chain Smart Contracts",
        "Non-Custodial",
        "Transparent System"
      ]
    }
  ];

  return (
    <section className="py-32 md:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#000000]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF02] to-[#FFFF33]">SENKAI</span>?
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Everything you need for intelligent crypto trading in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-8 md:p-10 border-2 border-[#FFFF02]/20 hover:border-[#FFFF02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFFF02]/30 hover:-translate-y-3 overflow-hidden"
            >
              {/* Holographic Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#FFFF02]/10 via-transparent to-[#FFFF02]/10"></div>
              
              {/* Glow on Hover */}
              <div className="absolute inset-0 bg-[#FFFF02] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-7xl mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">{feature.icon}</div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-5 group-hover:text-[#FFFF02] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 mb-6 leading-relaxed text-lg md:text-xl">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 text-base md:text-lg">
                      <span className="w-3 h-3 bg-[#FFFF02] rounded-full mr-4 flex-shrink-0 shadow-lg shadow-[#FFFF02]/50"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section - Futuristic Steps
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect Wallet",
      description: "Connect your Solana wallet to get started instantly"
    },
    {
      number: "02",
      title: "Select AI Mode",
      description: "Choose from Auto-trade, Copy-trade, or Custom AI Bots"
    },
    {
      number: "03",
      title: "Stake & Get CAT",
      description: "Buy or stake tokens to receive CAT for trading capital"
    },
    {
      number: "04",
      title: "Monitor & Optimize",
      description: "Track performance and adjust strategies in real-time"
    },
    {
      number: "05",
      title: "Profit & Withdraw",
      description: "Earn profits, withdraw, or reinvest in trading"
    }
  ];

  return (
    <section className="py-32 md:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF02] to-[#FFFF33]">Works</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Get started in 5 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connection Line with Glow - Desktop Only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-1 bg-gradient-to-r from-[#FFFF02] via-[#FFFF02]/50 to-transparent -translate-y-1/2 z-0 transform group-hover:scale-x-110 transition-transform shadow-lg shadow-[#FFFF02]/50"></div>
              )}
              
              <div className="relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-6 md:p-8 border-2 border-[#FFFF02]/20 hover:border-[#FFFF02] transition-all duration-500 h-full flex flex-col hover:shadow-2xl hover:shadow-[#FFFF02]/30 hover:-translate-y-3 overflow-hidden">
                {/* Holographic Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#FFFF02]/10 via-transparent to-[#FFFF02]/10"></div>
                
                <div className="relative z-10">
                  <div className="text-8xl md:text-9xl font-black text-[#FFFF02]/10 mb-4 group-hover:text-[#FFFF02]/20 transition-colors">{step.number}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#FFFF02] transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed flex-1">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box - Futuristic */}
        <div className="relative bg-gradient-to-r from-[#FFFF02] via-[#FFFF33] to-[#FFFF02] rounded-3xl p-12 md:p-16 lg:p-20 text-center overflow-hidden shadow-2xl">
          {/* Animated Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#121212 1px, transparent 1px), linear-gradient(90deg, #121212 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#121212] mb-8">
              Ready to Start Trading?
            </h3>
            <p className="text-[#121212] font-semibold mb-10 text-xl md:text-2xl">
              Connect your wallet and start automating now!
            </p>
            <Link
              href="https://app.senkai.xyz/"
              className="inline-block px-12 py-6 bg-[#121212] text-[#FFFF02] font-bold text-lg md:text-xl rounded-xl hover:bg-[#1a1a1a] transition-all transform hover:scale-105 shadow-xl relative group overflow-hidden"
            >
              <span className="relative z-10">Connect SENKAI for Trading</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </Link>
            <p className="text-[#121212] text-base md:text-lg mt-8 font-medium">
              Available on <span className="font-bold">Solana Network</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Token Utility Section - Futuristic
function TokenUtilitySection() {
  return (
    <section className="py-32 md:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#0a0a0a] via-[#000000] to-[#0a0a0a]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
            Token <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF02] to-[#FFFF33]">Utility</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            SENKAI&apos;s token model powers AI trading, staking, and credit-based liquidity, ensuring seamless transactions and sustainable growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {[
            { icon: "💰", title: "Trading Capital", desc: "Use CAT tokens as trading capital for AI-powered trading strategies" },
            { icon: "🔐", title: "Staking Rewards", desc: "Stake tokens to earn CAT and access trading credit upfront" },
            { icon: "🚀", title: "Platform Access", desc: "Access premium features, AI bots marketplace, and exclusive tools" }
          ].map((item, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-8 md:p-10 border-2 border-[#FFFF02]/20 hover:border-[#FFFF02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFFF02]/30 hover:-translate-y-3 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#FFFF02]/10 via-transparent to-[#FFFF02]/10"></div>
              <div className="absolute inset-0 bg-[#FFFF02] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#FFFF02] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Roadmap Section - Futuristic
function RoadmapSection() {
  const phases = [
    {
      phase: "Phase 1",
      title: "AI Trading Infrastructure",
      items: [
        "Development of AI Trading Bots (Prompt AI, Copy-trade)",
        "Launch of AI-powered Trading Simulator"
      ]
    },
    {
      phase: "Phase 2",
      title: "DeFi Expansion",
      items: [
        "Integration of Lending & Staking Protocols",
        "Re-staking support to expand liquidity access"
      ]
    },
    {
      phase: "Phase 3",
      title: "AI Marketplace & Automation",
      items: [
        "Launch of AI Bot Marketplace for developers",
        "Expansion of AI-driven trading with on-chain data & real-time analytics"
      ]
    }
  ];

  return (
    <section className="py-32 md:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20 md:mb-24">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFFF02] to-[#FFFF33]">Roadmap</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
            Building the future of AI-powered crypto trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-8 md:p-10 border-2 border-[#FFFF02]/20 hover:border-[#FFFF02] transition-all duration-500 hover:shadow-2xl hover:shadow-[#FFFF02]/30 hover:-translate-y-3 overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#FFFF02]/10 via-transparent to-[#FFFF02]/10"></div>
              <div className="absolute inset-0 bg-[#FFFF02] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="text-sm md:text-base font-bold text-[#FFFF02] mb-4 uppercase tracking-wider">{phase.phase}</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 group-hover:text-[#FFFF02] transition-colors">
                  {phase.title}
                </h3>
                <ul className="space-y-4">
                  {phase.items.map((item, idx) => (
                    <li key={idx} className="flex items-start text-gray-300">
                      <span className="w-3 h-3 bg-[#FFFF02] rounded-full mr-4 mt-2 flex-shrink-0 shadow-lg shadow-[#FFFF02]/50"></span>
                      <span className="text-base md:text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section - Futuristic
function CTASection() {
  return (
    <section className="py-32 md:py-40 lg:py-48 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#000000] via-[#0a0a0a] to-[#000000]">
      <div className="container mx-auto max-w-5xl">
        <div className="relative bg-gradient-to-r from-[#FFFF02] via-[#FFFF33] to-[#FFFF02] rounded-3xl p-12 md:p-16 lg:p-20 text-center overflow-hidden shadow-2xl">
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(#121212 1px, transparent 1px), linear-gradient(90deg, #121212 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#121212] mb-10">
              Start Trading Smarter with AI
            </h2>
            <p className="text-xl md:text-2xl text-[#121212] font-semibold mb-12 max-w-3xl mx-auto">
              Connect your wallet, trade smarter, and maximize profits with AI automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link
                href="https://app.senkai.xyz/"
                className="group relative px-12 py-6 bg-[#121212] text-[#FFFF02] font-bold text-lg md:text-xl rounded-xl overflow-hidden"
              >
                <span className="relative z-10">Start Trading with AI</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="absolute inset-0 bg-[#FFFF02] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </Link>
              <Link
                href="https://linktr.ee/senkai"
                className="px-12 py-6 border-2 border-[#121212] text-[#121212] font-bold text-lg md:text-xl rounded-xl hover:bg-[#121212] hover:text-[#FFFF02] transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
