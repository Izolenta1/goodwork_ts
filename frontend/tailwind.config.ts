import type { Config } from "tailwindcss";

export default {
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
            fontFamily: {
                mulish: ["Mulish", "sans-serif"]
            },
            screens: {
                'max1200px': { 'max': '1200px' },
                'max920px': { 'max': '920px' },
                'max750px': { 'max': '750px' },
                'max580px': { 'max': '580px' },
                'max450px': { 'max': '450px' },
            }
		},
	},
	plugins: [],
} satisfies Config;
