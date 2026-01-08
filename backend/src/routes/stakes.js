const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { STAKING_CONFIG, calculateReward, isStakeUnlocked, getUnlockDate, calculatePenalty } = require('../utils/staking');

router.get('/:address', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;
  const user = await prisma.user.findUnique({ where: { walletAddress: address } });
  if (!user) return res.json({ stakes: [], unstakeRequests: [] });
  
  const stakes = await prisma.stake.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  const unstakeRequests = await prisma.unstakeRequest.findMany({ 
    where: { userId: user.id, status: { in: ['pending', 'claimable'] } }, 
    orderBy: { requestedAt: 'desc' } 
  });

  const stakesWithRewards = stakes.map(stake => {
    const { reward, daysStaked } = calculateReward(stake.amount, stake.apr, stake.stakedAt);
    const isUnlocked = isStakeUnlocked(stake.stakeType, stake.stakedAt);
    return {
      id: stake.id, token: stake.token, amount: stake.amount, stake_type: stake.stakeType,
      apr: stake.apr, status: stake.status, staked_at: stake.stakedAt, unlock_date: stake.unlockDate,
      current_reward: reward, days_staked: daysStaked, is_unlocked: isUnlocked
    };
  });

  res.json({ stakes: stakesWithRewards, unstakeRequests });
});

router.post('/', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const { walletAddress, token, amount, stakeType, txSignature } = req.body;
  if (!['SOL', 'USDC', 'USDT'].includes(token)) return res.status(400).json({ error: 'Invalid token' });
  if (!['60days', 'flexible'].includes(stakeType)) return res.status(400).json({ error: 'Invalid stake type' });
  if (amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

  let user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user) {
    user = await prisma.user.create({ data: { walletAddress, referralCode: walletAddress.slice(0, 8) } });
  }

  const apr = STAKING_CONFIG[stakeType].apr;
  const unlockDate = getUnlockDate(stakeType, new Date());

  const stake = await prisma.stake.create({
    data: { userId: user.id, token, amount, stakeType, apr, txSignature, unlockDate }
  });

  await prisma.transaction.create({
    data: { userId: user.id, type: 'stake', token, amount, txSignature, description: `Staked ${amount} ${token} (${stakeType})` }
  });

  res.json({ success: true, stake });
});

router.post('/unstake', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const { stakeId, walletAddress, immediate } = req.body;
  const user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const stake = await prisma.stake.findFirst({ where: { id: stakeId, userId: user.id, status: 'active' } });
  if (!stake) return res.status(404).json({ error: 'Stake not found' });

  if (stake.stakeType === '60days' && !isStakeUnlocked('60days', stake.stakedAt)) {
    return res.status(400).json({ error: 'Stake is still locked' });
  }

  const { reward } = calculateReward(stake.amount, stake.apr, stake.stakedAt);
  const penalty = calculatePenalty(stake.amount, stake.stakeType, immediate);
  
  let unlockAt = new Date();
  if (stake.stakeType === 'flexible' && !immediate) {
    unlockAt.setDate(unlockAt.getDate() + 3);
  }

  const unstakeRequest = await prisma.unstakeRequest.create({
    data: {
      stakeId: stake.id, userId: user.id, amount: stake.amount, reward: Math.max(0, reward - penalty),
      token: stake.token, penalty, immediate: !!immediate, unlockAt,
      status: immediate || stake.stakeType === '60days' ? 'claimable' : 'pending'
    }
  });

  await prisma.stake.update({ where: { id: stake.id }, data: { status: 'unstaking' } });

  res.json({ success: true, unstakeRequest });
});

router.post('/claim', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const { requestId, walletAddress, txSignature } = req.body;
  const user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const request = await prisma.unstakeRequest.findFirst({ where: { id: requestId, userId: user.id } });
  if (!request) return res.status(404).json({ error: 'Request not found' });
  if (new Date() < new Date(request.unlockAt)) return res.status(400).json({ error: 'Not yet claimable' });

  await prisma.unstakeRequest.update({ where: { id: requestId }, data: { status: 'claimed', claimedAt: new Date(), txSignature } });
  await prisma.stake.update({ where: { id: request.stakeId }, data: { status: 'completed' } });

  await prisma.transaction.create({
    data: { userId: user.id, type: 'unstake', token: request.token, amount: request.amount + request.reward, txSignature, description: `Claimed ${request.amount} ${request.token} + ${request.reward.toFixed(4)} reward` }
  });

  res.json({ success: true });
});

module.exports = router;
