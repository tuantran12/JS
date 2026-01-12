/**
 * TypeScript type definitions for cryptocurrency analytics platform
 */

export interface CoinPrice {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdated: number;
}

export interface TradingPair {
  symbol: string;
  name: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  buyVolume: number;
  sellVolume: number;
  volumeChange: number;
  volumeChangePercent: number;
  netFlow: number;
  lastUpdated: number;
}

export interface MarketMetrics {
  openInterest: {
    value: number;
    change24h: number;
    changePercent24h: number;
  };
  liquidations: {
    total: number;
    long: number;
    short: number;
  };
  rsiAverage: number;
  altcoinSeason: number; // 0-100, where 100 is full altcoin season
  fearGreedIndex: number; // 0-100
  longShortRatio: number;
  etfData: {
    cumulativeInflow: number;
    dailyAverage: number;
    totalNav: number;
  };
}

export interface FundingRate {
  exchange: string;
  symbol: string;
  rate: number;
  nextFundingTime: number;
}

export interface OpenInterestData {
  exchange: string;
  symbol: string;
  openInterest: number;
  change24h: number;
  timestamp: number;
}

export interface LiquidationData {
  symbol: string;
  side: "long" | "short";
  price: number;
  quantity: number;
  value: number;
  timestamp: number;
  exchange: string;
}

export interface RSIData {
  symbol: string;
  timeframe: string;
  value: number;
  timestamp: number;
}

export interface LongShortRatio {
  exchange: string;
  symbol: string;
  ratio: number;
  longAccount: number;
  shortAccount: number;
  longPosition: number;
  shortPosition: number;
  timestamp: number;
}

export interface ETFFlow {
  date: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  totalNav: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: number;
  source: string;
  category: string;
  isVip?: boolean;
}

export type TimeFrame = "1H" | "4H" | "12H" | "24H" | "1W";

export interface ChartData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  lastUpdated: number;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

// Store state types
export interface AppState {
  selectedTimeframe: TimeFrame;
  setSelectedTimeframe: (timeframe: TimeFrame) => void;
  lastUpdate: number;
  setLastUpdate: (timestamp: number) => void;
  isRefreshing: boolean;
  setIsRefreshing: (isRefreshing: boolean) => void;
}
