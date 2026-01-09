const express = require('express');
const router = express.Router();
const { getSOLPrice, getTopTokens, getDEXPools, getDEXTrades } = require('../services/marketData');
const axios = require('axios');

/**
 * GET /api/market/sol-price
 * Get current SOL price in USD
 */
router.get('/sol-price', async (req, res) => {
  try {
    const price = await getSOLPrice();
    res.json({ price, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/market/top-tokens
 * Get top tokens from CoinMarketCap
 */
router.get('/top-tokens', async (req, res) => {
  try {
    const tokens = await getTopTokens();
    res.json({ tokens, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/market/dex-pools
 * Get DEX pools from Bitquery
 */
router.get('/dex-pools', async (req, res) => {
  try {
    const pools = await getDEXPools();
    res.json({ pools, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/market/dex-trades
 * Get DEX trades from Bitquery
 */
router.get('/dex-trades', async (req, res) => {
  try {
    const trades = await getDEXTrades();
    res.json({ trades, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/market/test-bitquery
 * Test Bitquery API with various query structures
 */
router.get('/test-bitquery', async (req, res) => {
  const BITQUERY_API = 'https://graphql.bitquery.io';
  const BITQUERY_API_KEY = process.env.BITQUERY_API_KEY || 'da30951b-2d82-43e8-b488-996a447a4961';

  const tests = [];

  // Test 1: Check schema for available root fields
  const query1 = `
    query {
      __schema {
        queryType {
          fields {
            name
            description
          }
        }
      }
    }
  `;

  try {
    const r1 = await axios.post(BITQUERY_API, { query: query1 }, {
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': BITQUERY_API_KEY }
    });
    const fields = r1.data.data?.__schema?.queryType?.fields || [];
    const solanaFields = fields.filter(f => 
      f.name.toLowerCase().includes('solana') || 
      f.name.toLowerCase().includes('sol') ||
      f.name.toLowerCase().includes('dex')
    );
    tests.push({ 
      name: 'Schema introspection', 
      success: !r1.data.errors, 
      errors: r1.data.errors, 
      availableFields: solanaFields.map(f => ({ name: f.name, desc: f.description }))
    });
  } catch (e) {
    tests.push({ name: 'Schema introspection', success: false, error: e.message });
  }

  // Test 2: Check solana type schema
  const query2 = `
    query {
      __type(name: "solana") {
        fields {
          name
          description
          type {
            name
            kind
          }
        }
      }
    }
  `;

  try {
    const r2 = await axios.post(BITQUERY_API, { query: query2 }, {
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': BITQUERY_API_KEY }
    });
    const fields = r2.data.data?.__type?.fields || [];
    const dexFields = fields.filter(f => 
      f.name.toLowerCase().includes('dex') || 
      f.name.toLowerCase().includes('pool') ||
      f.name.toLowerCase().includes('trade')
    );
    tests.push({ 
      name: 'Solana type schema', 
      success: !r2.data.errors, 
      errors: r2.data.errors, 
      availableFields: dexFields.map(f => ({ name: f.name, desc: f.description, type: f.type?.name }))
    });
  } catch (e) {
    tests.push({ name: 'Solana type schema', success: false, error: e.message });
  }

  // Test 3: Introspection query to see schema
  const query3 = `
    query IntrospectionQuery {
      __schema {
        queryType {
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `;

  try {
    const r3 = await axios.post(BITQUERY_API, { query: query3 }, {
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': BITQUERY_API_KEY }
    });
    const fields = r3.data.data?.__schema?.queryType?.fields || [];
    const solanaFields = fields.filter(f => f.name.toLowerCase().includes('solana') || f.name.toLowerCase().includes('dex'));
    tests.push({ name: 'Schema introspection', success: !r3.data.errors, errors: r3.data.errors, availableFields: solanaFields.map(f => f.name) });
  } catch (e) {
    tests.push({ name: 'Schema introspection', success: false, error: e.message });
  }

  // Test 4: Try Ethereum format (might be similar)
  const query4 = `
    query {
      ethereum {
        dexTrades(limit: 3) {
          exchange {
            name
          }
        }
      }
    }
  `;

  try {
    const r4 = await axios.post(BITQUERY_API, { query: query4 }, {
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': BITQUERY_API_KEY }
    });
    tests.push({ name: 'Ethereum format test', success: !r4.data.errors, errors: r4.data.errors, data: r4.data.data });
  } catch (e) {
    tests.push({ name: 'Ethereum format test', success: false, error: e.message });
  }

  res.json({ tests, timestamp: new Date().toISOString() });
});

/**
 * GET /api/market/dashboard
 * Get all market data for dashboard
 */
router.get('/dashboard', async (req, res) => {
  try {
    const [solPrice, topTokens, dexPools, dexTrades] = await Promise.allSettled([
      getSOLPrice(),
      getTopTokens(),
      getDEXPools(),
      getDEXTrades()
    ]);

    const result = {
      solPrice: solPrice.status === 'fulfilled' ? solPrice.value : null,
      topTokens: topTokens.status === 'fulfilled' ? topTokens.value : [],
      dexPools: dexPools.status === 'fulfilled' ? dexPools.value : [],
      dexTrades: dexTrades.status === 'fulfilled' ? dexTrades.value : [],
      timestamp: new Date().toISOString()
    };

    console.log('📊 Dashboard data:', {
      solPrice: result.solPrice,
      topTokensCount: result.topTokens.length,
      dexPoolsCount: result.dexPools.length,
      dexTradesCount: result.dexTrades.length
    });

    res.json(result);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
