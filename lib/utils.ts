import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number as currency
 * Safe: handles null, undefined, NaN
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  if (value == null || isNaN(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format number as compact currency (e.g., $1.2B)
 * Safe: handles null, undefined, NaN
 */
export function formatCompactCurrency(value: number): string {
  // Guard against null, undefined, and NaN
  if (value == null || isNaN(value)) return "$0.00";

  // Handle negative values
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e9) {
    return `${sign}$${(absValue / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `${sign}$${(absValue / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    return `${sign}$${(absValue / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value);
}

/**
 * Format percentage
 * Safe: handles null, undefined, NaN
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  if (value == null || isNaN(value)) return "0.00%";
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/**
 * Format large number with commas
 * Safe: handles null, undefined, NaN
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value == null || isNaN(value)) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format volume with suffix (K, M, B)
 * Safe: handles null, undefined, NaN
 */
export function formatVolume(value: number): string {
  if (value == null || isNaN(value)) return "0.00";

  const absValue = Math.abs(value);
  if (absValue >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (absValue >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  } else if (absValue >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(2);
}

/**
 * Get color class based on value (positive/negative)
 * Safe: handles null, undefined, NaN
 */
export function getChangeColor(value: number): string {
  if (value == null || isNaN(value)) return "text-muted-foreground";
  return value >= 0 ? "text-positive" : "text-negative";
}

/**
 * Calculate time ago from timestamp
 * Safe: handles null, undefined, NaN
 */
export function timeAgo(timestamp: number): string {
  if (timestamp == null || isNaN(timestamp)) return "just now";

  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) return "just now";

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  if (seconds > 0) return `${seconds}s ago`;
  return "just now";
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
