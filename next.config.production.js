/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.senkai.xyz',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Fix for packages that depend on `fs`, `net`, `tls` modules (Solana)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Ignore specific warnings from pino logger
    config.ignoreWarnings = [
      { module: /node_modules\/pino\/lib\/tools\.js/ },
      { module: /node_modules\/@solana/ },
    ];

    return config;
  },

  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://app.senkai.xyz',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'SENKAI',
  },

  // Security headers
  async headers() {
    return [
      // CORS for API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://unpkg.com https://auth.privy.io https://cdn.vercel-insights.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://*.supabase.co https://api.coingecko.com https://api.binance.com https://fapi.binance.com https://api.alternative.me https://api-inference.huggingface.co https://api.stripe.com https://auth.privy.io wss://*.supabase.co",
              "frame-src 'self' https://auth.privy.io https://verify.walletconnect.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Experimental features (optional)
  experimental: {
    // Enable server actions if needed
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Output configuration
  output: 'standalone', // Optimize for Docker/containerized deployments

  // Production source maps (disable for smaller builds)
  productionBrowserSourceMaps: false,

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // TypeScript strict mode
  typescript: {
    // Enable strict type checking
    ignoreBuildErrors: false,
  },

  // ESLint during build
  eslint: {
    // Enable ESLint checks during build
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
