import type { NextConfig } from 'next';
const config: NextConfig = { images: { unoptimized: true }, devIndicators: false, turbopack: { root: process.cwd() }, outputFileTracingRoot: process.cwd() };
export default config;
