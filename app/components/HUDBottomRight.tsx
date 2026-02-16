"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useTransition } from "../context/TransitionContextCore";
import { SineWaveform } from "./ui/SineWaveform";
import { useAudioAnalysis } from "../context/AudioAnalysisContextCore";
import { useAudio } from "../context/AudioContextCore";
import { Minus } from "lucide-react";

interface HUDBottomRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDBottomRight({ hoveredItem, setHoveredItem }: HUDBottomRightProps) {
    const { isTransitioning } = useTransition();
    const { audioEnabled, playing: isBgAudioPlaying, togglePlay: toggleBgAudio } = useAudio();
    const { isListening, error, toggleAudio, analyser } = useAudioAnalysis();
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMinimized(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const activeColor = isListening ? "#F2653A" : "#cccccc";
    const statusBg = isListening ? "bg-black/10 border-white/20" : "bg-black/10 border-white/5";

    return (
        <div className="fixed right-spacing-07 bottom-spacing-07 z-hud flex flex-col gap-spacing-03 pointer-events-none">
            {/* Box 2: Audio Transmit */}
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: isTransitioning ? 0 : 1,
                    y: isTransitioning ? 20 : 0,
                    width: isMinimized ? "40px" : "230px",
                    height: isMinimized ? "40px" : "112px",
                    borderColor: isListening ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)"
                }}
                transition={{
                    opacity: {
                        duration: isTransitioning ? 0.3 : duration.medium,
                        delay: isTransitioning ? 0 : 2.0,
                        ease: easing.entrance,
                    },
                    y: {
                        duration: isTransitioning ? 0.3 : duration.medium,
                        delay: isTransitioning ? 0 : 2.0,
                        ease: easing.entrance,
                    },
                    width: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0
                    },
                    height: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1],
                        delay: 0
                    },
                    layout: {
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                    },
                    borderColor: {
                        duration: 0.3
                    }
                }}
                className={`pointer-events-auto backdrop-blur-md border flex flex-col group cursor-pointer bg-black/10 ${isMinimized ? "p-0 items-center justify-center min-w-0" : "p-2 min-w-[230px]"}`}
                onClick={(e) => {
                    // If clicking the container in minimized state, maximize it
                    if (isMinimized) {
                        setIsMinimized(false);
                    }
                }}
            >
                {/* Header */}
                <motion.div
                    layout="position"
                    className={`flex items-center justify-between ${isMinimized ? "h-0 opacity-0 overflow-hidden mb-0" : "mb-2"}`}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsMinimized(!isMinimized);
                        }}
                        className="flex items-center justify-between w-full group/btn cursor-pointer outline-hidden"
                        aria-label="Minimize Audio Transmit"
                    >
                        <div className="flex items-center gap-2">
                            <span className={`font-doto text-[10px] uppercase tracking-widest ${isListening ? "text-white/60" : "text-white/40"}`}>
                                Audio Transmit
                            </span>
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? "bg-vermelion" : isListening ? "bg-emerald-500/80" : "bg-vermelion/80"}`} />
                        </div>
                        <div className="text-white/40 group-hover/btn:text-white transition-colors">
                            <Minus size={10} />
                        </div>
                    </button>
                </motion.div>

                {/* Grid Sine Wave Visualizer */}
                <motion.div
                    layout
                    onClick={(e) => { e.stopPropagation(); if (isMinimized) setIsMinimized(false); else toggleAudio(); }}
                    className={`relative overflow-hidden border ${isListening ? "border-white/10 bg-black/10" : "border-white/5 bg-black/5"} ${isMinimized ? "h-full w-full pointer-events-auto border-0" : "h-12 w-full"}`}
                >
                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(to right, ${activeColor} 1px, transparent 1px),
                                            linear-gradient(to bottom, ${activeColor} 1px, transparent 1px)`,
                            backgroundSize: isMinimized ? '8px 8px' : '14px 14px',
                            backgroundPosition: 'center'
                        }}
                    />

                    {/* Sine Wave */}
                    <div className="absolute inset-0 flex items-center">
                        <SineWaveform
                            lineColor={activeColor}
                            height={isMinimized ? 20 : 32}
                            amplitude={isListening ? (isMinimized ? 12 : 22) : 2}
                            speed={isListening ? 0.15 : 0.05}
                            analyser={analyser}
                        />
                    </div>
                </motion.div>

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
                        >
                            {/* Status Footer */}
                            <div className={`flex items-center justify-between pt-1 mt-1 border-t transition-colors ${isListening ? "border-white/10" : "border-white/5"}`}>
                                <span className={`font-doto text-[10px] uppercase tracking-widest animate-pulse transition-colors ${isListening ? "text-white/60" : "text-white/40"}`}>
                                    {error ? "CONNECTION ERROR" : isListening ? "MIC ACTIVE" : "STANDBY"}
                                </span>
                                <span className={`font-doto text-[10px] transition-colors ${isListening ? "text-white/80" : "text-white/40"}`}>
                                    {isListening ? "TX-ON" : "TX-OFF"}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
