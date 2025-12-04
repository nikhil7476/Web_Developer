/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    domains: ["niktech-portfolio.vercel.app"],
  },
};

export default nextConfig;
