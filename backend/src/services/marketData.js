const axios = require('axios');

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || 'eaaa6588309f4edf91161769dda94ea9';
const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

// Cache for prices (5 minutes)
const priceCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000 // 5 minutes
};

// Daily call counter
let dailyCallCount = 0;
let lastResetDate = new Date().toDateString();

// Reset counter daily
function resetDailyCounter() {
  const today = new Date().toDateString();
  if (today !== lastResetDate) {
    dailyCallCount = 0;
    lastResetDate = today;
  }
}

/**
 * Get SOL price from CoinMarketCap
 * Rate limited: 30 calls/day
 */
async function getSOLPrice() {
  resetDailyCounter();
  
  if (dailyCallCount >= 30) {
    throw new Error('Daily API limit reached (30 calls/day)');
  }

  // Check cache
  if (priceCache.data && priceCache.timestamp && (Date.now() - priceCache.timestamp) < priceCache.ttl) {
    return priceCache.data;
  }

  try {
    const response = await axios.get(`${COINMARKETCAP_BASE_URL}/cryptocurrency/quotes/latest`, {
      params: {
        symbol: 'SOL',
        convert: 'USD'
      },
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json'
      }
    });

    dailyCallCount++;
    
    const solData = response.data.data.SOL[0];
    const price = solData.quote.USD.price;
    
    priceCache.data = price;
    priceCache.timestamp = Date.now();
    
    return price;
  } catch (error) {
    console.error('CoinMarketCap API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch SOL price');
  }
}

/**
 * Get top 10 tokens from CoinMarketCap by market cap
 */
async function getTopTokens() {
  resetDailyCounter();
  
  if (dailyCallCount >= 30) {
    throw new Error('Daily API limit reached (30 calls/day)');
  }

  try {
    // Get top 10 coins by market cap
    const majorResponse = await axios.get(`${COINMARKETCAP_BASE_URL}/cryptocurrency/listings/latest`, {
      params: {
        start: 1,
        limit: 10,
        convert: 'USD',
        sort: 'market_cap'
      },
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json'
      }
    });

    dailyCallCount++;

    const tokens = majorResponse.data.data.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      price: token.quote.USD.price,
      change24h: token.quote.USD.percent_change_24h,
      marketCap: token.quote.USD.market_cap,
      volume24h: token.quote.USD.volume_24h,
      logo: `https://s2.coinmarketcap.com/static/img/coins/64x64/${token.id}.png`
    }));

    console.log(`✅ Fetched ${tokens.length} top tokens from CoinMarketCap`);
    return tokens;
  } catch (error) {
    console.error('CoinMarketCap API error:', error.response?.data || error.message);
    throw new Error('Failed to fetch top tokens');
  }
}

/**
 * Get DEX pools data from Bitquery
 * Using query structure from user's example
 * 
 * NOTE: If queries fail, check:
 * 1. Bitquery API key has access to Solana data
 * 2. Bitquery subscription plan includes Solana queries
 * 3. Query structure matches current Bitquery schema
 * 
 * Currently using mock data as fallback when API fails
 */
