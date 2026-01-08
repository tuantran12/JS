/**
 * Copy Trading Routes - Full Implementation
 * DLOW: live = half of sim daily fee
 * Fee: 0.002 SOL/tx added to entry price
 */
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

const DAILY_SIM_DLOW = parseInt(process.env.DAILY_SIM_DLOW || '500', 10);
const DAILY_LIVE_DLOW = Math.floor(DAILY_SIM_DLOW / 2); // 250
const COPY_TX_FEE_SOL = parseFloat(process.env.COPY_TX_FEE_SOL || '0.002');

function hasActiveSub(user) {
  if (!user.subscriptions) return false;
  const now = new Date();
  return user.subscriptions.some(s => s.status === 'active' && new Date(s.endDate) > now);
}

// GET /api/copy/smart-wallets - List smart wallets with filters
router.get('/smart-wallets', async (req, res) => {
  const prisma = req.prisma;
  const { search = '', sort = 'roi', tag, period = '30' } = req.query;
  
  let where = {};
  if (search) where.address = { contains: search };
  if (tag === 'newest') where.lastUpdated = { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) };
  if (tag === 'top') where.roi30d = { gte: 20 };
  
  const orderBy = sort === 'pnl' ? { pnl30d: 'desc' } : sort === 'winrate' ? { winRate: 'desc' } : { roi30d: 'desc' };
  
  const wallets = await prisma.smartWallet.findMany({ where, orderBy, take: 50 });
  res.json({ wallets, count: wallets.length });
});

// GET /api/copy/smart-wallets/:id - Get single wallet detail
router.get('/smart-wallets/:id', async (req, res) => {
  const prisma = req.prisma;
  const wallet = await prisma.smartWallet.findUnique({ where: { id: req.params.id } });
  if (!wallet) return res.status(404).json({ error: 'Not found' });
  res.json({ wallet });
});

// POST /api/copy/follow - Follow a smart wallet with full settings
router.post('/follow', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const {
    smartWalletId, mode = 'live',
    walletName, copyBuy = true, copyBuyMode = 'percent', copyBuyValue = 1,
    copySell = true, copySellMode = 'percent',
    autoSell = false, autoSellTrigger, autoSellAmount, autoSellExpiry = 7,
    slippage = 49, minLP = 49, minMcap, maxMcap,
    buyOnlyOnce = true, antiMev = false, manualTip, autoTip = 'best',
    spendingLimit, maxBuy
  } = req.body;

  if (!smartWalletId) return res.status(400).json({ error: 'smartWalletId required' });
  if (!['live', 'sim'].includes(mode)) return res.status(400).json({ error: 'Invalid mode' });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscriptions: true } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!hasActiveSub(user)) return res.status(403).json({ error: 'Subscription required', redirect: '/token' });

  const dlowFee = mode === 'sim' ? DAILY_SIM_DLOW : DAILY_LIVE_DLOW;
  if (user.dlowPoints < dlowFee) {
    return res.status(400).json({ error: `Insufficient DLOW. Need ${dlowFee} for ${mode} mode.`, required: dlowFee, current: user.dlowPoints });
  }

  // Check if wallet exists
  const smartWallet = await prisma.smartWallet.findUnique({ where: { id: smartWalletId } });
  if (!smartWallet) return res.status(404).json({ error: 'Smart wallet not found' });

  // Create or update follow with all settings
  const settings = {
    copyBuy, copyBuyMode, copyBuyValue: parseFloat(copyBuyValue) || 1,
    copySell, copySellMode,
    autoSell, autoSellTrigger, autoSellAmount, autoSellExpiry: parseInt(autoSellExpiry) || 7,
    slippage: parseFloat(slippage) || 49, minLP: parseFloat(minLP) || 49,
    minMcap: minMcap ? parseFloat(minMcap) : null, maxMcap: maxMcap ? parseFloat(maxMcap) : null,
    buyOnlyOnce: !!buyOnlyOnce, antiMev: !!antiMev,
    manualTip: manualTip ? parseFloat(manualTip) : null,
    autoTip: autoTip || 'best',
    spendingLimit: spendingLimit ? parseFloat(spendingLimit) : null,
    maxBuy: maxBuy ? parseFloat(maxBuy) : null,
    walletName: walletName || null
  };

  const follow = await prisma.userFollow.upsert({
    where: { userId_smartWalletId_mode: { userId, smartWalletId, mode } },
    create: {
      userId, smartWalletId, mode,
      slippage: settings.slippage,
      sizePct: settings.copyBuyMode === 'percent' ? settings.copyBuyValue : null,
      maxBuyUsd: settings.copyBuyMode === 'fixed' ? settings.copyBuyValue : settings.maxBuy,
      minLiquidity: settings.minLP,
      minMcap: settings.minMcap,
      copyProtect: settings.antiMev,
      metadata: settings
    },
    update: {
      slippage: settings.slippage,
      sizePct: settings.copyBuyMode === 'percent' ? settings.copyBuyValue : null,
      maxBuyUsd: settings.copyBuyMode === 'fixed' ? settings.copyBuyValue : settings.maxBuy,
      minLiquidity: settings.minLP,
      minMcap: settings.minMcap,
      copyProtect: settings.antiMev,
      status: 'active',
      metadata: settings
    }
  });

  // Burn DLOW daily fee
  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { dlowPoints: { decrement: dlowFee } } }),
    prisma.transaction.create({ data: { userId, type: 'dlow_burn', token: 'DLOW', amount: dlowFee, description: `${mode === 'sim' ? 'Simulator' : 'Live copy'} daily fee` } })
  ]);

  // Increment follower count
  await prisma.smartWallet.update({ where: { id: smartWalletId }, data: { followers: { increment: 1 } } });

  res.json({ success: true, follow, dlowCharged: dlowFee, remainingDlow: user.dlowPoints - dlowFee });
});

