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
                sans: ["var(--font-plex)", "sans-serif"],
                plex: ["var(--font-plex)", "sans-serif"],
            },
            spacing: {
                "spacing-01": "0.125rem",
                "spacing-02": "0.25rem",
                "spacing-03": "0.5rem",
                "spacing-04": "0.75rem",
                "spacing-05": "1rem",
                "spacing-06": "1.5rem",
                "spacing-07": "2rem",
                "spacing-08": "2.5rem",
                "spacing-09": "3rem",
                "spacing-10": "4rem",
                "spacing-11": "5rem",
                "spacing-12": "6rem",
                "spacing-13": "10rem",
            },
        },
    },
    plugins: [],
};
export default config;
