"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import { useTransition } from "../context/TransitionContext";

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
                month: "numeric",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
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
        <div className="fixed left-12 bottom-10 z-[100] flex flex-col gap-2 pointer-events-none">
            {/* Box 1: Time & Geo */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 20 : 0 }}
                transition={{
                    duration: isTransitioning ? 0.3 : duration.medium,
                    delay: isTransitioning ? 0 : 1.8,
                    ease: easing.entrance,
                }}
                className="pointer-events-auto bg-black/10 backdrop-blur-md border border-white/5 p-4 min-w-[180px]"
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-doto text-micro uppercase tracking-widest text-white">Date & Time</span>
                        <span className="font-doto text-micro text-white">
                            <ScrambleText text={currentTime} delay={2} />
                        </span>
                    </div>
                    <hr className="border-white/5" />
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-doto text-micro uppercase tracking-widest text-white">Timezone</span>
                        <span className="font-doto text-micro text-white">
                            <ScrambleText text={timeZone} delay={2.1} />
                        </span>
                    </div>
                    <hr className="border-white/5" />
                    <div className="flex items-center justify-between gap-4">
                        <span className="font-doto text-micro uppercase tracking-widest text-white">Coordinate</span>
                        <span className="font-doto text-micro text-white">
                            <ScrambleText text={locationString} delay={2.2} />
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
