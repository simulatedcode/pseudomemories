import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                "vermilion": {
                    50: "#FCEDE9",
                    100: "#F6CCC0",
                    200: "#F1AB98",
                    300: "#EB8A6F",
                    400: "#E66947",
                    500: "#E0491F",
                    600: "#B83C19",
                    700: "#902E14",
                    800: "#67210E",
                    900: "#3F1409",
                    950: "#160703",
                },
                "cyan": {
                    50: "#E8FBFC",
                    100: "#BFF3F8",
                    200: "#95EBF3",
                    300: "#6CE4EF",
                    400: "#43DCEA",
                    500: "#21D7E7",
                    600: "#15AEBC",
                    700: "#108893",
                    800: "#0C626A",
                    900: "#073C40",
                    950: "#031517",
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
                micro: ["11px", { lineHeight: "1.2", fontWeight: "400" }],
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
                base: "0",
                content: "10",
                header: "100",
                hud: "100",
                overlay: "500",
                modal: "1000",
                intro: "1000",
                tooltip: "2000",
            },
        },
    },
    plugins: [typography],
};
export default config;
