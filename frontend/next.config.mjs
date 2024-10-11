/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    outputStandalone: true,
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'http://backend:3000/graphql',
      },
    ];
  },
}

export default nextConfig;