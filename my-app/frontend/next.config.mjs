import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    config.resolve.alias['pdfjs-dist'] = path.resolve(__dirname, 'node_modules/pdfjs-dist');

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5000/api/v1/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/pdf.worker.min.mjs',
        headers: [
          { key: 'Content-Type', value: 'application/javascript' },
        ],
      },
    ];
  },
};

export default nextConfig;
