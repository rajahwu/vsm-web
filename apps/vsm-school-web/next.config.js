/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@ritual/ui-lib',
    '@ritual/brand',
    '@gttm/story',
    '@gttm/mission',
    '@gttm/codex'
  ],
};

module.exports = nextConfig;
