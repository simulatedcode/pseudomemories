"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import { useGeo } from "../context/GeoContext";

const AboutIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
        <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const MissionIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 17L12 22L22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12L12 17L22 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const Header = () => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const { latitude, longitude, error } = useGeo();

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
            className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-spacing-06 sm:px-spacing-08 py-spacing-05 text-offwhite-100"
        >
            <div className="flex items-center">
                <motion.div
                    onMouseEnter={() => setHoveredItem("Logo")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-default"
                >
                    <span className="font-electrolize cursor-pointer text-caption uppercase tracking-tighter opacity-80">
                        <ScrambleText text="pseudo memories" delay={1} duration={1.2} trigger={hoveredItem === "Logo"} />
                    </span>
                </motion.div>
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
                <motion.div
                    onMouseEnter={() => setHoveredItem("Location")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-default"
                >
                    <span className="font-doto text-caption uppercase tracking-[0.2em] opacity-80">
                        <ScrambleText text={locationString} delay={1.5} duration={1.5} />
                    </span>
                </motion.div>
            </div>

            <nav className="flex items-center gap-spacing-06 sm:gap-spacing-10">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setHoveredItem("About")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center gap-spacing-02 group focus:outline-none"
                >
                    <AboutIcon />
                    <span className="font-electrolize cursor-pointer text-micro uppercase tracking-widest hidden sm:inline">
                        <ScrambleText text="About" delay={0.5} duration={0.8} trigger={hoveredItem === "About"} />
                    </span>
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setHoveredItem("Mission")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center gap-spacing-02 group focus:outline-none"
                >
                    <MissionIcon />
                    <span className="font-electrolize cursor-pointer text-micro uppercase tracking-widest hidden sm:inline">
                        <ScrambleText text="Mission" delay={0.7} duration={0.8} trigger={hoveredItem === "Mission"} />
                    </span>
                </motion.button>
            </nav>
        </motion.header>
    );
};
