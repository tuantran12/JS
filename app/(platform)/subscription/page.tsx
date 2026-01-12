"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Crown,
  Check,
  CreditCard,
  Zap,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

type BillingPeriod = "monthly" | "annual";

interface SubscriptionPlan {
  id: string;
  name: string;
  tier: string;
  monthlyPrice: number;
  annualPrice: number;
  stripePriceIdMonthly: string;
  stripePriceIdAnnual: string;
  features: string[];
}

const PLANS: SubscriptionPlan[] = [
  {
    id: "pro",
    name: "Pro",
    tier: "pro",
    monthlyPrice: 49,
    annualPrice: 470,
    stripePriceIdMonthly: "price_pro_monthly",
    stripePriceIdAnnual: "price_pro_annual",
    features: [
      "Unlimited AI insights",
      "Follow up to 15 traders",
      "Copy trading automation",
      "Advanced analytics",
      "Priority support",
      "Custom alerts",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tier: "premium",
    monthlyPrice: 149,
    annualPrice: 1430,
    stripePriceIdMonthly: "price_premium_monthly",
    stripePriceIdAnnual: "price_premium_annual",
    features: [
      "Everything in Pro",
      "Unlimited trader follows",
      "AI strategy builder",
      "Portfolio rebalancing",
      "Dedicated account manager",
      "Early access to features",
      "Custom API access",
    ],
  },
];

export default function SubscriptionPage() {
  const { connected, publicKey } = useWallet();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Mock current subscription
  const currentPlan = "free";
  const currentBillingPeriod = null;
  const nextBillingDate = null;

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!connected || !publicKey) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(plan.id);

    try {
      const priceId =
        billingPeriod === "monthly"
          ? plan.stripePriceIdMonthly
          : plan.stripePriceIdAnnual;

      // Call API to create checkout session
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          userId: publicKey.toString(),
          tier: plan.tier,
          billingPeriod,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to Stripe checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      alert(`Failed to start subscription: ${error.message}`);
    } finally {
      setIsLoading(null);
    }
  };

  const getSavings = (plan: SubscriptionPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return monthlyCost - annualCost;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Crown className="h-8 w-8 text-[#FFFF02]" />
                Subscription
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Upgrade your plan to unlock premium features
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm"
            >
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        {/* Current Plan */}
        <div className="mb-8 bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Current Plan</p>
              <h2 className="text-2xl font-bold capitalize mb-2">{currentPlan}</h2>
              {nextBillingDate && (
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Renews on {new Date(nextBillingDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {currentPlan !== "free" && (
              <button className="px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors">
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              billingPeriod === "monthly"
                ? "bg-[#FFFF02] text-[#0a0a0a]"
                : "bg-[#1a1a1a] text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod("annual")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all relative ${
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

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {PLANS.map((plan) => {
            const price =
              billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const savings = billingPeriod === "annual" ? getSavings(plan) : 0;

            return (
              <div
                key={plan.id}
                className="bg-[#1a1a1a] border-2 border-[#FFFF02]/30 rounded-2xl p-8 hover:border-[#FFFF02] hover:shadow-lg hover:shadow-[#FFFF02]/10 transition-all"
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-gray-400">
                      /{billingPeriod === "monthly" ? "mo" : "yr"}
                    </span>
                  </div>
                  {savings > 0 && (
                    <p className="text-sm text-green-500">
                      Save ${savings} per year
                    </p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={!connected || isLoading !== null}
                  className="w-full py-3 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#0a0a0a] font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading === plan.id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : currentPlan === plan.tier ? (
                    "Current Plan"
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Wallet Warning */}
        {!connected && (
          <div className="p-6 bg-[#FFFF02]/10 border border-[#FFFF02]/30 rounded-xl flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-[#FFFF02] flex-shrink-0" />
            <div>
              <h4 className="font-bold text-white mb-1">Connect Your Wallet</h4>
              <p className="text-sm text-gray-300">
                Please connect your Solana wallet to subscribe to a plan. Your wallet
                address will be linked to your subscription.
              </p>
            </div>
          </div>
        )}

        {/* Payment Methods */}
        <div className="mt-8 p-6 bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#FFFF02]" />
            Payment Methods
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0" />
              <span>Credit/Debit Card (Visa, Mastercard, Amex)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0" />
              <span>Solana Pay (Coming Soon)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0" />
              <span>SENKAI Token (Get 20-30% discount)</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-[#FFFF02] flex-shrink-0" />
              <span>Secure payment processing via Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
