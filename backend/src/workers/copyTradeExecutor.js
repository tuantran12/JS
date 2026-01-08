/**
 * Copy Trade Executor - Auto Trading 24/7
 * 
 * This worker monitors smart wallet transactions via QuickNode RPC
 * and automatically executes trades for followers using their Privy embedded wallets.
 * 
 * IMPORTANT: Requires Privy Server SDK for auto-signing transactions.
 * 
 * Configure these env vars:
 * - QUICKNODE_URL: Your QuickNode RPC endpoint (required for real-time monitoring)
 * - PRIVY_APP_ID: Your Privy app ID
 * - PRIVY_APP_SECRET: Your Privy app secret
 * - COPY_TX_FEE_SOL: Platform fee per transaction (default: 0.002)
 * 
 * Run as a separate process:
 * node src/workers/copyTradeExecutor.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Connection, PublicKey } = require('@solana/web3.js');
const { executeBuyOrder, executeSellOrder, getWalletBalance, checkDelegatedSigning } = require('../services/privyWallet');

const prisma = new PrismaClient();
const QUICKNODE_URL = process.env.QUICKNODE_URL;
const COPY_TX_FEE_SOL = parseFloat(process.env.COPY_TX_FEE_SOL || '0.002');
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || '3000', 10); // 3 seconds for faster copy
const MIN_SOL_BALANCE = 0.01; // Minimum SOL balance to execute trades

let connection = null;
let lastProcessedSignatures = new Map(); // Track processed tx to avoid duplicates

async function initConnection() {
  if (!QUICKNODE_URL) {
    console.log('⚠️  QUICKNODE_URL not configured. Running in demo mode.');
    return null;
  }
  
  try {
    connection = new Connection(QUICKNODE_URL, 'confirmed');
    const version = await connection.getVersion();
    console.log(`✅ Connected to Solana RPC. Version: ${version['solana-core']}`);
    return connection;
  } catch (e) {
    console.error('Failed to connect to RPC:', e.message);
    return null;
  }
}

async function getActiveFollowers() {
  // Get all active follows with user info
  const follows = await prisma.userFollow.findMany({
    where: { status: 'active' },
    include: {
      user: {
        include: {
          subscriptions: {
            where: { status: 'active' },
            orderBy: { endDate: 'desc' },
            take: 1
          }
        }
      },
      smartWallet: true
    }
  });

  // Group by smart wallet
  const grouped = {};
  const now = new Date();

  for (const follow of follows) {
    // Check active subscription
    const hasActiveSub = follow.user.subscriptions.some(s => new Date(s.endDate) > now);
    if (!hasActiveSub) continue;

    // Skip simulator mode - only execute real trades
    if (follow.mode === 'sim') continue;

    const swId = follow.smartWalletId;
    if (!grouped[swId]) {
      grouped[swId] = {
        smartWallet: follow.smartWallet,
        followers: []
      };
    }
    grouped[swId].followers.push(follow);
  }

  return grouped;
}

async function checkWalletTransactions(walletAddress) {
  if (!connection) return [];
  
  try {
    const publicKey = new PublicKey(walletAddress);
    const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
    
    // Filter new signatures (not already processed)
    const lastProcessed = lastProcessedSignatures.get(walletAddress) || '';
    const newSignatures = [];
    
    for (const sig of signatures) {
      if (sig.signature === lastProcessed) break;
      newSignatures.push(sig);
    }
    
    // Update last processed
    if (signatures.length > 0) {
      lastProcessedSignatures.set(walletAddress, signatures[0].signature);
    }
    
    return newSignatures;
  } catch (e) {
    console.error(`Error checking transactions for ${walletAddress}:`, e.message);
    return [];
  }
}

async function parseSwapTransaction(signature) {
  if (!connection) return null;
  
  try {
    const tx = await connection.getParsedTransaction(signature, {
      maxSupportedTransactionVersion: 0
    });
    
    if (!tx || tx.meta?.err) return null;
    
    // Analyze pre/post token balances to detect swaps
    const preBalances = tx.meta?.preTokenBalances || [];
    const postBalances = tx.meta?.postTokenBalances || [];
    
    // Simplified swap detection
    // In production, parse specific DEX program instructions
    
    const instructions = tx.transaction.message.instructions;
    
    // Check for Jupiter Aggregator
    const JUPITER_V6 = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';
    const RAYDIUM = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
    
    for (const ix of instructions) {
      const programId = ix.programId?.toString();
      
      if (programId === JUPITER_V6 || programId === RAYDIUM) {
        // Parse swap details from balance changes
        let tokenIn = 'SOL';
        let tokenOut = null;
        let amountIn = 0;
        let amountOut = 0;
        
        // Analyze balance changes
        const preSol = tx.meta?.preBalances?.[0] || 0;
        const postSol = tx.meta?.postBalances?.[0] || 0;
        const solChange = (postSol - preSol) / 1e9;
        
        if (solChange < -0.001) {
          // Bought token with SOL
          tokenIn = 'SOL';
          amountIn = Math.abs(solChange);
          
          // Find token received
          for (const post of postBalances) {
            const pre = preBalances.find(p => p.mint === post.mint);
            const preAmount = pre?.uiTokenAmount?.uiAmount || 0;
            const postAmount = post.uiTokenAmount?.uiAmount || 0;
            if (postAmount > preAmount) {
              tokenOut = post.mint;
              amountOut = postAmount - preAmount;
              break;
            }
          }
          
          if (tokenOut) {
            return {
              type: 'buy',
              tokenIn,
              tokenOut,
              amountIn,
              amountOut,
              price: amountIn / amountOut,
              signature
            };
          }
        } else if (solChange > 0.001) {
          // Sold token for SOL
          tokenOut = 'SOL';
          amountOut = solChange;
          
          // Find token sold
          for (const pre of preBalances) {
            const post = postBalances.find(p => p.mint === pre.mint);
            const preAmount = pre.uiTokenAmount?.uiAmount || 0;
            const postAmount = post?.uiTokenAmount?.uiAmount || 0;
            if (preAmount > postAmount) {
              tokenIn = pre.mint;
              amountIn = preAmount - postAmount;
              break;
            }
          }
          
          if (tokenIn !== 'SOL') {
            return {
              type: 'sell',
              tokenIn,
              tokenOut,
              amountIn,
              amountOut,
              price: amountOut / amountIn,
              signature
            };
          }
        }
      }
    }
    
    return null;
  } catch (e) {
    console.error(`Error parsing transaction ${signature}:`, e.message);
    return null;
  }
}

async function executeFollowerTrade(follow, trade) {
  const user = follow.user;
  const settings = follow.metadata || {};
  
  try {
    // Get user's Privy wallet address from DB
    const walletAddress = user.walletAddress;
    
    // Check balance
    const balance = await getWalletBalance(walletAddress);
    if (balance.sol < MIN_SOL_BALANCE) {
      console.log(`⚠️ User ${user.id} has insufficient balance: ${balance.sol} SOL`);
      return { success: false, error: 'Insufficient balance' };
    }

    // Calculate trade size based on follow settings
    let tradeSizeSol;
    
    if (settings.copyBuyMode === 'fixed') {
      tradeSizeSol = settings.copyBuyValue || 0.1;
    } else {
      // Percent of balance
      const percent = (settings.copyBuyValue || 1) / 100;
      tradeSizeSol = balance.sol * percent;
    }

    // Apply max buy limit
    if (settings.maxBuy && tradeSizeSol > settings.maxBuy) {
      tradeSizeSol = settings.maxBuy;
    }

    // Check spending limit
    if (settings.spendingLimit) {
      // TODO: Track daily spending and enforce limit
    }

    // Check min LP, MCAP filters
    // TODO: Fetch token liquidity and market cap to apply filters

    let result;
    
    if (trade.type === 'buy') {
      // Check buy-only-once rule (7 days)
      if (settings.buyOnlyOnce) {
        const recentPosition = await prisma.position.findFirst({
          where: {
            userId: user.id,
            token: trade.tokenOut,
            openedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        });
        if (recentPosition) {
          console.log(`⏭️ Skipping buy - already bought ${trade.tokenOut} in last 7 days`);
          return { success: false, error: 'Buy-only-once limit' };
        }
      }

      result = await executeBuyOrder(user.id, walletAddress, {
        tokenMint: trade.tokenOut,
        amountSol: tradeSizeSol,
        slippage: settings.slippage || 0.5
      });

      if (result.success) {
        // Record position
        await prisma.position.create({
          data: {
            userId: user.id,
            smartWalletId: follow.smartWalletId,
            token: trade.tokenOut,
            entryPrice: trade.price + COPY_TX_FEE_SOL,
            currentPrice: trade.price,
            quantity: tradeSizeSol / trade.price,
            valueUsd: tradeSizeSol * 150, // Approximate SOL price
            mode: 'live',
            status: 'open',
            txSignatures: [result.signature]
          }
        });

        // Record transaction
        await prisma.transaction.create({
          data: {
            userId: user.id,
            type: 'copy_live',
            token: trade.tokenOut,
            amount: tradeSizeSol,
            txSignature: result.signature,
            description: `Copy buy ${trade.tokenOut.slice(0, 8)}...`
          }
        });

        console.log(`✅ Executed BUY for user ${user.id}: ${tradeSizeSol} SOL -> ${trade.tokenOut.slice(0, 8)}...`);
      }

    } else if (trade.type === 'sell' && settings.copySell !== false) {
      // Find user's position in this token
      const position = await prisma.position.findFirst({
        where: {
          userId: user.id,
          token: trade.tokenIn,
          status: 'open'
        }
      });

      if (!position) {
        console.log(`⏭️ No position found for ${trade.tokenIn}`);
        return { success: false, error: 'No position to sell' };
      }

      // Calculate sell amount
      let sellAmount;
      if (settings.copySellMode === 'exact') {
        sellAmount = position.quantity;
      } else {
        // Sell same percentage as leader
        const sellPercent = (trade.amountIn / trade.amountIn) * 100; // Simplified
        sellAmount = position.quantity * (sellPercent / 100);
      }

      result = await executeSellOrder(user.id, walletAddress, {
        tokenMint: trade.tokenIn,
        amount: sellAmount,
        slippage: settings.slippage || 0.5
      });

      if (result.success) {
        // Update position
        const newQty = position.quantity - sellAmount;
        const pnl = (trade.price - position.entryPrice) * sellAmount;
        
        await prisma.position.update({
          where: { id: position.id },
          data: {
            quantity: newQty,
            valueUsd: newQty * trade.price * 150,
            pnl: position.pnl + pnl,
            status: newQty <= 0 ? 'closed' : 'open',
            closedAt: newQty <= 0 ? new Date() : null,
            txSignatures: [...(position.txSignatures || []), result.signature]
          }
        });

        await prisma.transaction.create({
          data: {
            userId: user.id,
            type: 'copy_live',
            token: trade.tokenIn,
            amount: sellAmount,
            txSignature: result.signature,
            description: `Copy sell ${trade.tokenIn.slice(0, 8)}...`,
            metadata: { pnl }
          }
        });

        console.log(`✅ Executed SELL for user ${user.id}: ${sellAmount} ${trade.tokenIn.slice(0, 8)}...`);
      }
    }

    return result || { success: false, error: 'Unknown trade type' };

  } catch (e) {
    console.error(`Error executing trade for user ${user.id}:`, e.message);
    return { success: false, error: e.message };
  }
}

async function runPoll() {
  const groupedFollowers = await getActiveFollowers();
  const smartWalletIds = Object.keys(groupedFollowers);
  
  if (smartWalletIds.length === 0) {
    return; // No active followers
  }

  for (const swId of smartWalletIds) {
    const { smartWallet, followers } = groupedFollowers[swId];
    
    if (!smartWallet?.address) continue;

    const signatures = await checkWalletTransactions(smartWallet.address);
    
    for (const sig of signatures) {
      const trade = await parseSwapTransaction(sig.signature);
      
      if (trade) {
        console.log(`\n📊 Detected ${trade.type.toUpperCase()} by ${smartWallet.address.slice(0, 8)}...`);
        console.log(`   Token: ${trade.tokenOut || trade.tokenIn}`);
        console.log(`   Amount: ${trade.amountIn} -> ${trade.amountOut}`);
        console.log(`   Followers: ${followers.length}`);

        // Execute for each follower in parallel
        const results = await Promise.allSettled(
          followers.map(follow => executeFollowerTrade(follow, trade))
        );

        const successful = results.filter(r => r.status === 'fulfilled' && r.value?.success).length;
        console.log(`   ✅ Executed for ${successful}/${followers.length} followers`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Copy Trade Executor Starting...');
  console.log('⚙️  Configuration:');
  console.log(`   - Poll interval: ${POLL_INTERVAL}ms`);
  console.log(`   - TX Fee: ${COPY_TX_FEE_SOL} SOL`);
  console.log(`   - Min balance: ${MIN_SOL_BALANCE} SOL`);
  console.log(`   - Privy: ${process.env.PRIVY_APP_ID ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`   - RPC: ${QUICKNODE_URL ? 'Configured' : 'NOT CONFIGURED (demo mode)'}`);
  
  await initConnection();
  
  console.log('\n👀 Monitoring smart wallets for trades...\n');
  
  // Initial check
  await runPoll();
  
  // Continuous polling
  setInterval(runPoll, POLL_INTERVAL);
}

// Run if executed directly
if (require.main === module) {
  main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
}

module.exports = { runPoll, executeFollowerTrade, parseSwapTransaction };
