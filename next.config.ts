import type { NextConfig } from "next";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function uploadPattern(): RemotePattern[] {
  try {
    const url = new URL(apiBase);
    const protocol = url.protocol === "https:" ? "https" : "http";

    return [
      {
        protocol,
        hostname: url.hostname,
        ...(url.port ? { port: url.port } : {}),
        pathname: "/uploads/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/**",
      },
      ...uploadPattern(),
    ],
  },
};

export default nextConfig;
