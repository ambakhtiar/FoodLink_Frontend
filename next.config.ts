import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "api.dicebear.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/auth/:path*",
                destination: `${process.env.NEXT_PUBLIC_API_URL}/auth/:path*`,
            },
        ];
    },
};

export default nextConfig;
