import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Aquí puedes poner otras opciones si las tenías
};

export default withNextIntl(nextConfig);