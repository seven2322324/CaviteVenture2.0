/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable image optimization, allowing all external images without restrictions
    unoptimized: true, 

    // This allows Next.js to load images from any external domain
    remotePatterns: [
      {
        protocol: 'https',       // Allow all images served over HTTPS
        hostname: '**',          // Allow any hostname
        port: '',                // Default port (empty allows any port)
        pathname: '**',          // Allow any path
      },
      {
        protocol: 'http',        // Allow all images served over HTTP
        hostname: '**',          // Allow any hostname
        port: '',                // Default port (empty allows any port)
        pathname: '**',          // Allow any path
      },
    ],
  },
};

export default nextConfig;
