"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useTransition } from "../context/TransitionContextCore";
import { navItems } from "@/app/data/navigation";
import { useAudioAnalysis } from "../context/AudioAnalysisContextCore";
import { useEffect, useRef, useState } from "react";

interface HUDNavRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDNavRight({ hoveredItem, setHoveredItem }: HUDNavRightProps) {
    const { isTransitioning } = useTransition();
    const { analyser, isListening } = useAudioAnalysis();
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(navItems.length).fill(0));
    const requestRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isListening || !analyser) {
            setAudioLevels(new Array(navItems.length).fill(0));
            return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLevels = () => {
            analyser.getByteFrequencyData(dataArray);

            // Map frequency bands to nav items
            // We'll take a few sample points from low to mid frequencies
            const newLevels = navItems.map((_, index) => {
                // simple mapping: index 0 -> low freq, index N -> higher freq
                // spread indices across the first half of the spectrum where most voice/music energy is
                const dataIndex = Math.floor((index / navItems.length) * (bufferLength / 2));
                const value = dataArray[dataIndex] / 255.0; // normalized 0..1
                return value;
            });

            setAudioLevels(newLevels);
            requestRef.current = requestAnimationFrame(updateLevels);
        };

        updateLevels();

        return () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, [analyser, isListening]);

    return (
        <div className="fixed right-spacing-07 top-1/2 -translate-y-1/2 z-hud flex flex-col items-end gap-spacing-06 pointer-events-none">
            {navItems.map((item, index) => {
                const audioScale = 1 + (audioLevels[index] || 0) * 0.5; // Scale up to 1.5x
                const audioOpacity = 0.4 + (audioLevels[index] || 0) * 0.6; // Opacity 0.4 to 1.0

                return (
                    <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: isTransitioning ? 0 : 1, x: isTransitioning ? 20 : 0 }}
                        transition={{
                            duration: isTransitioning ? 0.3 : duration.medium,
                            delay: isTransitioning ? 0 : 1.5 + index * 0.1,
                            ease: easing.entrance,
                        }}
                        className="pointer-events-auto"
                    >
                        <Link
                            href={item.href}
                            onMouseEnter={() => setHoveredItem(item.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className="group flex items-center gap-spacing-05 transition-all"
                        >
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{
                                    opacity: hoveredItem ? (hoveredItem === item.label ? 1 : 0.4) : 0,
                                    x: hoveredItem ? 0 : 10,
                                }}
                                transition={{ duration: 0.3, ease: easing.entrance }}
                                className="font-iawriter text-caption uppercase tracking-widest text-white pointer-events-none"
                            >
                                <ScrambleText text={item.label} trigger={hoveredItem === item.label} />
                            </motion.span>
                            <div className="relative">
                                <div
                                    className={`w-2 h-2 rounded-full transition-all duration-75 ease-out ${hoveredItem === item.label ? "bg-white" : "bg-white/40"
                                        }`}
                                    style={{
                                        transform: hoveredItem === item.label ? 'scale(1.25)' : `scale(${audioScale})`,
                                        opacity: hoveredItem === item.label ? 1 : audioOpacity
                                    }}
                                />
                                {(hoveredItem === item.label || audioLevels[index] > 0.3) && (
                                    <motion.div
                                        layoutId={`nav-dot-glow-${index}`}
                                        className="absolute inset-0 bg-white/40 rounded-full blur-xs"
                                        style={{
                                            opacity: hoveredItem === item.label ? 1 : audioLevels[index]
                                        }}
                                    />
                                )}
                            </div>
                        </Link>
                    </motion.div>
                );
            })}
        </div>
    );
}