async function getDEXPools() {
  const BITQUERY_API = 'https://graphql.bitquery.io';
  const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY || 'da30951b-2d82-43e8-b488-996a447a4961';

  if (!BITQUERY_API_KEY) {
    console.warn('⚠️ Bitquery API key not set, using mock data');
    return getMockDEXPools();
  }

  // Query using solana (lowercase) - confirmed from schema introspection
  const query = `
    query GetDEXPools {
      solana {
        DEXPools(
          limit: {count: 20}
          orderBy: {descending: Block_Time}
          where: {
            Pool: {
              Base: {PostAmount: {gt: "206900000"}}
              Dex: {ProgramAddress: {is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"}}
              Market: {
                QuoteCurrency: {
                  MintAddress: {in: ["11111111111111111111111111111111", "So11111111111111111111111111111111111111112"]}
                }
              }
              Transaction: {Result: {Success: true}}
            }
          }
        ) {
          Pool {
            Market {
              BaseCurrency {
                MintAddress
                Name
                Symbol
              }
              MarketAddress
              QuoteCurrency {
                MintAddress
                Name
                Symbol
              }
            }
            Dex {
              ProtocolName
              ProtocolFamily
            }
            Base {
              Balance: PostAmount
            }
            Quote {
              PostAmount
              PriceInUSD
              PostAmountInUSD
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      BITQUERY_API,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': BITQUERY_API_KEY
        }
      }
    );

    if (response.data.errors) {
      console.error('❌ Bitquery GraphQL errors:', JSON.stringify(response.data.errors, null, 2));
      // Try simpler query if complex one fails
      const simpleResult = await getDEXPoolsSimple();
      if (simpleResult.length > 0) return simpleResult;
      // Return mock data if all queries fail
      console.warn('⚠️ Returning mock DEX pools data');
      return getMockDEXPools();
    }

    console.log('📊 Bitquery DEX Pools response keys:', Object.keys(response.data.data || {}));
    console.log('📊 Full response structure:', JSON.stringify(response.data, null, 2).substring(0, 1000));
    const pools = response.data.data?.solana?.DEXPools || response.data.data?.Solana?.DEXPools || [];
    console.log(`✅ Fetched ${pools.length} DEX pools from Bitquery`);
    if (pools.length > 0) {
      console.log('Sample pool structure:', JSON.stringify(pools[0], null, 2));
      return pools;
    }
    
    // If no data, try simple query
    const simpleResult = await getDEXPoolsSimple();
    if (simpleResult.length > 0) return simpleResult;
    
    // Return mock data as last resort
    console.warn('⚠️ Returning mock DEX pools data');
    return getMockDEXPools();
  } catch (error) {
    console.error('❌ Bitquery API error:', error.response?.data || error.message);
    // Try simpler query on error
    try {
      const simpleResult = await getDEXPoolsSimple();
      if (simpleResult.length > 0) return simpleResult;
    } catch (e) {
      console.error('Simple query also failed:', e.message);
    }
    // Return mock data as fallback
    console.warn('⚠️ Returning mock DEX pools data');
    return getMockDEXPools();
  }
}

/**
 * Mock DEX pools data (fallback when API fails)
 */
function getMockDEXPools() {
  return [
    {
      Pool: {
        Market: {
          BaseCurrency: { Symbol: 'BONK', Name: 'Bonk', MintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
          QuoteCurrency: { Symbol: 'SOL', Name: 'Solana', MintAddress: 'So11111111111111111111111111111111111111112' }
        },
        Dex: { ProtocolName: 'Raydium', ProtocolFamily: 'AMM' },
        Quote: { PriceInUSD: 0.000012, PostAmountInUSD: 1250000 }
      }
    },
    {
      Pool: {
        Market: {
          BaseCurrency: { Symbol: 'WIF', Name: 'dogwifhat', MintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
          QuoteCurrency: { Symbol: 'SOL', Name: 'Solana', MintAddress: 'So11111111111111111111111111111111111111112' }
        },
        Dex: { ProtocolName: 'Orca', ProtocolFamily: 'AMM' },
        Quote: { PriceInUSD: 2.45, PostAmountInUSD: 980000 }
      }
    },
    {
      Pool: {
        Market: {
          BaseCurrency: { Symbol: 'POPCAT', Name: 'Popcat', MintAddress: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr' },
          QuoteCurrency: { Symbol: 'SOL', Name: 'Solana', MintAddress: 'So11111111111111111111111111111111111111112' }
        },
        Dex: { ProtocolName: 'Jupiter', ProtocolFamily: 'Aggregator' },
        Quote: { PriceInUSD: 0.89, PostAmountInUSD: 750000 }
      }
    }
  ];
}

/**
 * Fallback: Simple DEX pools query
 */
async function getDEXPoolsSimple() {
  const BITQUERY_API = 'https://graphql.bitquery.io';
  const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY || 'da30951b-2d82-43e8-b488-996a447a4961';

  const query = `
    query {
      solana {
        DEXPools(
          limit: {count: 20}
          orderBy: {descending: Block_Time}
        ) {
          Pool {
            Market {
              BaseCurrency {
                Symbol
                Name
              }
              QuoteCurrency {
                Symbol
                Name
              }
            }
            Dex {
              ProtocolName
            }
            Quote {
              PriceInUSD
              PostAmountInUSD
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      BITQUERY_API,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': BITQUERY_API_KEY
        }
      }
    );

    if (response.data.errors) {
      console.error('Simple query also failed:', JSON.stringify(response.data.errors, null, 2));
      return [];
    }

    const pools = response.data.data?.Solana?.DEXPools || [];
    console.log(`✅ Fetched ${pools.length} DEX pools (simple query)`);
    return pools;
  } catch (error) {
    console.error('Simple query error:', error.message);
    return [];
  }
}

/**
 * Get DEX trades data from Bitquery
 * Using query structure from user's example
 */
async function getDEXTrades() {
  const BITQUERY_API = 'https://graphql.bitquery.io';
  const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY || 'da30951b-2d82-43e8-b488-996a447a4961';

  if (!BITQUERY_API_KEY) {
    return [];
  }

  // Query using solana (lowercase) - confirmed from schema introspection
  const query = `
    query GetDEXTrades {
      solana {
        DEXTradeByTokens(
          limit: {count: 20}
          orderBy: {descending: Block_Time}
          where: {
            Trade: {
              Dex: {ProgramAddress: {is: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"}}
            }
            Transaction: {Result: {Success: true}}
            Block: {Time: {since_relative: {hours_ago: 24}}}
          }
        ) {
          Trade {
            Currency {
              Name
              Symbol
              MintAddress
            }
            CurrentPrice: PriceInUSD(maximum: Block_Time)
            Side {
              Currency {
                Name
                Symbol
                MintAddress
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      BITQUERY_API,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': BITQUERY_API_KEY
        }
      }
    );

    if (response.data.errors) {
      console.error('❌ Bitquery GraphQL errors:', JSON.stringify(response.data.errors, null, 2));
      // Try simpler query if complex one fails
      const simpleResult = await getDEXTradesSimple();
      if (simpleResult.length > 0) return simpleResult;
      // Return mock data if all queries fail
      console.warn('⚠️ Returning mock DEX trades data');
      return getMockDEXTrades();
    }

    console.log('📊 Bitquery DEX Trades response keys:', Object.keys(response.data.data || {}));
    console.log('📊 Full response structure:', JSON.stringify(response.data, null, 2).substring(0, 1000));
    const trades = response.data.data?.solana?.DEXTradeByTokens || response.data.data?.Solana?.DEXTradeByTokens || [];
    console.log(`✅ Fetched ${trades.length} DEX trades from Bitquery`);
    if (trades.length > 0) {
      console.log('Sample trade structure:', JSON.stringify(trades[0], null, 2));
      return trades;
    }
    
    // If no data, try simple query
    const simpleResult = await getDEXTradesSimple();
    if (simpleResult.length > 0) return simpleResult;
    
    // Return mock data as last resort
    console.warn('⚠️ Returning mock DEX trades data');
    return getMockDEXTrades();
  } catch (error) {
    console.error('❌ Bitquery API error:', error.response?.data || error.message);
    // Try simpler query on error
    try {
      const simpleResult = await getDEXTradesSimple();
      if (simpleResult.length > 0) return simpleResult;
    } catch (e) {
      console.error('Simple trades query also failed:', e.message);
    }
    // Return mock data as fallback
    console.warn('⚠️ Returning mock DEX trades data');
    return getMockDEXTrades();
  }
}

/**
 * Mock DEX trades data (fallback when API fails)
 */
function getMockDEXTrades() {
  return [
    {
      Trade: {
        Currency: { Symbol: 'BONK', Name: 'Bonk', MintAddress: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
        CurrentPrice: 0.000012
      },
      Marketcap_Change_5min: 2.5,
      Marketcap_Change_1h: 8.3,
      Marketcap_Change_6h: -3.2
    },
    {
      Trade: {
        Currency: { Symbol: 'WIF', Name: 'dogwifhat', MintAddress: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
        CurrentPrice: 2.45
      },
      Marketcap_Change_5min: -1.2,
      Marketcap_Change_1h: 5.7,
      Marketcap_Change_6h: 12.4
    },
    {
      Trade: {
        Currency: { Symbol: 'POPCAT', Name: 'Popcat', MintAddress: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr' },
        CurrentPrice: 0.89
      },
      Marketcap_Change_5min: 4.1,
      Marketcap_Change_1h: 15.2,
      Marketcap_Change_6h: 28.5
    }
  ];
}

/**
 * Fallback: Simple DEX trades query
 */
async function getDEXTradesSimple() {
  const BITQUERY_API = 'https://graphql.bitquery.io';
  const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY || 'da30951b-2d82-43e8-b488-996a447a4961';

  const query = `
    query {
      solana {
        DEXTradeByTokens(
          limit: {count: 20}
          orderBy: {descending: Block_Time}
        ) {
          Trade {
            Currency {
              Symbol
              Name
            }
            PriceInUSD
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      BITQUERY_API,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': BITQUERY_API_KEY
        }
      }
    );

    if (response.data.errors) {
      console.error('Simple trades query also failed:', JSON.stringify(response.data.errors, null, 2));
      return [];
    }

    const trades = response.data.data?.Solana?.DEXTradeByTokens || [];
    console.log(`✅ Fetched ${trades.length} DEX trades (simple query)`);
    return trades;
  } catch (error) {
    console.error('Simple trades query error:', error.message);
    return [];
  }
}

module.exports = {
  getSOLPrice,
  getTopTokens,
  getDEXPools,
  getDEXTrades
};
