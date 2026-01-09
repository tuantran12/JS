const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nacl = require('tweetnacl');
const bs58 = require('bs58');

const JWT_SECRET = process.env.JWT_SECRET || 'blowfi-secret-key-change-in-production';
const TOKEN_EXPIRY = '7d';

// Nonce store (use Redis in production)
const nonceStore = new Map();

// GET /api/auth/nonce - Get nonce for signing
router.get('/nonce/:address', (req, res) => {
  const { address } = req.params;
  const nonce = `Sign this message to authenticate with Blowfi: ${Date.now()}-${Math.random().toString(36).slice(2)}`;
  nonceStore.set(address, { nonce, createdAt: Date.now() });
  res.json({ nonce });
});

// POST /api/auth/verify - Verify signature and return JWT
router.post('/verify', async (req, res) => {
  const prisma = req.prisma;
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Verify nonce exists
  const storedNonce = nonceStore.get(walletAddress);
  if (!storedNonce || storedNonce.nonce !== message) {
    return res.status(401).json({ error: 'Invalid or expired nonce' });
  }

  // Verify signature
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(walletAddress);

    const valid = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
  } catch (e) {
    return res.status(401).json({ error: 'Signature verification failed' });
  }

  // Clean up nonce
  nonceStore.delete(walletAddress);

  // Find or create user
  let user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user) {
    user = await prisma.user.create({
      data: { walletAddress, referralCode: walletAddress.slice(0, 8) }
    });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id, walletAddress }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  res.json({ token, user: { id: user.id, walletAddress: user.walletAddress, dlowPoints: user.dlowPoints } });
});

// POST /api/auth/privy - Authenticate via Privy
router.post('/privy', async (req, res) => {
  const prisma = req.prisma;
  const { walletAddress, privyUserId, referralCode } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address required' });
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { walletAddress } });
  if (!user) {
    user = await prisma.user.create({
      data: { 
        walletAddress, 
        privyUserId: privyUserId || null,
        referralCode: walletAddress.slice(0, 8), 
        referredBy: referralCode || null,
        autoTradeEnabled: true
      }
    });

    // Create referral relation if code provided
    if (referralCode) {
      const referrer = await prisma.user.findFirst({ where: { referralCode } });
      if (referrer && referrer.id !== user.id) {
        await prisma.referral.create({
          data: { referrerId: referrer.id, referredId: user.id, commissionRate: 0.10 }
        }).catch(() => {});
      }
    }
  } else if (privyUserId && !user.privyUserId) {
    // Update Privy user ID if not set
    user = await prisma.user.update({
      where: { id: user.id },
      data: { privyUserId }
    });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user.id, walletAddress, privyUserId: user.privyUserId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

  res.json({ 
    token, 
    user: { 
      id: user.id, 
      walletAddress: user.walletAddress, 
      dlowPoints: user.dlowPoints, 
      referralCode: user.referralCode,
      autoTradeEnabled: user.autoTradeEnabled
    } 
  });
});

// POST /api/auth/refresh - Refresh token
router.post('/refresh', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    const newToken = jwt.sign({ userId: decoded.userId, walletAddress: decoded.walletAddress }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
    res.json({ token: newToken });
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
