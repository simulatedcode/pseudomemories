"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import Link from "next/link";

import { Navigation } from "./Navigation";

export function Header() {
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
                        <Link href="/" className="cursor-pointer hover:text-vermelion-400">
                            <ScrambleText text="pseudo memories" delay={1} duration={1.2} trigger={hoveredItem === "Logo"} />
                        </Link>
                    </span>
                </motion.div>
            </div>

            <div className="fixed left-spacing-06 top-16 md:top-4 md:left-1/2 md:-translate-x-1/2 pointer-events-none text-left md:text-center text-offwhite-100 z-40">
                <motion.div
                    onMouseEnter={() => setHoveredItem("Location")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-default pointer-events-auto"
                >
                    <span className="font-doto text-caption uppercase tracking-[0.2em] opacity-90 sm:text-body">
                        <ScrambleText text={locationString} delay={1.5} duration={1.5} trigger={hoveredItem === "Location"} />
                    </span>
                </motion.div>
            </div>

            <Navigation />
        </motion.header>
    );
};
