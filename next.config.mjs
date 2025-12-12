/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },

  env: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL || '',
  },

  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'date-fns'],
  },
};

export default nextConfig;

