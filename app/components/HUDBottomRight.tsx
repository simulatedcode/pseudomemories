"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useTransition } from "../context/TransitionContextCore";

interface HUDBottomRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

import { SineWaveform } from "./ui/SineWaveform";
import { useAudioAnalysis } from "../context/AudioAnalysisContextCore";
import { useAudio } from "../context/AudioContextCore";

export function HUDBottomRight({ hoveredItem, setHoveredItem }: HUDBottomRightProps) {
    const { isTransitioning } = useTransition();
    const { audioEnabled, playing: isBgAudioPlaying, togglePlay: toggleBgAudio } = useAudio();
    // Enable monitoring (user repeat) is true
    const { isListening, error, toggleAudio, analyser } = useAudioAnalysis();

    return (
        <div className="fixed right-spacing-07 bottom-spacing-07 z-hud flex flex-col gap-spacing-03 pointer-events-none">
            {/* Box 2: Audio Transmit */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? 20 : 0 }}
                transition={{
                    duration: isTransitioning ? 0.3 : duration.medium,
                    delay: isTransitioning ? 0 : 2.0, // Slight delay after first box
                    ease: easing.entrance,
                }}
                className={`pointer-events-auto backdrop-blur-md border p-2 min-w-[180px] flex flex-col gap-spacing-01 transition-colors duration-300 cursor-pointer group ${isListening
                    ? "bg-black/10 border-white/20 hover:bg-black/20"
                    : "bg-black/10 border-white/5 hover:bg-black/20 hover:border-white/10"
                    }`}
                onClick={() => toggleAudio()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <span className={`font-doto text-[10px] uppercase tracking-widest transition-colors ${isListening ? "text-white/60" : "text-white/40"}`}>
                        Audio Transmit
                    </span>
                    <div className="flex gap-1 mr-1">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors ${error ? "bg-vermelion" :
                            isListening ? "bg-emerald-500/80" : "bg-vermelion/80"
                            }`} />
                    </div>
                </div>

                {/* Grid Sine Wave Visualizer */}
                <div className={`relative h-12 w-full overflow-hidden border transition-colors ${isListening ? "border-white/10 bg-black/10" : "border-white/5 bg-black/5"
                    }`}>
                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `linear-gradient(to right, ${isListening ? '#F2653A' : '#cccccc'} 1px, transparent 1px),
                                            linear-gradient(to bottom, ${isListening ? '#F2653A' : '#cccccc'} 1px, transparent 1px)`,
                            backgroundSize: '14px 14px'
                        }}
                    />

                    {/* Sine Wave */}
                    <div className="absolute inset-0 flex items-center">
                        <SineWaveform
                            lineColor={isListening ? "#F2653A" : "#cccccc"}
                            height={32}
                            amplitude={isListening ? 22 : 2}
                            speed={isListening ? 0.15 : 0.05}
                            analyser={analyser}
                        />
                    </div>
                </div>

                {/* Status Footer */}
                <div className={`flex items-center justify-between pt-1 border-t transition-colors ${isListening ? "border-white/10" : "border-white/5"}`}>
                    <span className={`font-doto text-[10px] uppercase tracking-widest animate-pulse transition-colors ${isListening ? "text-white/60" : "text-white/40"}`}>
                        {error ? "CONNECTION ERROR" : isListening ? "MIC ACTIVE" : "STANDBY"}
                    </span>
                    <span className={`font-doto text-[10px] transition-colors ${isListening ? "text-white/80" : "text-white/40"}`}>
                        {isListening ? "TX-ON" : "TX-OFF"}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
