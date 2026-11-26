import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Historical short links appear in GA4 and must reach the existing course.
        source: '/products/dongfunda-stock-analysis',
        destination: '/products/dongfunda-stock-analysis%28Online-Course%29',
        permanent: true,
      },
    ];
  },
  // Keep the owner's existing local build separate from this review server.
  distDir: process.env.DONGFUNDA_LOCAL_REVIEW === 'true' ? '.next-dongfunda-review' : '.next',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3-payso-images.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Local review uses next start with shared installed dependencies; Production retains standalone.
  output: process.env.DAP_LOCAL_PREVIEW === 'true' ? undefined : 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
