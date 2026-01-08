/**
 * Referral Utility Functions
 */

function generateReferralCode(walletAddress) {
  if (!walletAddress) return null;
  return walletAddress.slice(0, 8);
}

function calculateCommission(amount, rate = 0.10) {
  return Math.round(amount * rate * 100) / 100;
}

function getCommissionRate(packageName) {
  const rates = {
    'starter': 0.10,
    'trader': 0.12,
    'expert': 0.15,
    'ultimate': 0.20
  };
  return rates[(packageName || '').toLowerCase()] || 0.10;
}

module.exports = { generateReferralCode, calculateCommission, getCommissionRate };


