"use client";

import React, { useState, useEffect, useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useTransition } from "../context/TransitionContextCore";
import { SineWaveform } from "./ui/SineWaveform";
import { useAudioAnalysis } from "../context/AudioAnalysisContextCore";
import { useAudio } from "../context/AudioContextCore";
import { Minus } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HUDBottomRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDBottomRight({ hoveredItem, setHoveredItem }: HUDBottomRightProps) {
    const { isTransitioning } = useTransition();
    const { audioEnabled, playing: isBgAudioPlaying, togglePlay: toggleBgAudio } = useAudio();
    const { isListening, error, toggleAudio, analyser } = useAudioAnalysis();
    const [isMinimized, setIsMinimized] = useState(false);

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const audioVisualizerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const minimizedButtonRef = useRef<HTMLButtonElement>(null);

    // Using a ref to track mount to avoid initial double-render issues or animations
    const mounted = useRef(false);

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

    // Entrance Animation
    useGSAP(() => {
        if (!containerRef.current) return;

        const targetOpacity = isTransitioning ? 0 : 1;
        const targetY = isTransitioning ? 20 : 0;

        gsap.to(containerRef.current, {
            opacity: targetOpacity,
            y: targetY,
            duration: isTransitioning ? 0.3 : duration.medium,
            delay: isTransitioning ? 0 : 2.0,
            ease: easing.entrance
        });
    }, [isTransitioning]);

    // Minimize/Maximize Animation
    useGSAP(() => {
        if (!mounted.current) {
            mounted.current = true;
            // Set initial state without animation if needed, or just let it play
            if (isMinimized) {
                gsap.set(containerRef.current, { width: "40px", height: "40px" });
                gsap.set([headerRef.current, footerRef.current], { opacity: 0, display: "none" });
                gsap.set(minimizedButtonRef.current, { opacity: 1, display: "flex" });
                // We keep visualizer visible but maybe styled differently? 
                // Actually in previous code, visualizer was always there, just resized.
            }
            return;
        }

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 0.4 }
        });

        if (isMinimized) {
            // Collapse
            tl.to([headerRef.current, footerRef.current], { opacity: 0, duration: 0.2, display: "none" })
                .to(containerRef.current, { width: "40px", height: "40px" }, "<")
                .to(minimizedButtonRef.current, { opacity: 1, display: "flex", duration: 0.2 }, "-=0.1");
        } else {
            // Expand
            tl.to(minimizedButtonRef.current, { opacity: 0, display: "none", duration: 0.2 })
                .to(containerRef.current, { width: "230px", height: "112px" }, "<")
                .to([headerRef.current, footerRef.current], { opacity: 1, display: "flex", duration: 0.3 }, "-=0.1");
        }

    }, [isMinimized]);

    // Border color animation
    useGSAP(() => {
        if (!containerRef.current) return;
        gsap.to(containerRef.current, {
            borderColor: isListening ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.05)",
            duration: 0.3
        });
    }, [isListening]);

    return (
        <div className="fixed right-spacing-07 bottom-spacing-07 z-hud flex flex-col gap-spacing-03 pointer-events-none">
            {/* Box 2: Audio Transmit */}
            <div
                ref={containerRef}
                className={`pointer-events-auto backdrop-blur-md border flex flex-col group cursor-pointer bg-black/10 overflow-hidden opacity-0 translate-y-5 ${isMinimized ? "items-center justify-center p-0" : "p-2"}`}
                style={{ width: isMinimized ? '40px' : '230px', height: isMinimized ? '40px' : '112px' }}
                onClick={(e) => {
                    if (isMinimized) {
                        setIsMinimized(false);
                    }
                }}
            >
                {/* Minimized Overlay Trigger (Invisible when expanded) */}
                <button
                    ref={minimizedButtonRef}
                    className="absolute inset-0 z-20 items-center justify-center w-full h-full hidden opacity-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMinimized(false);
                    }}
                >
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? "bg-vermilion" : isListening ? "bg-emerald-500/80" : "bg-vermilion/80"}`} />
                </button>


                {/* Header */}
                <div
                    ref={headerRef}
                    className={`flex items-center justify-between mb-2 w-full ${isMinimized ? "hidden opacity-0" : "flex opacity-100"}`}
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
                            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${error ? "bg-vermilion" : isListening ? "bg-emerald-500/80" : "bg-vermilion/80"}`} />
                        </div>
                        <div className="text-white/40 group-hover/btn:text-white transition-colors">
                            <Minus size={10} />
                        </div>
                    </button>
                </div>

                {/* Grid Sine Wave Visualizer */}
                <div
                    ref={audioVisualizerRef}
                    onClick={(e) => { e.stopPropagation(); if (isMinimized) setIsMinimized(false); else toggleAudio(); }}
                    className={`relative overflow-hidden border transition-colors duration-300 ${isListening ? "border-white/10 bg-black/10" : "border-white/5 bg-black/5"} ${isMinimized ? "absolute inset-0 border-0" : "h-12 w-full"}`}
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
                </div>

                {/* Status Footer */}
                <div
                    ref={footerRef}
                    className={`flex items-center justify-between pt-1 mt-1 border-t transition-colors w-full ${isListening ? "border-white/10" : "border-white/5"} ${isMinimized ? "hidden opacity-0" : "flex opacity-100"}`}
                >
                    <span className={`font-doto text-[10px] uppercase tracking-widest animate-pulse transition-colors ${isListening ? "text-white/60" : "text-white/40"}`}>
                        {error ? "CONNECTION ERROR" : isListening ? "MIC ACTIVE" : "STANDBY"}
                    </span>
                    <span className={`font-doto text-[10px] transition-colors ${isListening ? "text-white/80" : "text-white/40"}`}>
                        {isListening ? "TX-ON" : "TX-OFF"}
                    </span>
                </div>
            </div>
        </div>
    );
}
