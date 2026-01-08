const { PublicKey } = require('@solana/web3.js');

function isValidSolanaAddress(address) {
  if (!address || typeof address !== 'string') return false;
  if (address.length < 32 || address.length > 44) return false;
  try { new PublicKey(address); return true; } catch { return false; }
}

function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength).replace(/[<>"'&]/g, '');
}

function isPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0 && isFinite(num);
}

function isValidReferralCode(code) {
  if (!code || typeof code !== 'string') return false;
  return /^[1-9A-HJ-NP-Za-km-z]{4,12}$/.test(code);
}

module.exports = { isValidSolanaAddress, sanitizeString, isPositiveNumber, isValidReferralCode };
