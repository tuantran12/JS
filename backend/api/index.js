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

// Fix CORS configuration - properly configure allowed origins
const allowedOrigins = [
    'https://app.senkai.xyz',
    'https://www.app.senkai.xyz',
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  ].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
          // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
              callback(null, true);
      } else if (process.env.NODE_ENV !== 'production') {
              // Allow all in development
            callback(null, true);
      } else {
              callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
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
    timestamp: new Date().toISOString(),
    cors: 'enabled'
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
          error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
                  : err.message,
          status: statusCode
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel serverless
module.exports = app;
