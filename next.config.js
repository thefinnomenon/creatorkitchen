/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    dirs: ['.'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    // Unset client-side javascript that only works server-side
    config.resolve.fallback = {
      fs: false,
      module: false,
      path: false,
      querystring: false,
      os: false,
    };
    return config;
  },
};
