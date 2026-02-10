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
            className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-spacing-08 py-spacing-06 text-offwhite-100"
        >
            <div className="flex items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredItem("Logo")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-default"
                >
                    <span className="font-electrolize cursor-pointer text-caption uppercase tracking-[0.2em] opacity-80 hover:opacity-100 transition-opacity">
                        <Link href="/" className="cursor-pointer">
                            <ScrambleText text="pseudo memories" delay={1.2} duration={1.2} trigger={hoveredItem === "Logo"} />
                        </Link>
                    </span>
                </motion.div>
            </div>

            <div className="fixed left-spacing-08 top-20 md:top-6 md:left-1/2 md:-translate-x-1/2 pointer-events-none text-left md:text-center z-40">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredItem("Location")}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="cursor-default pointer-events-auto"
                >
                    <span className="font-doto text-micro md:text-caption uppercase tracking-[0.4em] opacity-60 hover:opacity-100 transition-opacity">
                        <ScrambleText text={locationString} delay={1.8} duration={1.5} trigger={hoveredItem === "Location"} />
                    </span>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
            >
                <Navigation />
            </motion.div>
        </motion.header>
    );
};
