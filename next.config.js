/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains : ["links.papareact.com","cloud.appwrite.io"]
    },
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig
