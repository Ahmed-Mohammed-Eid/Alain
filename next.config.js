/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'https://alain.kportals.net/api/v1'
    },
    images: {
        remotePatterns: [
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'https',
                hostname: 'alain.kportals.net'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'http',
                hostname: 'alain.kportals.net'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'https',
                hostname: 'kportals.net'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'http',
                hostname: 'kportals.net'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'https',
                hostname: 'alderwaza.kportals.net'
            },
            {
                // ALL IMAGES FROM ALL DOMAINS
                protocol: 'http',
                hostname: 'alderwaza.kportals.net'
            }
        ]
    }
};

module.exports = nextConfig;
