require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('../src/routes/auth');
const userRoutes = require('../src/routes/users');
const stakeRoutes = require('../src/routes/stakes');
const subscriptionRoutes = require('../src/routes/subscriptions');
const referralRoutes = require('../src/routes/referrals');
const transactionRoutes = require('../src/routes/transactions');
const copyRoutes = require('../src/routes/copy');
const marketRoutes = require('../src/routes/market');

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.VERCEL_URL || '*',
  credentials: true
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests' }
});
app.use('/api/', limiter);
app.use(express.json({ limit: '10kb' }));

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stakes', stakeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/copy', copyRoutes);
app.use('/api/market', marketRoutes);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString()
}));

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// Export for Vercel serverless
module.exports = app;
