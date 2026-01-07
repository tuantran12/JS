/**
 * API utility functions for fetching cryptocurrency data
 */

import axios, { AxiosError } from "axios";
import type { CacheEntry } from "./types";

// In-memory cache
const cache = new Map<string, CacheEntry<any>>();

/**
 * Generic cache wrapper for API calls
 */
async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 30000 // 30 seconds default
): Promise<T> {
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < cached.expiresIn) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresIn: ttl,
  });

  return data;
}

/**
 * Retry logic with exponential backoff
 * Skip retry for 451 (geographic restriction) errors
 */
async function retryFetch<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Don't retry for 451 (geographic restriction) or 403 (forbidden) errors
    if (error?.response?.status === 451 || error?.response?.status === 403) {
      throw error;
    }
    if (retries === 0) throw error;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryFetch(fn, retries - 1, delay * 2);
  }
}

/**
 * Binance API - Get current price
 */
export async function getBinancePrice(symbol: string): Promise<number> {
  const data = await cachedFetch(
    `binance-price-${symbol}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.binance.com/api/v3/ticker/price`, {
          params: { symbol: symbol.toUpperCase() },
        })
      );
      return parseFloat(response.data.price);
    },
    5000 // 5 second cache
  );
  return data;
}

/**
 * Binance API - Get 24hr ticker data
 */
export async function getBinance24hrTicker(symbol: string): Promise<any> {
  const data = await cachedFetch(
    `binance-24hr-${symbol}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.binance.com/api/v3/ticker/24hr`, {
          params: { symbol: symbol.toUpperCase() },
        })
      );
      return response.data;
    },
    10000 // 10 second cache
  );
  return data;
}

/**
 * Binance API - Get all ticker prices
 */
export async function getBinanceAllPrices(): Promise<any[]> {
  const data = await cachedFetch(
    `binance-all-prices`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.binance.com/api/v3/ticker/24hr`)
      );
      return response.data;
    },
    10000 // 10 second cache
  );
  return data;
}

/**
 * Binance API - Get klines/candlestick data
 */
export async function getBinanceKlines(
  symbol: string,
  interval: string = "1h",
  limit: number = 100
): Promise<any[]> {
  const data = await cachedFetch(
    `binance-klines-${symbol}-${interval}-${limit}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.binance.com/api/v3/klines`, {
          params: {
            symbol: symbol.toUpperCase(),
            interval,
            limit,
          },
        })
      );
      return response.data;
    },
    60000 // 1 minute cache
  );
  return data;
}

/**
 * CoinGecko API - Get simple price
 */
export async function getCoinGeckoPrice(coinId: string): Promise<any> {
  const data = await cachedFetch(
    `coingecko-price-${coinId}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
          params: {
            ids: coinId,
            vs_currencies: "usd",
            include_24hr_change: true,
            include_market_cap: true,
            include_24hr_vol: true,
          },
        })
      );
      return response.data[coinId];
    },
    30000 // 30 second cache
  );
  return data;
}

/**
 * CoinGecko API - Get multiple coins market data
 */
export async function getCoinGeckoMarkets(coinIds: string[]): Promise<any[]> {
  const data = await cachedFetch(
    `coingecko-markets-${coinIds.join(',')}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: 'usd',
            ids: coinIds.join(','),
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h',
          },
        })
      );
      return response.data;
    },
    10000 // 10 second cache
  );
  return data;
}

/**
 * CoinGecko API - Get global market data
 */
export async function getCoinGeckoGlobal(): Promise<any> {
  const data = await cachedFetch(
    `coingecko-global`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.coingecko.com/api/v3/global`)
      );
      return response.data.data;
    },
    60000 // 1 minute cache
  );
  return data;
}

/**
 * Alternative.me API - Get Fear & Greed Index
 */
export async function getFearGreedIndex(): Promise<any> {
  const data = await cachedFetch(
    `fear-greed-index`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://api.alternative.me/fng/`)
      );
      return response.data.data[0];
    },
    300000 // 5 minute cache
  );
  return data;
}

/**
 * Binance Futures API - Get open interest
 */
export async function getBinanceOpenInterest(symbol: string): Promise<any> {
  const data = await cachedFetch(
    `binance-oi-${symbol}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://fapi.binance.com/fapi/v1/openInterest`, {
          params: { symbol: symbol.toUpperCase() },
        })
      );
      return response.data;
    },
    30000 // 30 second cache
  );
  return data;
}

/**
 * Binance Futures API - Get long/short ratio
 */
export async function getBinanceLongShortRatio(
  symbol: string,
  period: string = "5m"
): Promise<any> {
  const data = await cachedFetch(
    `binance-ls-ratio-${symbol}-${period}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio`, {
          params: {
            symbol: symbol.toUpperCase(),
            period,
            limit: 30,
          },
        })
      );
      return response.data;
    },
    30000 // 30 second cache
  );
  return data;
}

/**
 * Binance Futures API - Get funding rate
 */
export async function getBinanceFundingRate(symbol: string): Promise<any> {
  const data = await cachedFetch(
    `binance-funding-${symbol}`,
    async () => {
      const response = await retryFetch(() =>
        axios.get(`https://fapi.binance.com/fapi/v1/premiumIndex`, {
          params: { symbol: symbol.toUpperCase() },
        })
      );
      return response.data;
    },
    60000 // 1 minute cache
  );
  return data;
}

/**
 * Error handler for API calls
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      return `API Error: ${axiosError.response.status} - ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      return "Network Error: Unable to reach API";
    }
  }
  return "An unexpected error occurred";
}

/**
 * Clear cache (useful for manual refresh)
 */
export function clearCache() {
  cache.clear();
}
