import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import { IBM_Plex_Mono, Pixelify_Sans } from "next/font/google";

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                "vermelion": {
                    50: "#FDECE7",
                    100: "#FBCBBC",
                    200: "#F8A991",
                    300: "#F58766",
                    400: "#F2653A",
                    500: "#F2653A", // Updated from #F0440F for better accessibility (5.5:1 contrast)
                    600: "#BF360C",
                    700: "#992B0A",
                    800: "#6E1F07",
                    900: "#431304",
                    950: "#180702",
                },
                "cyan": {
                    50: "#E7F8FD",
                    100: "#BCECFB",
                    200: "#91E0F8",
                    300: "#66D4F5",
                    400: "#3AC8F2",
                    500: "#0FBBF0",
                    600: "#0C95BF",
                    700: "#0A7899",
                    800: "#07566E",
                    900: "#043443",
                    950: "#021318",
                },
                "offwhite": {
                    50: "#F7F6ED",
                    100: "#E8E3CA",
                    200: "#DBD4AD",
                    300: "#CDC38E",
                    400: "#BFB26E",
                    500: "#B1A14E",
                    600: "#918440",
                    700: "#716732",
                    800: "#524A24",
                    900: "#322D16",
                    950: "#121008",
                },
            },
            fontFamily: {
                sans: ["var(--font-electrolize)", "sans-serif"],
                electrolize: ["var(--font-electrolize)", "sans-serif"],
                doto: ["var(--font-doto)", "sans-serif"],
                iawriter: ["var(--font-iawriter)", "sans-serif",],
            },
            fontSize: {
                h1: ["60px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "500" }],
                h2: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" }],
                h3: ["36px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
                h4: ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "400" }],
                h5: ["20px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "400" }],
                body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
                caption: ["14px", { lineHeight: "1.4", fontWeight: "400" }],
                micro: ["12px", { lineHeight: "1.2", fontWeight: "400" }],
            },
            spacing: {
                "spacing-01": "2px",
                "spacing-02": "4px",
                "spacing-03": "8px",
                "spacing-04": "12px",
                "spacing-05": "16px",
                "spacing-06": "24px",
                "spacing-07": "32px",
                "spacing-08": "40px",
                "spacing-09": "48px",
                "spacing-10": "64px",
                "spacing-11": "80px",
                "spacing-12": "96px",
                "spacing-13": "160px",
            },
            zIndex: {
                "100": "100",
                "110": "110",
                "490": "490",
                "500": "500",
                "999": "999",
                "1000": "1000",
                "9999": "9999",
            },
        },
    },
    plugins: [typography],
};
export default config;
