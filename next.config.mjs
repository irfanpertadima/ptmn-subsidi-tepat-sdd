/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Type and lint errors must fail the build, not be silently ignored.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
};

export default nextConfig;
