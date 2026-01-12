/**
 * API Configuration
 *
 * This file centralizes API endpoint configuration, making it easy to switch between:
 * 1. Next.js API Routes (same domain): /api/*
 * 2. Separate Backend (different domain): https://api.senkai.xyz/api/*
 */

// Determine API base URL based on environment
const getApiBaseUrl = (): string => {
  // Check for explicit API URL environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Default: Use relative paths for Next.js API Routes
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints Configuration
 * All API endpoints are defined here for easy management
 */
export const API_ENDPOINTS = {
  // Market Data
  prices: `${API_BASE_URL}/api/prices`,
  fearGreed: `${API_BASE_URL}/api/fear-greed`,
  klines: `${API_BASE_URL}/api/klines`,

  // Analytics
  fundingRate: `${API_BASE_URL}/api/funding-rate`,
  openInterest: `${API_BASE_URL}/api/open-interest`,
  longShort: `${API_BASE_URL}/api/long-short`,
  liquidations: `${API_BASE_URL}/api/liquidations`,
  rsi: `${API_BASE_URL}/api/rsi`,
  altcoinSeason: `${API_BASE_URL}/api/altcoin-season`,
  etf: `${API_BASE_URL}/api/etf`,

  // AI & Chat
  chat: `${API_BASE_URL}/api/chat`,

  // Payments
  createCheckoutSession: `${API_BASE_URL}/api/stripe/create-checkout-session`,
  stripeWebhook: `${API_BASE_URL}/api/webhooks/stripe`,
} as const;

/**
 * API Configuration
 */
export const API_CONFIG = {
  // Base URL (empty string for relative paths, or https://api.senkai.xyz for separate backend)
  baseUrl: API_BASE_URL,

  // Timeout in milliseconds
  timeout: 30000,

  // Retry configuration
  retry: {
    attempts: 3,
    delay: 1000,
  },

  // Cache configuration
  cache: {
    enabled: true,
    ttl: 30000, // 30 seconds
  },

  // Headers
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * Check if using separate backend
 */
export const isUsingSeparateBackend = (): boolean => {
  return API_BASE_URL !== '';
};

/**
 * Get full API URL for a given endpoint path
 * @param path - API endpoint path (e.g., '/api/prices')
 * @returns Full URL or relative path
 */
export const getApiUrl = (path: string): string => {
  if (API_BASE_URL) {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  return path;
};

/**
 * Configuration for different environments
 */
export const ENV_CONFIG = {
  development: {
    apiUrl: '', // Use Next.js API Routes
    debug: true,
  },
  preview: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '', // Can be configured per preview
    debug: true,
  },
  production: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '', // Configure in Vercel
    debug: false,
  },
} as const;

export default API_CONFIG;
