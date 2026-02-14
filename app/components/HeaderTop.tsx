"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { SystemMetrics } from "./SystemMetrics";
import pkg from "../../package.json";

interface HeaderTopProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HeaderTop({ hoveredItem, setHoveredItem }: HeaderTopProps) {
    const [version] = useState(`v${pkg.version}`);
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const formatter = new Intl.DateTimeFormat("en-US", {
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: userTimeZone,
                timeZoneName: "short",
            });

            setCurrentTime(formatter.format(now));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="fixed top-8 left-12 z-[100] flex flex-col pointer-events-none"
        >
            {/* Logo/Title */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: duration.medium,
                    ease: easing.entrance,
                    delay: 0.2
                }}
                className="pointer-events-auto"
                onMouseEnter={() => setHoveredItem("Logo")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <Link
                    href="/"
                    className="font-electrolize text-h5 uppercase tracking-widest text-white mix-blend-defference opacity-80 hover:opacity-100 transition-opacity"
                >
                    <ScrambleText
                        text="pseudo memories"
                        delay={1.2}
                        duration={1.2}
                        trigger={hoveredItem === "Logo"}
                    />
                </Link>
            </motion.div>

            {/* Version */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: duration.medium,
                    ease: easing.entrance,
                    delay: 0.4
                }}
                className="pointer-events-auto font-doto text-micro uppercase tracking-[0.2em] text-white/80 hover:text-white/90 transition-opacity cursor-default"
                onMouseEnter={() => setHoveredItem("Version")}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <ScrambleText
                    text={version}
                    delay={1.8}
                    duration={1.5}
                    trigger={hoveredItem === "Version"}
                />
            </motion.div>
        </div>
    );
}
