"use client";

import { useState } from "react";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  AlertCircle,
  Info,
} from "lucide-react";
import Link from "next/link";

type NotificationType = "trade_alert" | "price_alert" | "subscription" | "referral" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "trade_alert",
    title: "Copy Trade Executed",
    message: "SolanaWhale bought 2.5 SOL/USDC. Your copy trade was executed successfully.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    type: "price_alert",
    title: "Price Alert: SOL",
    message: "SOL has reached your target price of $105. Current price: $105.24",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "3",
    type: "subscription",
    title: "Subscription Renewed",
    message: "Your Pro subscription has been successfully renewed for another month.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    type: "referral",
    title: "Referral Reward",
    message: "You earned $50 commission from your referral's subscription!",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "5",
    type: "system",
    title: "New Feature Available",
    message: "Check out our new AI-powered trading insights in the Chat section.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "6",
    type: "trade_alert",
    title: "Stop Loss Triggered",
    message: "Your stop loss for RAY/USDC was triggered at $3.15.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<NotificationType | "all">("all");

  const filteredNotifications = filter === "all"
    ? notifications
    : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "trade_alert":
        return <TrendingUp className="h-5 w-5 text-[#FFFF02]" />;
      case "price_alert":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case "subscription":
        return <CheckCheck className="h-5 w-5 text-blue-500" />;
      case "referral":
        return <Users className="h-5 w-5 text-purple-500" />;
      case "system":
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: NotificationType | "all") => {
    switch (type) {
      case "all":
        return "All";
      case "trade_alert":
        return "Trades";
      case "price_alert":
        return "Prices";
      case "subscription":
        return "Subscription";
      case "referral":
        return "Referrals";
      case "system":
        return "System";
    }
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="border-b border-[#FFFF02]/20 bg-[#0a0a0a]/95 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <Bell className="h-8 w-8 text-[#FFFF02]" />
                Notifications
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-[#FFFF02] text-[#0a0a0a] text-sm font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Stay updated with your trading activity
              </p>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm flex items-center gap-2"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark All Read
                </button>
              )}
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-[#FFFF02]/10 border border-[#FFFF02]/50 text-[#FFFF02] rounded-lg hover:bg-[#FFFF02]/20 transition-colors text-sm"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
        {/* Filters */}
        <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
          <Filter className="h-5 w-5 text-gray-400 flex-shrink-0" />
          {(["all", "trade_alert", "price_alert", "subscription", "referral", "system"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                filter === type
                  ? "bg-[#FFFF02] text-[#0a0a0a]"
                  : "bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#1a1a1a]/80"
              }`}
            >
              {getTypeLabel(type)}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">No notifications</h3>
            <p className="text-gray-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-[#1a1a1a] border rounded-xl p-5 transition-all ${
                  notification.read
                    ? "border-[#FFFF02]/10 opacity-60"
                    : "border-[#FFFF02]/30 shadow-lg shadow-[#FFFF02]/5"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    notification.read ? "bg-gray-800" : "bg-[#FFFF02]/10"
                  }`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className={`font-bold ${notification.read ? "text-gray-400" : "text-white"}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-[#FFFF02]/10 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4 text-gray-400 hover:text-[#FFFF02]" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Settings Link */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[#FFFF02]/10 to-transparent border border-[#FFFF02]/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">Notification Preferences</h3>
              <p className="text-sm text-gray-400">
                Customize which notifications you want to receive
              </p>
            </div>
            <Link
              href="/profile?tab=notifications"
              className="px-6 py-2 bg-[#FFFF02] text-[#0a0a0a] font-bold rounded-lg hover:bg-[#FFFF33] transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
