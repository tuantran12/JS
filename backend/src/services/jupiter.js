/**
 * Jupiter Aggregator Integration
 * 
 * Provides best swap routes for copy trading on Solana.
 * Uses Jupiter API for optimal routing across all Solana DEXs.
 */

const { PublicKey, TransactionMessage, VersionedTransaction } = require('@solana/web3.js');

const JUPITER_API = 'https://quote-api.jup.ag/v6';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

/**
 * Get swap quote from Jupiter
 */
async function getQuote(inputMint, outputMint, amountLamports, slippageBps = 50) {
  try {
    const params = new URLSearchParams({
      inputMint,
      outputMint,
      amount: amountLamports.toString(),
      slippageBps: slippageBps.toString()
    });

    const response = await fetch(`${JUPITER_API}/quote?${params}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`);
    }

    const quote = await response.json();
    return quote;

  } catch (e) {
    console.error('Jupiter quote error:', e.message);
    throw e;
  }
}

/**
 * Get swap transaction from Jupiter
 */
async function getSwapTransaction(quote, userPublicKey, wrapUnwrapSOL = true) {
  try {
    const response = await fetch(`${JUPITER_API}/swap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quoteResponse: quote,
        userPublicKey: userPublicKey.toString(),
        wrapAndUnwrapSol: wrapUnwrapSOL,
        dynamicComputeUnitLimit: true,
        prioritizationFeeLamports: 'auto'
      })
    });

    if (!response.ok) {
      throw new Error(`Jupiter swap API error: ${response.status}`);
    }

    const { swapTransaction } = await response.json();
    return swapTransaction; // Base64 encoded transaction

  } catch (e) {
    console.error('Jupiter swap error:', e.message);
    throw e;
  }
}

/**
 * Build complete buy transaction (SOL -> Token)
 */
async function buildBuyTransaction(tokenMint, amountSol, userPublicKey, slippageBps = 50) {
  const amountLamports = Math.floor(amountSol * 1e9);
  
  // Get quote
  const quote = await getQuote(SOL_MINT, tokenMint, amountLamports, slippageBps);
  
  // Get swap transaction
  const swapTxBase64 = await getSwapTransaction(quote, userPublicKey);
  
  return {
    quote,
    transaction: swapTxBase64,
    inputAmount: amountSol,
    outputAmount: quote.outAmount / Math.pow(10, quote.outputTokenDecimals || 9),
    priceImpact: quote.priceImpactPct
  };
}

/**
 * Build complete sell transaction (Token -> SOL)
 */
async function buildSellTransaction(tokenMint, amount, decimals, userPublicKey, slippageBps = 50) {
  const amountLamports = Math.floor(amount * Math.pow(10, decimals));
  
  // Get quote
  const quote = await getQuote(tokenMint, SOL_MINT, amountLamports, slippageBps);
  
  // Get swap transaction
  const swapTxBase64 = await getSwapTransaction(quote, userPublicKey);
  
  return {
    quote,
    transaction: swapTxBase64,
    inputAmount: amount,
    outputAmount: quote.outAmount / 1e9, // SOL
    priceImpact: quote.priceImpactPct
  };
}

/**
 * Get token price in SOL
 */
async function getTokenPrice(tokenMint) {
  try {
    // Small test quote to get price
    const quote = await getQuote(tokenMint, SOL_MINT, 1e9, 100);
    return quote.outAmount / 1e9;
  } catch (e) {
    console.error('Price fetch error:', e.message);
    return 0;
  }
}

/**
 * Deserialize Jupiter transaction for signing
 */
function deserializeTransaction(base64Tx) {
  const buffer = Buffer.from(base64Tx, 'base64');
  return VersionedTransaction.deserialize(buffer);
}

module.exports = {
  getQuote,
  getSwapTransaction,
  buildBuyTransaction,
  buildSellTransaction,
  getTokenPrice,
  deserializeTransaction,
  SOL_MINT
};


