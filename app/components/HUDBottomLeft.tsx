"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import { useTransition } from "../context/TransitionContextCore";

interface HUDBottomLeftProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDBottomLeft({ hoveredItem, setHoveredItem }: HUDBottomLeftProps) {
    const { latitude, longitude, error } = useGeo();
    const { isTransitioning } = useTransition();
    const [currentTime, setCurrentTime] = useState("");
    const [timeZone, setTimeZone] = useState("");

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const formatter = new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false, // Military time fits the aesthetic better
                timeZone: userTimeZone
            });
            setCurrentTime(formatter.format(now));
            setTimeZone(userTimeZone);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed left-spacing-07 bottom-spacing-07 z-hud flex flex-col gap-spacing-03 pointer-events-none">
            {/* Box 1: Info Location */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 20 : 0 }}
                transition={{
                    duration: isTransitioning ? 0.3 : duration.medium,
                    delay: isTransitioning ? 0 : 1.8,
                    ease: easing.entrance,
                }}
                className="pointer-events-auto bg-black/10 backdrop-blur-md border border-white/5 flex flex-col p-3 min-w-[180px] gap-spacing-03"
            >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="font-doto text-micro uppercase tracking-widest text-white/60">Info Location</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-spacing-02">
                    <div className="flex items-center justify-between gap-spacing-05">
                        <span className="font-doto text-micro uppercase tracking-widest text-white/40">Timestamp</span>
                        <span className="font-doto text-micro text-white" suppressHydrationWarning>
                            <ScrambleText text={currentTime} delay={2} />
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-spacing-05">
                        <span className="font-doto text-micro uppercase tracking-widest text-white/40">Zone</span>
                        <span className="font-doto text-micro text-white" suppressHydrationWarning>
                            <ScrambleText text={timeZone} delay={2.1} />
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-spacing-05">
                        <span className="font-doto text-micro uppercase tracking-widest text-white/40">Coords</span>
                        <span className="font-doto text-micro text-white" suppressHydrationWarning>
                            <ScrambleText text={locationString} delay={2.2} />
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
