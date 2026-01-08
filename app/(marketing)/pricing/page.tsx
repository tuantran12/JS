"use client";

import { useState } from "react";
import {
  Check,
  Zap,
  Crown,
  Sparkles,
  DollarSign,
  Rocket,
} from "lucide-react";
import Link from "next/link";

type BillingPeriod = "monthly" | "annual";
type PaymentMethod = "stripe" | "solana";

interface PricingTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  highlighted?: boolean;
  tokenDiscount?: number;
}

const pricingTiers: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    icon: <Rocket className="h-8 w-8" />,
    description: "Get started with basic features",
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "Real-time market data",
      "Basic AI insights (5 queries/day)",
      "Follow up to 3 traders",
      "Email support",
      "Community access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: <Zap className="h-8 w-8" />,
    description: "Advanced tools for serious traders",
    monthlyPrice: 49,
    annualPrice: 470,
    highlighted: true,
    tokenDiscount: 20,
    features: [
      "Everything in Free",
      "Unlimited AI insights",
      "Follow up to 15 traders",
      "Copy trading automation",
      "Advanced analytics dashboard",
      "Priority support",
      "Custom alerts & notifications",
      "20% fee discount with SKI tokens",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    icon: <Crown className="h-8 w-8" />,
    description: "Ultimate trading experience",
    monthlyPrice: 149,
    annualPrice: 1430,
    tokenDiscount: 30,
    features: [
      "Everything in Pro",
      "Unlimited trader follows",
      "AI strategy builder",
      "Portfolio rebalancing",
      "Dedicated account manager",
      "Early access to new features",
      "Custom API access",
      "30% fee discount with SKI tokens",
      "Exclusive community & events",
    ],
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");

  const getPrice = (tier: PricingTier) => {
    return billingPeriod === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  };

  const getSavings = (tier: PricingTier) => {
    if (tier.monthlyPrice === 0) return null;
    const monthlyCost = tier.monthlyPrice * 12;
    const annualCost = tier.annualPrice;
    const savings = monthlyCost - annualCost;
    return savings;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <header className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFFF02]/10 rounded-lg">
                <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-[#FFFF02]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Pricing <span className="text-[#FFFF02]">Plans</span>
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Choose the perfect plan for your trading journey
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-[#FFFF02] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent <span className="text-[#FFFF02]">Pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start free and upgrade as you grow. Pay with fiat or crypto.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              billingPeriod === "monthly"
                ? "bg-[#FFFF02] text-[#0a0a0a]"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
              billingPeriod === "annual"
                ? "bg-[#FFFF02] text-[#0a0a0a]"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            Annual
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>

        {/* Payment Method Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className="text-sm text-gray-400">Pay with:</span>
          <button
            onClick={() => setPaymentMethod("stripe")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              paymentMethod === "stripe"
                ? "bg-[#FFFF02]/20 text-[#FFFF02] border border-[#FFFF02]"
                : "bg-[#1a1a1a] text-gray-400 border border-[#FFFF02]/20"
            }`}
          >
            💳 Credit Card
          </button>
          <button
            onClick={() => setPaymentMethod("solana")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              paymentMethod === "solana"
                ? "bg-[#FFFF02]/20 text-[#FFFF02] border border-[#FFFF02]"
                : "bg-[#1a1a1a] text-gray-400 border border-[#FFFF02]/20"
            }`}
          >
            ⚡ Solana / SKI Token
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              price={getPrice(tier)}
              savings={billingPeriod === "annual" ? getSavings(tier) : null}
              billingPeriod={billingPeriod}
              paymentMethod={paymentMethod}
            />
          ))}
        </div>

        {/* Token Benefits */}
        <div className="bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-4">
            <Sparkles className="h-8 w-8 text-[#FFFF02] flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Extra Benefits with SENKAI Token
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
                  <span>Up to 30% discount on subscription fees</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
                  <span>Reduced trading fees on all transactions</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
                  <span>Governance voting rights</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
                  <span>Staking rewards and passive income</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            <FAQItem
              question="Can I change plans later?"
              answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any remaining balance."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept credit cards via Stripe and crypto payments via Solana Pay. You can also pay with SENKAI (SKI) tokens for additional discounts."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="Yes! The Free plan is available forever with no credit card required. Upgrade when you're ready for more advanced features."
            />
            <FAQItem
              question="What happens if I cancel?"
              answer="You can cancel anytime. Your subscription will remain active until the end of your billing period, and you won't be charged again."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  savings,
  billingPeriod,
  paymentMethod,
}: {
  tier: PricingTier;
  price: number;
  savings: number | null;
  billingPeriod: BillingPeriod;
  paymentMethod: PaymentMethod;
}) {
  const isFree = tier.id === "free";

  return (
    <div
      className={`bg-[#1a1a1a] rounded-2xl p-8 relative ${
        tier.highlighted
          ? "border-2 border-[#FFFF02] shadow-lg shadow-[#FFFF02]/20"
          : "border border-[#FFFF02]/20"
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFFF02] text-[#0a0a0a] px-4 py-1 rounded-full text-sm font-bold">
          Most Popular
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-block p-3 bg-[#FFFF02]/10 rounded-xl mb-4 text-[#FFFF02]">
          {tier.icon}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
        <p className="text-gray-400 text-sm">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6 pb-6 border-b border-[#FFFF02]/10">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-white">${price}</span>
          {!isFree && (
            <span className="text-gray-400">
              /{billingPeriod === "monthly" ? "mo" : "yr"}
            </span>
          )}
        </div>
        {savings && savings > 0 && (
          <p className="text-sm text-green-500 mt-2">
            Save ${savings} per year
          </p>
        )}
        {paymentMethod === "solana" && tier.tokenDiscount && (
          <p className="text-sm text-[#FFFF02] mt-2">
            {tier.tokenDiscount}% off with SKI tokens
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          tier.highlighted
            ? "bg-[#FFFF02] text-[#0a0a0a] hover:bg-[#FFFF33]"
            : "bg-[#FFFF02]/20 text-[#FFFF02] border border-[#FFFF02]/50 hover:bg-[#FFFF02]/30"
        }`}
      >
        {isFree ? "Get Started Free" : "Subscribe Now"}
      </button>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <h4 className="text-lg font-semibold text-white">{question}</h4>
        <span className="text-[#FFFF02] text-2xl">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <p className="text-gray-400 mt-4 leading-relaxed">{answer}</p>}
    </div>
  );
}
