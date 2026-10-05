import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {source:"/work/holoflux-coachella",destination:"/work/coachella",permanent:true},
      {source:"/work/the-sphere-las-vegas",destination:"/work/eagles-sphere",permanent:true},
      {source:"/services/spacial-projection-and-special-fx",destination:"/services/spatial-projection-and-special-fx",permanent:true},
    ];
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ...(process.env.VERCEL_ENV === "production" && process.env.SITE_INDEXABLE === "true"
          ? []
          : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]),
      ],
    }];
  },
};

export default nextConfig;
