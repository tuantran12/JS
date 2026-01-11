import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

/**
 * Validate if a string is a valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get SOL balance for a wallet address
 */
export async function getSolBalance(
  connection: Connection,
  publicKey: PublicKey
): Promise<number> {
  try {
    if (!publicKey) {
      throw new Error("Invalid public key");
    }

    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching SOL balance:", error);
    throw new Error("Failed to fetch SOL balance");
  }
}

/**
 * Get transaction history for a wallet address
 */
export async function getTransactionHistory(
  connection: Connection,
  publicKey: PublicKey,
  limit: number = 10
): Promise<any[]> {
  try {
    if (!publicKey) {
      throw new Error("Invalid public key");
    }

    const signatures = await connection.getSignaturesForAddress(publicKey, {
      limit,
    });

    const transactions = await Promise.all(
      signatures.map(async (sig) => {
        try {
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });
          return {
            signature: sig.signature,
            blockTime: sig.blockTime,
            slot: sig.slot,
            err: sig.err,
            transaction: tx,
          };
        } catch (error) {
          console.error(`Error fetching transaction ${sig.signature}:`, error);
          return null;
        }
      })
    );

    return transactions.filter((tx) => tx !== null);
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    throw new Error("Failed to fetch transaction history");
  }
}

/**
 * Get SPL token balances for a wallet address
 */
export async function getTokenBalances(
  connection: Connection,
  publicKey: PublicKey
): Promise<any[]> {
  try {
    if (!publicKey) {
      throw new Error("Invalid public key");
    }

    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    return tokenAccounts.value
      .map((accountInfo) => {
        const parsedInfo = accountInfo.account.data.parsed.info;
        return {
          mint: parsedInfo.mint,
          balance: parsedInfo.tokenAmount.uiAmount,
          decimals: parsedInfo.tokenAmount.decimals,
          address: accountInfo.pubkey.toString(),
        };
      })
      .filter((token) => token.balance && token.balance > 0);
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw new Error("Failed to fetch token balances");
  }
}

/**
 * Format SOL amount with proper decimals
 */
export function formatSolAmount(amount: number, decimals: number = 4): string {
  return amount.toFixed(decimals);
}

/**
 * Format wallet address (shortened)
 */
export function formatAddress(address: string, chars: number = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
