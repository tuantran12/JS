const express = require('express');
const router = express.Router();

router.get('/:address', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;
  const user = await prisma.user.findUnique({ where: { walletAddress: address }, include: { referralsGiven: { include: { referred: true } } } });
  if (!user) return res.json({ referralCode: address.slice(0, 8), totalReferrals: 0, totalRewards: 0, rewards: [] });

  const tx = await prisma.transaction.findMany({ where: { userId: user.id, type: 'referral' }, orderBy: { createdAt: 'desc' }, take: 50 });
  const totalRewards = tx.reduce((s, t) => s + (t.amount || 0), 0);

  const rewards = tx.map(t => ({
    id: t.id, referred_wallet: t.description || 'User', service: t.metadata?.packagePurchased || 'Package',
    reward_amount: t.amount, reward_token: t.token, created_at: t.createdAt
  }));

  res.json({ referralCode: user.referralCode, totalReferrals: user.referralsGiven.length, totalRewards, rewards });
});

router.post('/apply', async (req, res) => {
  const prisma = req.prisma;
  const { walletAddress, referralCode } = req.body;
  if (!walletAddress || !referralCode) return res.status(400).json({ error: 'Missing fields' });

  const user = await prisma.user.findUnique({ where: { walletAddress }, include: { referralUsed: true } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.referralUsed) return res.status(400).json({ error: 'Already used a referral code' });

  const referrer = await prisma.user.findFirst({ where: { referralCode } });
  if (!referrer || referrer.id === user.id) return res.status(400).json({ error: 'Invalid referral code' });

  await prisma.referral.create({ data: { referrerId: referrer.id, referredId: user.id, commissionRate: 0.10 } });
  await prisma.user.update({ where: { id: user.id }, data: { referredBy: referralCode } });

  res.json({ success: true, message: 'Referral code applied!' });
});

module.exports = router;
