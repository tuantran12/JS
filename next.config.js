/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@privy-io/react-auth'],
  output: 'standalone',
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false
    };
    return config;
  },
  // Vercel optimization
  compress: true,
  poweredByHeader: false,
  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp']
  }
};

module.exports = nextConfig;
