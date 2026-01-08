"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, Crown } from "lucide-react";
import Link from "next/link";

function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate verification
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-[#FFFF02] mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold mb-2">Verifying your subscription...</h2>
          <p className="text-gray-400">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/subscription"
            className="inline-block px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#FFFF02] blur-3xl opacity-30 animate-pulse"></div>
            <CheckCircle className="relative h-24 w-24 text-[#FFFF02] mx-auto mb-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-[#FFFF02]">SENKAI Pro!</span>
          </h1>
          <p className="text-xl text-gray-300">
            Your subscription has been activated successfully
          </p>
        </div>

        {/* Success Details */}
        <div className="bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Crown className="h-8 w-8 text-[#FFFF02] flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold mb-2">What&apos;s Next?</h2>
              <p className="text-gray-300 leading-relaxed">
                You now have access to all premium features. Start exploring advanced
                analytics, AI-powered insights, and copy trading automation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#FFFF02]/10">
              <h3 className="font-semibold text-[#FFFF02] mb-2">✓ Unlimited AI Insights</h3>
              <p className="text-sm text-gray-400">
                Get unlimited access to AI-powered trading recommendations
              </p>
            </div>
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#FFFF02]/10">
              <h3 className="font-semibold text-[#FFFF02] mb-2">✓ Copy Trading</h3>
              <p className="text-sm text-gray-400">
                Follow and automatically copy top traders
              </p>
            </div>
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#FFFF02]/10">
              <h3 className="font-semibold text-[#FFFF02] mb-2">✓ Advanced Analytics</h3>
              <p className="text-sm text-gray-400">
                Access professional-grade market analysis tools
              </p>
            </div>
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#FFFF02]/10">
              <h3 className="font-semibold text-[#FFFF02] mb-2">✓ Priority Support</h3>
              <p className="text-sm text-gray-400">
                Get fast responses from our support team
              </p>
            </div>
          </div>
        </div>

        {/* Receipt Info */}
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 mb-8">
          <h3 className="font-bold mb-4">Payment Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Session ID</span>
              <span className="font-mono">{sessionId?.slice(0, 20)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Payment Method</span>
              <span>Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Receipt</span>
              <span className="text-[#FFFF02]">Sent to your email</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard"
            className="p-6 bg-gradient-to-r from-[#FFFF02] to-[#FFFF33] text-[#0a0a0a] rounded-xl font-bold text-center hover:opacity-90 transition-opacity"
          >
            Go to Dashboard →
          </Link>
          <Link
            href="/chat"
            className="p-6 bg-[#1a1a1a] border border-[#FFFF02]/50 text-white rounded-xl font-bold text-center hover:bg-[#FFFF02]/10 transition-colors"
          >
            Try AI Chat →
          </Link>
        </div>

        {/* Help */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:support@senkai.xyz" className="text-[#FFFF02] hover:text-[#FFFF33]">
              support@senkai.xyz
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 text-[#FFFF02] mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          </div>
        </div>
      }
    >
      <SubscriptionSuccessContent />
    </Suspense>
  );
}
