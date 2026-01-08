const express = require('express');
const router = express.Router();

// GET /api/transactions/:address - Get user transactions
router.get('/:address', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;
  const { type, limit = 50 } = req.query;

  const user = await prisma.user.findUnique({ where: { walletAddress: address } });
  if (!user) return res.json({ transactions: [] });

  let where = { userId: user.id };
  if (type) where.type = type;

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit)
  });

  res.json({ transactions });
});

// GET /api/transactions/:address/summary - Get summary
router.get('/:address/summary', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;

  const user = await prisma.user.findUnique({ where: { walletAddress: address } });
  if (!user) return res.json({ summary: {} });

  const allTx = await prisma.transaction.findMany({ where: { userId: user.id } });

  const summary = {
    totalTransactions: allTx.length,
    purchases: allTx.filter(t => t.type === 'purchase').length,
    stakes: allTx.filter(t => t.type === 'stake').length,
    unstakes: allTx.filter(t => t.type === 'unstake').length,
    referrals: allTx.filter(t => t.type === 'referral').length,
    copyLive: allTx.filter(t => t.type === 'copy_live').length,
    copySim: allTx.filter(t => t.type === 'copy_sim').length,
    dlowBurns: allTx.filter(t => t.type === 'dlow_burn').reduce((s, t) => s + t.amount, 0)
  };

  res.json({ summary });
});

module.exports = router;
