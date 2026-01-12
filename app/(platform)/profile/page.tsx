"use client";

import { useState } from "react";
import {
  User,
  Settings,
  Bell,
  Key,
  Shield,
  Users,
  Copy,
  Check,
  Eye,
  EyeOff,
  Link as LinkIcon,
  Mail,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

type Tab = "account" | "notifications" | "api" | "security" | "referral";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const mockApiKey = "sk_live_51Hx...jK9z";
  const mockReferralCode = "SENKAI-X7K9M";
  const mockReferralLink = `https://app.senkai.xyz/ref/${mockReferralCode}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <header className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFFF02]/10 rounded-lg">
                <Settings className="h-6 w-6 md:h-8 md:w-8 text-[#FFFF02]" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  Profile & <span className="text-[#FFFF02]">Settings</span>
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">
                  Manage your account and preferences
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

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <TabButton
                active={activeTab === "account"}
                onClick={() => setActiveTab("account")}
                icon={<User className="h-5 w-5" />}
                label="Account"
              />
              <TabButton
                active={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
                icon={<Bell className="h-5 w-5" />}
                label="Notifications"
              />
              <TabButton
                active={activeTab === "api"}
                onClick={() => setActiveTab("api")}
                icon={<Key className="h-5 w-5" />}
                label="API Keys"
              />
              <TabButton
                active={activeTab === "security"}
                onClick={() => setActiveTab("security")}
                icon={<Shield className="h-5 w-5" />}
                label="Security"
              />
              <TabButton
                active={activeTab === "referral"}
                onClick={() => setActiveTab("referral")}
                icon={<Users className="h-5 w-5" />}
                label="Referrals"
              />
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === "account" && <AccountTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "api" && (
              <APITab
                apiKey={mockApiKey}
                showApiKey={showApiKey}
                setShowApiKey={setShowApiKey}
                handleCopy={handleCopy}
                copied={copied}
              />
            )}
            {activeTab === "security" && <SecurityTab />}
            {activeTab === "referral" && (
              <ReferralTab
                referralCode={mockReferralCode}
                referralLink={mockReferralLink}
                handleCopy={handleCopy}
                copied={copied}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? "bg-[#FFFF02]/20 text-[#FFFF02] border border-[#FFFF02]"
          : "bg-[#1a1a1a] text-gray-400 border border-[#FFFF02]/20 hover:border-[#FFFF02]/50 hover:text-white"
      }`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function AccountTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Settings</h2>
        <p className="text-gray-400 text-sm">
          Update your personal information and preferences
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Username
          </label>
          <input
            type="text"
            placeholder="SolanaTrader123"
            className="w-full bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FFFF02]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Email Address
          </label>
          <input
            type="email"
            placeholder="trader@senkai.xyz"
            className="w-full bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FFFF02]"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            value="7xKXtNiHfH...9dKp2mLz"
            disabled
            className="w-full bg-[#0a0a0a]/50 border border-[#FFFF02]/10 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-2">
            Wallet address cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Subscription Plan
          </label>
          <div className="flex items-center justify-between bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3">
            <span className="text-[#FFFF02] font-semibold">Pro Plan</span>
            <Link
              href="/pricing"
              className="text-sm text-gray-400 hover:text-[#FFFF02] transition-colors"
            >
              Upgrade →
            </Link>
          </div>
        </div>

        <button className="w-full px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Notification Preferences
        </h2>
        <p className="text-gray-400 text-sm">
          Choose how you want to be notified
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 space-y-6">
        <NotificationToggle
          icon={<Mail className="h-5 w-5" />}
          title="Email Notifications"
          description="Receive updates about your trades and account activity"
          defaultChecked={true}
        />
        <NotificationToggle
          icon={<Smartphone className="h-5 w-5" />}
          title="Push Notifications"
          description="Get real-time alerts on your mobile device"
          defaultChecked={false}
        />
        <NotificationToggle
          icon={<Bell className="h-5 w-5" />}
          title="Trade Alerts"
          description="Notify me when traders I follow make new trades"
          defaultChecked={true}
        />
        <NotificationToggle
          icon={<Bell className="h-5 w-5" />}
          title="Price Alerts"
          description="Alert me when price targets are reached"
          defaultChecked={true}
        />
        <NotificationToggle
          icon={<Bell className="h-5 w-5" />}
          title="Weekly Report"
          description="Receive weekly trading performance summary"
          defaultChecked={false}
        />

        <button className="w-full px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({
  icon,
  title,
  description,
  defaultChecked,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-[#FFFF02]/10 rounded-lg text-[#FFFF02] mt-1">
          {icon}
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-[#FFFF02]" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

function APITab({
  apiKey,
  showApiKey,
  setShowApiKey,
  handleCopy,
  copied,
}: {
  apiKey: string;
  showApiKey: boolean;
  setShowApiKey: (show: boolean) => void;
  handleCopy: (text: string) => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">API Keys</h2>
        <p className="text-gray-400 text-sm">
          Manage your API keys for programmatic access
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            API Key
          </label>
          <div className="flex items-center gap-2">
            <input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              readOnly
              className="flex-1 bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white font-mono text-sm"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="p-3 bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg hover:border-[#FFFF02] transition-colors"
            >
              {showApiKey ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleCopy(apiKey)}
              className="p-3 bg-[#FFFF02] rounded-lg hover:bg-[#FFFF33] transition-colors"
            >
              {copied ? (
                <Check className="h-5 w-5 text-[#0a0a0a]" />
              ) : (
                <Copy className="h-5 w-5 text-[#0a0a0a]" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Keep your API key secure and never share it publicly
          </p>
        </div>

        <div className="bg-[#FFFF02]/10 border border-[#FFFF02]/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#FFFF02] mb-2">
            API Documentation
          </h4>
          <p className="text-sm text-gray-300 mb-3">
            Use our API to integrate SENKAI trading features into your own
            applications.
          </p>
          <Link
            href="#"
            className="text-sm text-[#FFFF02] hover:text-[#FFFF33] transition-colors inline-flex items-center gap-1"
          >
            View Documentation →
          </Link>
        </div>

        <button className="w-full px-6 py-3 bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-lg hover:bg-red-500/30 transition-colors">
          Regenerate API Key
        </button>
      </div>
    </div>
  );
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Security Settings</h2>
        <p className="text-gray-400 text-sm">
          Protect your account with additional security measures
        </p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-white font-semibold mb-4">
            Two-Factor Authentication (2FA)
          </h3>
          <div className="bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold mb-1">Status: Disabled</p>
              <p className="text-sm text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
            <button className="px-6 py-2 bg-[#FFFF02] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#FFFF33] transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Change Password</h3>
          <div className="space-y-3">
            <input
              type="password"
              placeholder="Current Password"
              className="w-full bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FFFF02]"
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FFFF02]"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white outline-none focus:border-[#FFFF02]"
            />
            <button className="w-full px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors">
              Update Password
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Active Sessions</h3>
          <div className="space-y-2">
            <SessionItem
              device="Chrome on Windows"
              location="New York, US"
              current
            />
            <SessionItem
              device="Safari on iPhone"
              location="Los Angeles, US"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionItem({
  device,
  location,
  current,
}: {
  device: string;
  location: string;
  current?: boolean;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="text-white font-semibold">
          {device}
          {current && (
            <span className="ml-2 text-xs text-[#FFFF02]">(Current)</span>
          )}
        </p>
        <p className="text-sm text-gray-400">{location}</p>
      </div>
      {!current && (
        <button className="text-red-500 hover:text-red-400 text-sm font-semibold transition-colors">
          Revoke
        </button>
      )}
    </div>
  );
}

function ReferralTab({
  referralCode,
  referralLink,
  handleCopy,
  copied,
}: {
  referralCode: string;
  referralLink: string;
  handleCopy: (text: string) => void;
  copied: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Referral Program
        </h2>
        <p className="text-gray-400 text-sm">
          Earn rewards by inviting friends to SENKAI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Referrals</p>
          <p className="text-3xl font-bold text-white">24</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Active Referrals</p>
          <p className="text-3xl font-bold text-[#FFFF02]">18</p>
        </div>
        <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6">
          <p className="text-gray-400 text-sm mb-2">Total Earnings</p>
          <p className="text-3xl font-bold text-green-500">$1,240</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-[#1a1a1a] border border-[#FFFF02]/20 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Your Referral Code
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white font-mono text-lg"
            />
            <button
              onClick={() => handleCopy(referralCode)}
              className="px-6 py-3 bg-[#FFFF02] text-[#0a0a0a] font-semibold rounded-lg hover:bg-[#FFFF33] transition-colors flex items-center gap-2"
            >
              {copied ? (
                <Check className="h-5 w-5" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
              Copy
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Referral Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-[#0a0a0a] border border-[#FFFF02]/20 rounded-lg px-4 py-3 text-white text-sm"
            />
            <button
              onClick={() => handleCopy(referralLink)}
              className="p-3 bg-[#FFFF02] rounded-lg hover:bg-[#FFFF33] transition-colors"
            >
              {copied ? (
                <Check className="h-5 w-5 text-[#0a0a0a]" />
              ) : (
                <LinkIcon className="h-5 w-5 text-[#0a0a0a]" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#FFFF02]/10 border border-[#FFFF02]/30 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[#FFFF02] mb-2">
            How it works
          </h4>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• Share your referral link or code with friends</li>
            <li>• Earn 20% commission on their subscription fees</li>
            <li>• Get bonus SKI tokens for every 10 active referrals</li>
            <li>• Withdraw earnings anytime to your wallet</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
