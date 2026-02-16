"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import { useTransition } from "../context/TransitionContextCore";
import { Minus, Plus, MapPin } from "lucide-react";

interface HUDBottomLeftProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDBottomLeft({ hoveredItem, setHoveredItem }: HUDBottomLeftProps) {
    const { latitude, longitude, error } = useGeo();
    const { isTransitioning } = useTransition();
    const [currentTime, setCurrentTime] = useState("");
    const [timeZone, setTimeZone] = useState("");
    const [isMinimized, setIsMinimized] = useState(false);

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
                hour12: false,
                timeZone: userTimeZone
            });
            setCurrentTime(formatter.format(now));
            setTimeZone(userTimeZone);
        };

        const checkMobile = () => {
            setIsMinimized(window.innerWidth < 768);
        };

        updateTime();
        checkMobile();

        const interval = setInterval(updateTime, 1000);
        window.addEventListener("resize", checkMobile);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", checkMobile);
        };
    }, []);

    const statusColor = error ? "bg-vermelion" : "bg-emerald-500/80";

    return (
        <div className="fixed left-spacing-07 bottom-spacing-07 z-hud flex flex-col gap-spacing-03 pointer-events-none">
            {/* Box 1: Info Location */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: isTransitioning ? 0 : 1,
                    y: isTransitioning ? 20 : 0,
                    width: isMinimized ? "40px" : "230px",
                    height: isMinimized ? "40px" : "112px"
                }}
                transition={{
                    opacity: {
                        duration: isTransitioning ? 0.3 : duration.medium,
                        delay: isTransitioning ? 0 : 1.8,
                        ease: easing.entrance
                    },
                    y: {
                        duration: isTransitioning ? 0.3 : duration.medium,
                        delay: isTransitioning ? 0 : 1.8,
                        ease: easing.entrance
                    },
                    width: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1], // Standard easing for layout
                        delay: 0 // No delay for width changes
                    },
                    height: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0
                    },
                    layout: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                    }
                }}
                className={`pointer-events-auto bg-black/10 backdrop-blur-md border border-white/5 flex flex-col ${isMinimized ? "p-0 items-center justify-center min-w-0" : "p-3 gap-spacing-03 min-w-[230px]"}`}
            >
                {/* Header */}
                <motion.div
                    layout="position"
                    className={`flex items-center border-white/5 ${isMinimized ? "p-0 pb-0 border-b-0" : "pb-2 border-b"}`}
                >
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className={`flex items-center group cursor-pointer outline-hidden ${isMinimized ? "justify-center" : "justify-between w-full"}`}
                        aria-label={isMinimized ? "Maximize Info" : "Minimize Info"}
                    >
                        <div className="flex items-center gap-2">
                            <AnimatePresence mode="wait">
                                {isMinimized ? (
                                    <motion.div
                                        key="icon"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <MapPin
                                            size={14}
                                            className={`transition-colors duration-300 ${error ? "text-vermelion" : "text-emerald-500/80"}`}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="dot"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColor}`}
                                    />
                                )}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {!isMinimized && (
                                    <motion.span
                                        key="text"
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -5 }}
                                        transition={{ duration: 0.2 }}
                                        className="font-doto text-micro uppercase tracking-widest text-white/60 whitespace-nowrap"
                                    >
                                        Info Location
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {!isMinimized && (
                            <div className="text-white/40 group-hover:text-white transition-colors ml-8">
                                <Minus size={10} />
                            </div>
                        )}
                    </button>
                </motion.div>

                {/* Content */}
                <AnimatePresence>
                    {!isMinimized && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, overflow: "hidden" }}
                            animate={{ height: "auto", opacity: 1, overflow: "visible" }}
                            exit={{ height: 0, opacity: 0, overflow: "hidden" }}
                            transition={{
                                height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.2, delay: 0.1 }
                            }}
                            className="flex flex-col gap-spacing-02"
                        >
                            <div className="flex items-center justify-between gap-spacing-05">
                                <span className="font-doto text-micro uppercase tracking-widest text-white/40">Timestamp</span>
                                <span className="font-doto text-micro text-white" suppressHydrationWarning>
                                    <ScrambleText text={currentTime} delay={0} />
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-spacing-05">
                                <span className="font-doto text-micro uppercase tracking-widest text-white/40">Zone</span>
                                <span className="font-doto text-micro text-white" suppressHydrationWarning>
                                    <ScrambleText text={timeZone} delay={0.1} />
                                </span>
                            </div>

                            <div className="flex items-center justify-between gap-spacing-05">
                                <span className="font-doto text-micro uppercase tracking-widest text-white/40">Coords</span>
                                <span className="font-doto text-micro text-white" suppressHydrationWarning>
                                    <ScrambleText text={locationString} delay={0.2} />
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
