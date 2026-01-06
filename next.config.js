/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:['localhost','firebasestorage.googleapis.com']
    },
    // Force fresh builds - disable static optimization for landing page
    generateBuildId: async () => {
        return `build-${Date.now()}`
    }
}

module.exports = nextConfig