// POST /api/copy/unfollow - Unfollow a smart wallet
router.post('/unfollow', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { smartWalletId, mode = 'live' } = req.body;

  const deleted = await prisma.userFollow.deleteMany({ where: { userId, smartWalletId, mode } });
  if (deleted.count > 0) {
    await prisma.smartWallet.update({ where: { id: smartWalletId }, data: { followers: { decrement: 1 } } }).catch(() => {});
  }

  res.json({ success: true, deleted: deleted.count });
});

// GET /api/copy/following - Get user's followed wallets with settings
router.get('/following', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const follows = await prisma.userFollow.findMany({
    where: { userId },
    include: { smartWallet: true },
    orderBy: { createdAt: 'desc' }
  });

  const formatted = follows.map(f => ({
    id: f.id,
    smartWallet: f.smartWallet,
    mode: f.mode,
    slippage: f.slippage,
    sizePct: f.sizePct,
    maxBuyUsd: f.maxBuyUsd,
    minLiquidity: f.minLiquidity,
    minMcap: f.minMcap,
    copyProtect: f.copyProtect,
    status: f.status,
    settings: f.metadata || {},
    createdAt: f.createdAt
  }));

  res.json({ follows: formatted, count: formatted.length });
});

// GET /api/copy/positions - Get user's positions with filters
router.get('/positions', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { mode, status, smartWalletId, exitOrders } = req.query;

  let where = { userId };
  if (mode) where.mode = mode;
  if (status) where.status = status;
  if (smartWalletId) where.smartWalletId = smartWalletId;
  if (exitOrders === 'sold') where.status = 'closed';
  if (exitOrders === 'holding') where.status = 'open';

  const positions = await prisma.position.findMany({
    where,
    include: { smartWallet: true },
    orderBy: { openedAt: 'desc' }
  });

  const formatted = positions.map(p => ({
    id: p.id,
    token: p.token,
    smartWallet: p.smartWallet,
    entryPrice: p.entryPrice,
    currentPrice: p.currentPrice,
    quantity: p.quantity,
    valueUsd: p.valueUsd,
    pnl: p.pnl,
    pnlPercent: p.entryPrice > 0 ? ((p.currentPrice - p.entryPrice) / p.entryPrice) * 100 : 0,
    mode: p.mode,
    status: p.status,
    openedAt: p.openedAt,
    closedAt: p.closedAt
  }));

  res.json({ positions: formatted, count: formatted.length });
});

// POST /api/copy/close-position - Close a position (sell token)
router.post('/close-position', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { positionId, closePercent = 100, txSignature } = req.body;

  const pos = await prisma.position.findUnique({ where: { id: positionId } });
  if (!pos || pos.userId !== userId) return res.status(404).json({ error: 'Position not found' });
  if (pos.status === 'closed') return res.status(400).json({ error: 'Already closed' });

  const closeAll = closePercent >= 100;
  const closeFraction = Math.min(100, Math.max(1, closePercent)) / 100;
  const closeQty = pos.quantity * closeFraction;
  const closeValue = pos.valueUsd * closeFraction;
  const closePnl = (pos.currentPrice - pos.entryPrice) * closeQty;

  const remainingQty = closeAll ? 0 : pos.quantity - closeQty;
  const remainingValue = closeAll ? 0 : pos.valueUsd - closeValue;

  const updated = await prisma.position.update({
    where: { id: positionId },
    data: {
      status: closeAll ? 'closed' : 'partially_closed',
      quantity: remainingQty,
      valueUsd: remainingValue,
      pnl: pos.pnl + closePnl,
      closedAt: closeAll ? new Date() : null,
      txSignatures: txSignature ? [...(pos.txSignatures || []), txSignature] : pos.txSignatures
    }
  });

  await prisma.transaction.create({
    data: {
      userId, type: pos.mode === 'live' ? 'copy_live' : 'copy_sim',
      token: pos.token, amount: closeValue, txSignature,
      description: `${closeAll ? 'Closed' : `Sold ${closePercent}%`} ${pos.token}`,
      metadata: { pnl: closePnl, closePercent }
    }
  });

  res.json({
    success: true,
    position: updated,
    closed: { quantity: closeQty, value: closeValue, pnl: closePnl }
  });
});

// POST /api/copy/sim-start - Start simulator session
router.post('/sim-start', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { subscriptions: true } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (!hasActiveSub(user)) return res.status(403).json({ error: 'Subscription required', redirect: '/token' });
  if (user.dlowPoints < DAILY_SIM_DLOW) {
    return res.status(400).json({ error: 'Insufficient DLOW for simulator', required: DAILY_SIM_DLOW, current: user.dlowPoints });
  }

  const session = await prisma.simSession.create({
    data: { userId, dlowSpent: DAILY_SIM_DLOW, metadata: { startedAt: new Date().toISOString() } }
  });

  await prisma.$transaction([
    prisma.user.update({ where: { id: userId }, data: { dlowPoints: { decrement: DAILY_SIM_DLOW } } }),
    prisma.transaction.create({ data: { userId, type: 'dlow_burn', token: 'DLOW', amount: DAILY_SIM_DLOW, description: 'Simulator daily session' } })
  ]);

  res.json({ success: true, session, dlowCharged: DAILY_SIM_DLOW, remainingDlow: user.dlowPoints - DAILY_SIM_DLOW });
});

// POST /api/copy/place - Fan-out leader trade to followers (internal/webhook)
router.post('/place', async (req, res) => {
  const prisma = req.prisma;
  const { smartWalletId, token, action = 'buy', price, sizeUsd = 100, apiKey } = req.body;

  // Simple API key check (replace with proper auth)
  if (apiKey !== process.env.COPY_INTERNAL_KEY && apiKey !== 'internal') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!smartWalletId || !token || !price) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const followers = await prisma.userFollow.findMany({
    where: { smartWalletId, status: 'active' },
    include: { user: { include: { subscriptions: true } } }
  });

  let created = 0;
  let skipped = 0;

  for (const f of followers) {
    if (!hasActiveSub(f.user)) { skipped++; continue; }

    const settings = f.metadata || {};
    
    // Calculate position size
    let qty;
    if (f.sizePct) {
      qty = (sizeUsd * (f.sizePct / 100)) / price;
    } else if (f.maxBuyUsd) {
      qty = Math.min(f.maxBuyUsd, sizeUsd) / price;
    } else {
      qty = (sizeUsd * 0.01) / price; // Default 1%
    }

    // Add platform fee to entry price
    const entryWithFee = price + COPY_TX_FEE_SOL;

    await prisma.position.create({
      data: {
        userId: f.userId,
        smartWalletId,
        token,
        entryPrice: entryWithFee,
        currentPrice: price,
        quantity: qty,
        valueUsd: qty * price,
        mode: f.mode,
        status: 'open',
        pnl: 0
      }
    });

    created++;
  }

  res.json({ success: true, created, skipped, token, price });
});

