/**
 * Nansen Smart Wallet Crawler
 * 
 * This worker periodically fetches smart wallet data from Nansen API
 * and updates the database for copy trading.
 * 
 * Configure these env vars:
 * - NANSEN_API_KEY: Your Nansen API key
 * - QUICKNODE_URL: Your QuickNode RPC endpoint
 * 
 * Run as a separate process or cron job:
 * node src/workers/nansenCrawler.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const NANSEN_API_KEY = process.env.NANSEN_API_KEY;
const QUICKNODE_URL = process.env.QUICKNODE_URL;
const CRAWL_INTERVAL = parseInt(process.env.CRAWL_INTERVAL || '60000', 10); // Default 1 minute

// List of smart wallet addresses to track (from Nansen)
const TRACKED_WALLETS = [
  // Add your 20 designated smart wallet addresses here
  // 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
  // '7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5',
];

async function fetchNansenData(walletAddress) {
  // TODO: Implement actual Nansen API call when API key is provided
  // Placeholder that returns mock data
  
  if (!NANSEN_API_KEY) {
    console.log('⚠️  NANSEN_API_KEY not configured, using mock data');
    return {
      address: walletAddress,
      roi30d: Math.random() * 100 - 20,
      pnl30d: Math.random() * 50000 - 10000,
      winRate: 50 + Math.random() * 40,
      aum: Math.random() * 1000000,
      mdd30d: Math.random() * 30,
      sparkline: Array.from({ length: 30 }, () => Math.random() * 100)
    };
  }

  // Actual API call (example structure)
  try {
    const response = await fetch(`https://api.nansen.ai/v1/wallets/${walletAddress}/stats`, {
      headers: {
        'Authorization': `Bearer ${NANSEN_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Nansen API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      address: walletAddress,
      roi30d: data.roi_30d || 0,
      pnl30d: data.pnl_30d || 0,
      winRate: data.win_rate || 0,
      aum: data.aum || 0,
      mdd30d: data.max_drawdown_30d || 0,
      sparkline: data.sparkline || null
    };
  } catch (e) {
    console.error(`Error fetching Nansen data for ${walletAddress}:`, e.message);
    return null;
  }
}

async function upsertSmartWallet(data) {
  if (!data) return;
  
  try {
    await prisma.smartWallet.upsert({
      where: { address: data.address },
      create: {
        address: data.address,
        roi30d: data.roi30d,
        pnl30d: data.pnl30d,
        winRate: data.winRate,
        aum: data.aum,
        mdd30d: data.mdd30d,
        sparkline: data.sparkline,
        lastUpdated: new Date()
      },
      update: {
        roi30d: data.roi30d,
        pnl30d: data.pnl30d,
        winRate: data.winRate,
        aum: data.aum,
        mdd30d: data.mdd30d,
        sparkline: data.sparkline,
        lastUpdated: new Date()
      }
    });
    console.log(`✅ Updated: ${data.address.slice(0, 8)}... ROI: ${data.roi30d.toFixed(2)}%`);
  } catch (e) {
    console.error(`Error upserting wallet ${data.address}:`, e.message);
  }
}

async function runCrawl() {
  console.log(`\n🔄 Starting Nansen crawl at ${new Date().toISOString()}`);
  
  for (const address of TRACKED_WALLETS) {
    const data = await fetchNansenData(address);
    await upsertSmartWallet(data);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`✅ Crawl complete. Updated ${TRACKED_WALLETS.length} wallets.`);
}

async function main() {
  console.log('🚀 Nansen Crawler Starting...');
  console.log(`📊 Tracking ${TRACKED_WALLETS.length} wallets`);
  console.log(`⏱️  Crawl interval: ${CRAWL_INTERVAL}ms`);
  console.log(`🔑 Nansen API: ${NANSEN_API_KEY ? 'Configured' : 'NOT CONFIGURED (using mock data)'}`);
  console.log(`🌐 QuickNode: ${QUICKNODE_URL ? 'Configured' : 'NOT CONFIGURED'}`);
  
  // Initial crawl
  await runCrawl();
  
  // Schedule periodic crawls
  setInterval(runCrawl, CRAWL_INTERVAL);
}

// Run if executed directly
if (require.main === module) {
  main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
}

module.exports = { fetchNansenData, upsertSmartWallet, runCrawl };


