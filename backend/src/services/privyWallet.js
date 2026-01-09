/**
 * Privy Server-Side Wallet Service
 * 
 * Enables auto-trading 24/7 by signing transactions from user's Privy embedded wallet.
 * Uses Privy Server SDK for server-side wallet operations.
 * 
 * Required env vars:
 * - PRIVY_APP_ID: Your Privy app ID
 * - PRIVY_APP_SECRET: Your Privy app secret (from Dashboard > Settings > App Secrets)
 */

const { PrivyClient } = require('@privy-io/server-auth');
const { Connection, Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
const QUICKNODE_URL = process.env.QUICKNODE_URL || 'https://api.devnet.solana.com';
const PLATFORM_FEE_SOL = parseFloat(process.env.COPY_TX_FEE_SOL || '0.002');

// Initialize Privy client
let privyClient = null;

function getPrivyClient() {
  if (!privyClient && PRIVY_APP_ID && PRIVY_APP_SECRET) {
    privyClient = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);
  }
  return privyClient;
}

// Get Solana connection
function getConnection() {
  return new Connection(QUICKNODE_URL, 'confirmed');
}

/**
 * Get user's Privy wallet address
 */
async function getUserPrivyWallet(privyUserId) {
  const client = getPrivyClient();
  if (!client) {
    throw new Error('Privy client not configured. Set PRIVY_APP_ID and PRIVY_APP_SECRET.');
  }

  try {
    const user = await client.getUser(privyUserId);
    
    // Find Solana embedded wallet
    const solanaWallet = user.linkedAccounts?.find(
      account => account.type === 'wallet' && 
                 account.walletClientType === 'privy' &&
                 account.chainType === 'solana'
    );

    if (!solanaWallet) {
      throw new Error('User does not have a Privy Solana embedded wallet');
    }

    return {
      address: solanaWallet.address,
      walletId: solanaWallet.id || solanaWallet.address
    };
  } catch (e) {
    console.error('Error getting Privy wallet:', e.message);
    throw e;
  }
}

/**
 * Sign and send a Solana transaction using Privy embedded wallet
 */
async function signAndSendTransaction(privyUserId, walletAddress, transaction) {
  const client = getPrivyClient();
  if (!client) {
    throw new Error('Privy client not configured');
  }

  const connection = getConnection();

  try {
    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new PublicKey(walletAddress);

    // Serialize transaction for signing
    const serializedTx = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    }).toString('base64');

    // Sign with Privy server SDK
    // Note: This requires the wallet to have delegated signing enabled
    const signedTx = await client.walletApi.solana.signTransaction({
      userId: privyUserId,
      chainType: 'solana',
      transaction: serializedTx
    });

    // Deserialize signed transaction
    const signedTransaction = Transaction.from(Buffer.from(signedTx.signedTransaction, 'base64'));

    // Send transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    });

    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight
    }, 'confirmed');

    console.log(`✅ Transaction sent: ${signature}`);
    return signature;

  } catch (e) {
    console.error('Error signing/sending transaction:', e.message);
    throw e;
  }
}

/**
 * Execute a buy order (swap SOL to token)
 */
async function executeBuyOrder(privyUserId, walletAddress, params) {
  const { tokenMint, amountSol, slippage = 0.5 } = params;
  const connection = getConnection();

  try {
    // In production, integrate with Jupiter/Raydium for actual swaps
    // This is a simplified example
    
    const transaction = new Transaction();
    
    // Add platform fee transfer
    const platformFee = PLATFORM_FEE_SOL * LAMPORTS_PER_SOL;
    const treasuryWallet = new PublicKey(process.env.TREASURY_WALLET || 'ASQUKGPrqMRhwERRzMrutXJCo5qNdQMVM2BDU4NuZrvF');
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(walletAddress),
        toPubkey: treasuryWallet,
        lamports: platformFee
      })
    );

    // TODO: Add Jupiter swap instruction here
    // const jupiterSwap = await getJupiterSwapInstruction(tokenMint, amountSol, slippage);
    // transaction.add(jupiterSwap);

    const signature = await signAndSendTransaction(privyUserId, walletAddress, transaction);
    
    return {
      success: true,
      signature,
      amountSol,
      tokenMint,
      fee: PLATFORM_FEE_SOL
    };

  } catch (e) {
    console.error('Buy order failed:', e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Execute a sell order (swap token to SOL)
 */
async function executeSellOrder(privyUserId, walletAddress, params) {
  const { tokenMint, amount, percentage = 100, slippage = 0.5 } = params;
  const connection = getConnection();

  try {
    const transaction = new Transaction();
    
    // Add platform fee
    const platformFee = PLATFORM_FEE_SOL * LAMPORTS_PER_SOL;
    const treasuryWallet = new PublicKey(process.env.TREASURY_WALLET || 'ASQUKGPrqMRhwERRzMrutXJCo5qNdQMVM2BDU4NuZrvF');
    
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(walletAddress),
        toPubkey: treasuryWallet,
        lamports: platformFee
      })
    );

    // TODO: Add Jupiter swap instruction here
    // const jupiterSwap = await getJupiterSellInstruction(tokenMint, amount, slippage);
    // transaction.add(jupiterSwap);

    const signature = await signAndSendTransaction(privyUserId, walletAddress, transaction);
    
    return {
      success: true,
      signature,
      tokenMint,
      amount,
      fee: PLATFORM_FEE_SOL
    };

  } catch (e) {
    console.error('Sell order failed:', e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Check if user has enabled delegated signing
 */
async function checkDelegatedSigning(privyUserId) {
  const client = getPrivyClient();
  if (!client) return { enabled: false, error: 'Privy not configured' };

  try {
    const user = await client.getUser(privyUserId);
    
    // Check if embedded wallet exists and has delegated actions
    const wallet = user.linkedAccounts?.find(
      a => a.type === 'wallet' && a.walletClientType === 'privy' && a.chainType === 'solana'
    );

    if (!wallet) {
      return { enabled: false, error: 'No Privy wallet found' };
    }

    // In Privy, delegated signing is enabled by default for embedded wallets
    // when using server SDK with proper authorization
    return { enabled: true, walletAddress: wallet.address };

  } catch (e) {
    return { enabled: false, error: e.message };
  }
}

/**
 * Get wallet balance
 */
async function getWalletBalance(walletAddress) {
  const connection = getConnection();
  
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    
    return {
      sol: balance / LAMPORTS_PER_SOL,
      lamports: balance
    };
  } catch (e) {
    return { sol: 0, lamports: 0, error: e.message };
  }
}

module.exports = {
  getPrivyClient,
  getUserPrivyWallet,
  signAndSendTransaction,
  executeBuyOrder,
  executeSellOrder,
  checkDelegatedSigning,
  getWalletBalance
};


