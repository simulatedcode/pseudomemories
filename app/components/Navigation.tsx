"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";

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

export const Navigation = () => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <nav className="flex items-center gap-spacing-04 sm:gap-spacing-06 md:gap-spacing-08 lg:gap-spacing-10">
            <motion.button
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredItem("About")}
                onMouseLeave={() => setHoveredItem(null)}
                className="flex items-center gap-spacing-02 group focus:outline-none"
                aria-label="About"
            >
                <div className="p-2 sm:p-0">
                    <AboutIcon />
                </div>
                <span className="font-electrolize cursor-pointer text-micro uppercase tracking-widest hidden sm:inline">
                    <ScrambleText text="About" delay={0.5} duration={0.8} trigger={hoveredItem === "About"} />
                </span>
            </motion.button>
            <motion.button
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredItem("Mission")}
                onMouseLeave={() => setHoveredItem(null)}
                className="flex items-center gap-spacing-02 group focus:outline-none"
                aria-label="Mission"
            >
                <div className="p-2 sm:p-0">
                    <MissionIcon />
                </div>
                <span className="font-electrolize cursor-pointer text-micro uppercase tracking-widest hidden sm:inline">
                    <ScrambleText text="Mission" delay={0.7} duration={0.8} trigger={hoveredItem === "Mission"} />
                </span>
            </motion.button>
        </nav>
    );
};
