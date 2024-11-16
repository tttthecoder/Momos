/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Disables image optimization and allows all external images
  },
};

module.exports = nextConfig;
