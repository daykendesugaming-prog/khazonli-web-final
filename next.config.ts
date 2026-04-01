import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uspyokeghrpwdccgkkcd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Agrega otros dominios si los necesitas
      {
        protocol: 'https',
        hostname: '**.supabase.co', // Para cualquier subdominio de Supabase
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Otras configuraciones que puedas tener
};

export default withNextIntl(nextConfig);