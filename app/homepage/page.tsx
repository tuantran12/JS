"use client";

import Image from "next/image";
import Link from "next/link";

export default function Homepage() {
  return (
    <div className="bg-[#121212] text-white min-h-screen">
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

// Hero Section - Modern Design
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFFF02] opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFFF02] opacity-5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="inline-block">
              <span className="px-4 py-2 bg-[#FFFF02] text-[#121212] font-bold text-sm md:text-base rounded-full">
                AI-Powered Trading Platform
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight">
              <span className="text-white">Trade Smarter with</span>
              <br />
              <span className="text-[#FFFF02]">SENKAI AI</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0">
              Effortless crypto trading through intelligent AI agents. Combine natural language prompts with automated execution—no coding required.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="https://app.senkai.xyz/"
                className="px-8 py-4 bg-[#FFFF02] text-[#121212] font-bold text-lg rounded-lg hover:bg-[#FFFF33] transition-all transform hover:scale-105 shadow-lg shadow-[#FFFF02]/20"
              >
                Launch App
              </Link>
              <Link
                href="https://blowfi.com/white-paper"
                className="px-8 py-4 border-2 border-[#FFFF02] text-[#FFFF02] font-bold text-lg rounded-lg hover:bg-[#FFFF02] hover:text-[#121212] transition-all"
              >
                White Paper
              </Link>
            </div>
          </div>

          {/* Right - Cat Avatar */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-[#FFFF02] rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#FFFF02]/10 to-[#FFFF02]/5 rounded-3xl p-8 backdrop-blur-sm border border-[#FFFF02]/20">
                <div className="aspect-square relative">
                  <Image
                    src="/cat-avatar.png"
                    alt="SENKAI Cat Avatar"
                    fill
                    className="object-contain"
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

// About Section
function AboutSection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white">
            What is <span className="text-[#FFFF02]">SENKAI</span>?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            SENKAI enables effortless crypto trading through intelligent AI agents. By combining natural language prompts with automated execution, we eliminate technical barriers and emotional trading. Trade smarter with AI-powered bots, copy proven strategies, and earn trading credit through staking—all without writing a single line of code.
          </p>
        </div>
      </div>
    </section>
  );
}

// Features Section
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
    <section className="py-20 md:py-28 lg:py-32 px-4 relative bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            Why Choose <span className="text-[#FFFF02]">SENKAI</span>?
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Everything you need for intelligent crypto trading in one platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 md:p-8 border border-gray-800 hover:border-[#FFFF02]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#FFFF02]/10"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#FFFF02] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.items.map((item, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-[#FFFF02] rounded-full mr-3"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
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
    <section className="py-20 md:py-28 lg:py-32 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            How It <span className="text-[#FFFF02]">Works</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Get started in 5 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-[#FFFF02] to-transparent -translate-y-1/2 z-0"></div>
              )}
              
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-gray-800 hover:border-[#FFFF02] transition-all duration-300 h-full flex flex-col">
                <div className="text-6xl font-black text-[#FFFF02]/20 mb-4">{step.number}</div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-[#FFFF02] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed flex-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-12 md:mt-16 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-black text-[#121212] mb-4">
            Ready to Start Trading?
          </h3>
          <p className="text-[#121212] font-semibold mb-6 text-lg">
            Connect your wallet and start automating now!
          </p>
          <Link
            href="https://app.senkai.xyz/"
            className="inline-block px-8 py-4 bg-[#121212] text-[#FFFF02] font-bold text-lg rounded-lg hover:bg-[#1a1a1a] transition-all transform hover:scale-105"
          >
            Connect SENKAI for Trading
          </Link>
          <p className="text-[#121212] text-sm mt-4 font-medium">
            Available on Solana Network
          </p>
        </div>
      </div>
    </section>
  );
}

// Token Utility Section
function TokenUtilitySection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 px-4 relative bg-gradient-to-b from-[#0a0a0a] to-[#121212]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            Token <span className="text-[#FFFF02]">Utility</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            SENKAI&apos;s token model powers AI trading, staking, and credit-based liquidity, ensuring seamless transactions and sustainable growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-gray-800">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-white mb-3">Trading Capital</h3>
            <p className="text-gray-400">
              Use CAT tokens as trading capital for AI-powered trading strategies
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-gray-800">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-white mb-3">Staking Rewards</h3>
            <p className="text-gray-400">
              Stake tokens to earn CAT and access trading credit upfront
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-8 border border-gray-800">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-bold text-white mb-3">Platform Access</h3>
            <p className="text-gray-400">
              Access premium features, AI bots marketplace, and exclusive tools
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Roadmap Section
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
    <section className="py-20 md:py-28 lg:py-32 px-4 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
            Our <span className="text-[#FFFF02]">Roadmap</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Building the future of AI-powered crypto trading
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {phases.map((phase, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 md:p-8 border border-gray-800 hover:border-[#FFFF02]/50 transition-all duration-300"
            >
              <div className="text-sm font-bold text-[#FFFF02] mb-2">{phase.phase}</div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {phase.title}
              </h3>
              <ul className="space-y-3">
                {phase.items.map((item, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <span className="w-2 h-2 bg-[#FFFF02] rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span className="text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="py-20 md:py-28 lg:py-32 px-4 relative bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] rounded-3xl p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#121212] mb-6">
              Start Trading Smarter with AI
            </h2>
            <p className="text-lg md:text-xl text-[#121212] font-semibold mb-8 max-w-2xl mx-auto">
              Connect your wallet, trade smarter, and maximize profits with AI automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://app.senkai.xyz/"
                className="px-8 py-4 bg-[#121212] text-[#FFFF02] font-bold text-lg rounded-lg hover:bg-[#1a1a1a] transition-all transform hover:scale-105 shadow-lg"
              >
                Start Trading with AI
              </Link>
              <Link
                href="https://linktr.ee/senkai"
                className="px-8 py-4 border-2 border-[#121212] text-[#121212] font-bold text-lg rounded-lg hover:bg-[#121212] hover:text-[#FFFF02] transition-all"
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
