const express = require('express');
const router = express.Router();
const { calculateCommission, getCommissionRate } = require('../utils/referral');

const PACKAGES = {
  'starter': { name: 'Starter', monthlyUsd: 4.99, yearlyUsd: 49.99, dlowPoints: 10000 },
  'trader': { name: 'Trader', monthlyUsd: 19.99, yearlyUsd: 199.99, dlowPoints: 100000 },
  'expert': { name: 'Expert', monthlyUsd: 99.99, yearlyUsd: 999.99, dlowPoints: 500000 },
  'ultimate': { name: 'Ultimate', monthlyUsd: 999.99, yearlyUsd: 9999.99, dlowPoints: 2000000 }
};

router.get('/:address', async (req, res) => {
  const prisma = req.prisma;
  const { address } = req.params;
  const user = await prisma.user.findUnique({ where: { walletAddress: address } });
  if (!user) return res.json({ subscriptions: [], active: null });
  
  const subs = await prisma.subscription.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } });
  const now = new Date();
  const active = subs.find(s => s.status === 'active' && new Date(s.endDate) > now) || null;
  res.json({ subscriptions: subs, active });
});

router.post('/purchase', async (req, res) => {
  const prisma = req.prisma;
  const { walletAddress, packageName, packageType, priceUsd = 0, paymentToken = 'SOL', txSignature } = req.body;
  
  const pkgKey = (packageName || '').toLowerCase();
  const pkg = PACKAGES[pkgKey];
  if (!pkg) return res.status(400).json({ error: 'Invalid package' });

  let user = await prisma.user.findUnique({ where: { walletAddress }, include: { referralUsed: true } });
  if (!user) {
    user = await prisma.user.create({ data: { walletAddress, referralCode: walletAddress.slice(0, 8) } });
  }

  const expectedPrice = packageType === 'yearly' ? pkg.yearlyUsd : pkg.monthlyUsd;
  const finalPriceUsd = priceUsd || expectedPrice;

  const endDate = new Date();
  if (packageType === 'yearly') endDate.setFullYear(endDate.getFullYear() + 1);
  else endDate.setMonth(endDate.getMonth() + 1);

  const dlowAwarded = pkg.dlowPoints;

  const sub = await prisma.subscription.create({
    data: {
      userId: user.id, packageName: pkg.name, packageType, priceUsd: finalPriceUsd,
      priceSol: finalPriceUsd / 124, paymentToken, txSignature: txSignature || `pending-${Date.now()}`,
      dlowAwarded, endDate
    }
  });

  await prisma.user.update({ where: { id: user.id }, data: { dlowPoints: { increment: dlowAwarded } } });

  await prisma.transaction.create({
    data: { userId: user.id, type: 'purchase', token: paymentToken, amount: finalPriceUsd, txSignature: sub.txSignature, description: `${pkg.name} (${packageType})`, metadata: { dlowAwarded } }
  });

  // Handle referral commission
  if (user.referralUsed) {
    try {
      const referrer = await prisma.user.findUnique({ where: { id: user.referralUsed.referrerId }, include: { subscriptions: { where: { status: 'active' }, take: 1 } } });
      if (referrer) {
        const referrerPackage = referrer.subscriptions[0]?.packageName;
        const commissionRate = getCommissionRate(referrerPackage);
        const commission = calculateCommission(finalPriceUsd, commissionRate);

        await prisma.referral.update({ where: { id: user.referralUsed.id }, data: { totalEarned: { increment: commission } } });
        await prisma.transaction.create({ data: { userId: referrer.id, type: 'referral', token: 'USD', amount: commission, description: `Referral: ${walletAddress.slice(0, 6)}...` } });

        const referrerBonus = Math.floor(dlowAwarded * 0.1);
        await prisma.user.update({ where: { id: referrer.id }, data: { dlowPoints: { increment: referrerBonus } } });
      }
    } catch (e) { console.error('Referral error:', e); }
  }

  res.json({ success: true, subscription: sub, dlowAwarded });
});

router.get('/packages/list', (req, res) => {
  res.json({ packages: Object.values(PACKAGES) });
});

module.exports = router;
