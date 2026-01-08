const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

// GET /api/users/:address - Get user data
router.get('/:address', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;

  const user = await prisma.user.findUnique({
    where: { walletAddress: address },
    include: {
      subscriptions: { where: { status: 'active' }, orderBy: { endDate: 'desc' }, take: 1 },
      stakes: { where: { status: 'active' } },
      referralsGiven: true
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const now = new Date();
  const activeSubscription = user.subscriptions.find(s => new Date(s.endDate) > now) || null;

  res.json({
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      email: user.email,
      referralCode: user.referralCode,
      dlowPoints: user.dlowPoints,
      createdAt: user.createdAt
    },
    activeSubscription,
    totalStaked: user.stakes.reduce((sum, s) => sum + s.amount, 0),
    totalReferrals: user.referralsGiven.length
  });
});

// GET /api/users/:address/stats - Get user stats
router.get('/:address/stats', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;

  const user = await prisma.user.findUnique({ where: { walletAddress: address } });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const [stakes, subs, referrals, positions, follows] = await Promise.all([
    prisma.stake.findMany({ where: { userId: user.id, status: 'active' } }),
    prisma.subscription.findMany({ where: { userId: user.id } }),
    prisma.referral.findMany({ where: { referrerId: user.id } }),
    prisma.position.findMany({ where: { userId: user.id } }),
    prisma.userFollow.count({ where: { userId: user.id, status: 'active' } })
  ]);

  const openPositions = positions.filter(p => p.status === 'open');
  const closedPositions = positions.filter(p => p.status === 'closed');

  res.json({
    dlowPoints: user.dlowPoints,
    totalStaked: stakes.reduce((s, st) => s + st.amount, 0),
    totalSubscriptionSpent: subs.reduce((s, sub) => s + sub.priceUsd, 0),
    totalReferrals: referrals.length,
    totalReferralEarned: referrals.reduce((s, r) => s + r.totalEarned, 0),
    copyTradingStats: {
      following: follows,
      openPositions: openPositions.length,
      closedPositions: closedPositions.length,
      totalPnl: closedPositions.reduce((s, p) => s + (p.pnl || 0), 0)
    }
  });
});

// POST /api/users/auto-trade - Toggle auto-trade setting
router.post('/auto-trade', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { enabled } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { autoTradeEnabled: !!enabled }
  });

  res.json({ success: true, autoTradeEnabled: user.autoTradeEnabled });
});

module.exports = router;
