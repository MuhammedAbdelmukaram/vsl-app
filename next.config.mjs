/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-c376537ae6c646e39fabf6d97ec84d7b.r2.dev',
                pathname: '/**', // Match everything from this hostname
            },
            {
                protocol: 'https',
                hostname: 'cdn.vslapp.pro',
                pathname: '/**', // Match everything from this hostname
            },
        ],
    },
};

export default nextConfig;
