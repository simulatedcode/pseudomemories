import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                "vermalion": {
                    50: "#FCEDE9",
                    100: "#F6CCC0",
                    200: "#F1AB98",
                    300: "#EB8A6F",
                    400: "#E35A34",
                    500: "#E0491F",
                    600: "#B83C19",
                    700: "#902E14",
                    800: "#67210E",
                    900: "#3F1409",
                    950: "#160703",
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
            },
            fontSize: {
                h1: ["60px", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "500" }],
                h2: ["48px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "500" }],
                h3: ["36px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "400" }],
                h4: ["24px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "400" }],
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
        },
    },
    plugins: [],
};
export default config;
