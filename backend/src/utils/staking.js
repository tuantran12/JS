/**
 * Staking Utility Functions
 */

const STAKING_CONFIG = {
  '60days': { apr: 15, lockDays: 60, penalty: 0 },
  'flexible': { apr: 9.5, lockDays: 0, waitDays: 3, earlyPenalty: 0.025 }
};

function calculateReward(amount, apr, stakedAt) {
  const now = new Date();
  const stakeDate = new Date(stakedAt);
  const daysStaked = Math.floor((now - stakeDate) / (1000 * 60 * 60 * 24));
  const reward = (apr / 100 / 365) * daysStaked * amount;
  return { reward: Math.max(0, reward), daysStaked };
}

function isStakeUnlocked(stakeType, stakedAt) {
  if (stakeType !== '60days') return true;
  const unlockDate = new Date(stakedAt);
  unlockDate.setDate(unlockDate.getDate() + STAKING_CONFIG['60days'].lockDays);
  return new Date() >= unlockDate;
}

function getUnlockDate(stakeType, stakedAt) {
  const date = new Date(stakedAt);
  if (stakeType === '60days') {
    date.setDate(date.getDate() + STAKING_CONFIG['60days'].lockDays);
  }
  return date;
}

function calculatePenalty(amount, stakeType, immediate) {
  if (stakeType === 'flexible' && immediate) {
    return amount * STAKING_CONFIG['flexible'].earlyPenalty;
  }
  return 0;
}

module.exports = { STAKING_CONFIG, calculateReward, isStakeUnlocked, getUnlockDate, calculatePenalty };


