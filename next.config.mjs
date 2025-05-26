import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache.js';

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gyzskfbyqbzfopfxejnh.supabase.co'],
  },
};

const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: runtimeCaching,
  buildExcludes: [/middleware-manifest\.json$/],
  fallbacks: {
    document: '/offline.html',
  },
});

export default pwaConfig(nextConfig);