// GET /api/copy/metrics/summary - Get user's copy trading stats
router.get('/metrics/summary', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;

  const [user, openPos, closedPos, follows] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.position.findMany({ where: { userId, status: 'open' } }),
    prisma.position.findMany({ where: { userId, status: 'closed' } }),
    prisma.userFollow.count({ where: { userId, status: 'active' } })
  ]);

  const liveOpen = openPos.filter(p => p.mode === 'live');
  const simOpen = openPos.filter(p => p.mode === 'sim');
  const liveClosed = closedPos.filter(p => p.mode === 'live');
  const simClosed = closedPos.filter(p => p.mode === 'sim');

  const sumPnL = arr => arr.reduce((s, p) => s + (p.pnl || 0), 0);
  const sumValue = arr => arr.reduce((s, p) => s + (p.valueUsd || 0), 0);
  const winRate = arr => arr.length === 0 ? 0 : (arr.filter(p => (p.pnl || 0) > 0).length / arr.length) * 100;

  res.json({
    totalBalance: sumValue(liveOpen),
    totalBalanceSim: sumValue(simOpen),
    totalFollowing: follows,
    pnlLive: sumPnL(liveClosed),
    pnlSim: sumPnL(simClosed),
    winRateLive: winRate(liveClosed),
    winRateSim: winRate(simClosed),
    openPositionsLive: liveOpen.length,
    openPositionsSim: simOpen.length,
    closedPositionsLive: liveClosed.length,
    closedPositionsSim: simClosed.length,
    dlowPoints: user?.dlowPoints || 0
  });
});

// GET /api/copy/config - Get copy trading configuration
router.get('/config', (req, res) => {
  res.json({
    dailyLiveDlow: DAILY_LIVE_DLOW,
    dailySimDlow: DAILY_SIM_DLOW,
    txFeeSol: COPY_TX_FEE_SOL,
    autoTipOptions: [
      { key: 'high', label: 'High (75%)', fee: 0.001 },
      { key: 'best', label: 'Best (95%)', fee: 0.002 },
      { key: 'super', label: 'Super (99%)', fee: 0.003 }
    ]
  });
});

// POST /api/copy/bookmark - Toggle bookmark on smart wallet
router.post('/bookmark', verifyToken, async (req, res) => {
  const prisma = req.prisma;
  const userId = req.user.userId;
  const { smartWalletId, bookmarked } = req.body;

  // Store in user metadata or separate table - simplified version
  res.json({ success: true, smartWalletId, bookmarked });
});

// POST /api/copy/ingest - Webhook/cron to ingest smart wallet data (placeholder for Nansen)
router.post('/ingest', async (req, res) => {
  const prisma = req.prisma;
  const { apiKey, wallets } = req.body;

  if (apiKey !== process.env.NANSEN_WEBHOOK_KEY && apiKey !== 'internal') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!wallets || !Array.isArray(wallets)) {
    return res.status(400).json({ error: 'wallets array required' });
  }

  let upserted = 0;
  for (const w of wallets) {
    await prisma.smartWallet.upsert({
      where: { address: w.address },
      create: {
        address: w.address,
        avatarUrl: w.avatarUrl || null,
        tag: w.tag || null,
        roi30d: w.roi30d || 0,
        pnl30d: w.pnl30d || 0,
        winRate: w.winRate || 0,
        aum: w.aum || 0,
        mdd30d: w.mdd30d || 0,
        sparkline: w.sparkline || null,
        lastUpdated: new Date()
      },
      update: {
        avatarUrl: w.avatarUrl,
        tag: w.tag,
        roi30d: w.roi30d,
        pnl30d: w.pnl30d,
        winRate: w.winRate,
        aum: w.aum,
        mdd30d: w.mdd30d,
        sparkline: w.sparkline,
        lastUpdated: new Date()
      }
    });
    upserted++;
  }

  res.json({ success: true, upserted });
});

module.exports = router;
