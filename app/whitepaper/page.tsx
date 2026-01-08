"use client";

import { Download, Rocket, Shield, TrendingUp, Users, Zap, DollarSign } from "lucide-react";
import Link from "next/link";

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="container mx-auto px-4 py-20 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-[#FFFF02]/10 rounded-2xl mb-6">
            <Rocket className="h-16 w-16 text-[#FFFF02]" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            SENKAI Protocol <span className="text-[#FFFF02]">Whitepaper</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            AI-Powered Web3 Trading Platform on Solana
          </p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-gray-500">Version 1.0</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">January 2026</span>
            <span className="text-gray-500">•</span>
            <button className="flex items-center gap-2 text-[#FFFF02] hover:text-[#FFFF33] transition-colors">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Abstract */}
        <Section title="Abstract">
          <p className="text-gray-300 leading-relaxed">
            SENKAI is a next-generation decentralized trading platform that combines artificial intelligence,
            copy trading, and real-time market analytics on the Solana blockchain. By leveraging high-speed
            blockchain infrastructure and advanced AI models, SENKAI empowers both novice and professional
            traders to make informed decisions, automate strategies, and maximize returns in the rapidly
            evolving cryptocurrency market.
          </p>
        </Section>

        {/* Table of Contents */}
        <Section title="Table of Contents">
          <ol className="space-y-2 text-gray-300">
            <li>1. Introduction</li>
            <li>2. Problem Statement</li>
            <li>3. SENKAI Solution</li>
            <li>4. Technical Architecture</li>
            <li>5. SENKAI Token Economics</li>
            <li>6. Copy Trading Protocol</li>
            <li>7. AI Integration</li>
            <li>8. Security & Audits</li>
            <li>9. Roadmap</li>
            <li>10. Conclusion</li>
          </ol>
        </Section>

        {/* Introduction */}
        <Section title="1. Introduction" icon={<Rocket />}>
          <p className="text-gray-300 leading-relaxed mb-4">
            The cryptocurrency market has experienced exponential growth, yet remains complex and intimidating
            for many traders. SENKAI addresses this challenge by providing an intuitive, AI-powered platform
            that democratizes access to professional trading strategies and market insights.
          </p>
          <p className="text-gray-300 leading-relaxed mb-4">
            Built on Solana's high-performance blockchain, SENKAI offers sub-second transaction finality,
            minimal fees, and the scalability required for real-time trading operations.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Real-time market data from multiple DEX aggregators</li>
            <li>AI-powered trading insights using state-of-the-art language models</li>
            <li>Automated copy trading with customizable risk parameters</li>
            <li>Non-custodial architecture ensuring user fund security</li>
          </ul>
        </Section>

        {/* Problem Statement */}
        <Section title="2. Problem Statement" icon={<TrendingUp />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProblemCard
              title="Information Overload"
              description="Traders face overwhelming amounts of data from multiple sources, making timely decisions difficult."
            />
            <ProblemCard
              title="Security Concerns"
              description="Centralized exchanges pose custody risks, while DeFi platforms can be complex to navigate safely."
            />
            <ProblemCard
              title="Skill Gap"
              description="Most retail traders lack the expertise and tools available to institutional traders."
            />
            <ProblemCard
              title="High Costs"
              description="Traditional platforms charge high fees and require expensive subscriptions for premium features."
            />
          </div>
        </Section>

        {/* SENKAI Solution */}
        <Section title="3. SENKAI Solution" icon={<Shield />}>
          <div className="space-y-6">
            <SolutionCard
              number="3.1"
              title="AI-Powered Market Intelligence"
              description="Leveraging Mistral-7B and advanced AI models, SENKAI provides real-time market analysis, trend predictions, and personalized trading recommendations based on historical data and current market conditions."
            />
            <SolutionCard
              number="3.2"
              title="Decentralized Copy Trading"
              description="Users can automatically replicate trades from top-performing traders through smart contracts, with customizable parameters for risk management, position sizing, and stop-loss settings."
            />
            <SolutionCard
              number="3.3"
              title="Real-Time Analytics Dashboard"
              description="Comprehensive market overview with live price feeds, volume analysis, liquidation data, and open interest metrics from Jupiter DEX and other Solana protocols."
            />
            <SolutionCard
              number="3.4"
              title="Token-Gated Features"
              description="SENKAI token holders receive premium benefits including reduced fees, advanced AI features, priority support, and governance rights over platform upgrades."
            />
          </div>
        </Section>

        {/* Technical Architecture */}
        <Section title="4. Technical Architecture" icon={<Zap />}>
          <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#FFFF02] mb-4">Technology Stack</h3>
            <ul className="space-y-3 text-gray-300">
              <li><strong className="text-white">Frontend:</strong> Next.js 14, React 18, TypeScript, Tailwind CSS</li>
              <li><strong className="text-white">Blockchain:</strong> Solana, Solana Web3.js, Wallet Adapter</li>
              <li><strong className="text-white">Smart Contracts:</strong> Anchor Framework, Rust</li>
              <li><strong className="text-white">Database:</strong> Supabase (PostgreSQL), Real-time subscriptions</li>
              <li><strong className="text-white">AI Engine:</strong> Hugging Face Inference API (Mistral-7B-Instruct)</li>
              <li><strong className="text-white">DEX Integration:</strong> Jupiter Aggregator, Raydium</li>
              <li><strong className="text-white">Payment:</strong> Stripe (fiat), Solana Pay (crypto)</li>
              <li><strong className="text-white">Deployment:</strong> Vercel Edge Network</li>
            </ul>
          </div>
        </Section>

        {/* Token Economics */}
        <Section title="5. SENKAI Token Economics" icon={<DollarSign />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#FFFF02] mb-3">Token Details</h3>
              <ul className="space-y-2 text-gray-300">
                <li><strong>Name:</strong> SENKAI</li>
                <li><strong>Symbol:</strong> SKI</li>
                <li><strong>Total Supply:</strong> 1,000,000,000</li>
                <li><strong>Blockchain:</strong> Solana (SPL Token)</li>
              </ul>
            </div>
            <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#FFFF02] mb-3">Token Utility</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Platform fee discounts (20%)</li>
                <li>• Subscription payments</li>
                <li>• Governance voting rights</li>
                <li>• Staking rewards</li>
                <li>• Premium feature access</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Roadmap */}
        <Section title="9. Roadmap" icon={<Users />}>
          <div className="space-y-6">
            <RoadmapItem
              quarter="Q1 2026"
              title="Platform Launch"
              items={[
                "MVP release on Solana devnet",
                "AI chatbot integration",
                "Basic copy trading features",
                "Community building",
              ]}
            />
            <RoadmapItem
              quarter="Q2 2026"
              title="Mainnet & Token Launch"
              items={[
                "Mainnet deployment",
                "SENKAI token generation event",
                "Advanced analytics features",
                "Mobile app beta",
              ]}
            />
            <RoadmapItem
              quarter="Q3 2026"
              title="Expansion"
              items={[
                "Multi-chain support (Ethereum, BSC)",
                "Advanced AI trading strategies",
                "Institutional features",
                "API for third-party integrations",
              ]}
            />
            <RoadmapItem
              quarter="Q4 2026"
              title="Ecosystem Growth"
              items={[
                "DAO governance launch",
                "NFT marketplace integration",
                "Educational platform",
                "Global partnerships",
              ]}
            />
          </div>
        </Section>

        {/* Conclusion */}
        <Section title="10. Conclusion">
          <p className="text-gray-300 leading-relaxed">
            SENKAI represents the future of decentralized trading by combining cutting-edge AI technology
            with the speed and security of Solana blockchain. Our platform democratizes access to
            professional trading tools, empowering users worldwide to participate in the cryptocurrency
            revolution with confidence. Join us in building a more accessible, transparent, and profitable
            trading ecosystem.
          </p>
        </Section>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Trading?</h3>
          <p className="text-gray-400 mb-6">
            Connect your wallet and experience the future of AI-powered trading
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors"
          >
            Launch App
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="text-[#FFFF02]">{icon}</div>}
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ProblemCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}

function SolutionCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
      <div className="text-[#FFFF02] font-mono text-sm mb-2">{number}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

function RoadmapItem({ quarter, title, items }: { quarter: string; title: string; items: string[] }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="px-3 py-1 bg-[#FFFF02]/20 text-[#FFFF02] text-sm font-bold rounded-full">
          {quarter}
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-300 flex items-start gap-2">
            <span className="text-[#FFFF02] mt-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
