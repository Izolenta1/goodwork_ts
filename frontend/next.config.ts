import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	async rewrites() {
		return [
			{
				source: "/api/:route*",
				destination: "http://localhost:3001/api/:route*",
			},
			{
				source: "/auth/:route*",
				destination: "http://localhost:3001/auth/:route*",
			},
			{
				source: "/static/:static*",
				destination: "http://localhost:3001/:static*",
			},
		];
	},
};

export default nextConfig;
