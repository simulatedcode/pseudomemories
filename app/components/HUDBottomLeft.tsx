"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { SystemMetrics } from "./SystemMetrics";
import { useGeo } from "../context/GeoContextCore";

interface HUDBottomLeftProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDBottomLeft({ hoveredItem, setHoveredItem }: HUDBottomLeftProps) {
    const { latitude, longitude, error } = useGeo();
    const [currentTime, setCurrentTime] = useState("");

    const locationString = error || `${latitude.toFixed(4)}°N ${longitude.toFixed(4)}°E`;

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
            });
            setCurrentTime(formatter.format(now));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed left-12 bottom-10 z-[100] flex flex-col gap-2 pointer-events-none">
            {/* Box 1: Time & Geo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: duration.medium,
                    delay: 1.8,
                    ease: easing.entrance,
                }}
                className="pointer-events-auto bg-background/40 backdrop-blur-lg border border-white/10 p-4 min-w-[180px]"
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-doto text-[10px] uppercase tracking-widest text-ultramarine-100/80">Date & Time</span>
                        <span className="font-doto text-[10px] text-ultramarine-100/80">
                            <ScrambleText text={currentTime} delay={2} />
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-doto text-[10px] uppercase tracking-widest text-ultramarine-100/80">Coordinate</span>
                        <span className="font-doto text-[10px] text-ultramarine-100/80">
                            <ScrambleText text={locationString} delay={2.2} />
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* Box 2: System Metrics */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: duration.medium,
                    delay: 2,
                    ease: easing.entrance,
                }}
                className="pointer-events-auto bg-background/40 backdrop-blur-lg border border-white/10 p-4 min-w-[180px]"
            >
                <div className="flex flex-col gap-2">
                    <span className="font-doto text-[10px] uppercase tracking-widest text-ultramarine-100
                    ">System Resources</span>
                    <SystemMetrics className="text-ultramarine-100/80" />
                </div>
            </motion.div>
        </div>
    );
}
