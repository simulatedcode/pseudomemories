"use client";

import React, { useState, useEffect, useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useGeo } from "../context/GeoContextCore";
import { useTransition } from "../context/TransitionContextCore";
import { Minus, MapPin } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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

    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const minimizedIconRef = useRef<HTMLDivElement>(null);
    const fullHeaderRef = useRef<HTMLDivElement>(null);

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

    // Animation Logic
    useGSAP(() => {
        if (!containerRef.current) return;

        // Entrance / Exit
        const targetOpacity = isTransitioning ? 0 : 1;
        const targetY = isTransitioning ? 20 : 0;

        gsap.to(containerRef.current, {
            opacity: targetOpacity,
            y: targetY,
            duration: isTransitioning ? 0.3 : duration.medium,
            delay: isTransitioning ? 0 : 1.8,
            ease: easing.entrance
        });

    }, [isTransitioning]);

    useGSAP(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            defaults: { ease: "power2.inOut", duration: 0.4 }
        });

        if (isMinimized) {
            // Collapse Sequence
            // 1. Fade out content & full header
            tl.to([contentRef.current, fullHeaderRef.current], { opacity: 0, duration: 0.2, display: "none" })
                // 2. Shrink Container
                .to(containerRef.current, { width: "40px", height: "40px" }, "<")
                // 3. Fade in Minimized Icon
                .to(minimizedIconRef.current, { opacity: 1, scale: 1, display: "flex", duration: 0.3 }, "-=0.2");
        } else {
            // Expand Sequence
            // 1. Fade out Minimized Icon
            tl.to(minimizedIconRef.current, { opacity: 0, scale: 0.8, display: "none", duration: 0.2 })
                // 2. Expand Container
                .to(containerRef.current, { width: "230px", height: "112px" }, "<")
                // 3. Fade in Content & Full Header
                .to([contentRef.current, fullHeaderRef.current], { opacity: 1, display: "flex", duration: 0.3 }, "-=0.1");
        }

    }, [isMinimized]);

    return (
        <div className="fixed left-spacing-07 bottom-spacing-07 z-hud flex flex-col gap-spacing-03 pointer-events-none">
            {/* Box 1: Info Location */}
            <div
                ref={containerRef}
                className={`pointer-events-auto bg-black/10 backdrop-blur-md border border-white/10 flex flex-col overflow-hidden opacity-0 translate-y-5 ${isMinimized ? "items-center justify-center p-0" : "p-3 gap-spacing-03"}`}
                style={{ width: isMinimized ? '40px' : '230px', height: isMinimized ? '40px' : '112px' }}
            >
                {/* Minimized Icon State */}
                <div
                    ref={minimizedIconRef}
                    className="absolute inset-0 items-center justify-center hidden opacity-0"
                >
                    <button
                        onClick={() => setIsMinimized(false)}
                        className="w-full h-full flex items-center justify-center group cursor-pointer outline-hidden"
                        aria-label="Maximize Info"
                    >
                        <MapPin
                            size={14}
                            className={`transition-colors duration-300 ${error ? "text-vermelion" : "text-emerald-500/80"}`}
                        />
                    </button>
                </div>

                {/* Expanded Header State */}
                <div
                    ref={fullHeaderRef}
                    className={`items-center justify-between w-full pb-2 border-b border-white/10 cursor-pointer ${isMinimized ? "hidden opacity-0" : "flex opacity-100"}`}
                    onClick={() => setIsMinimized(true)}
                >
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColor}`} />
                        <span className="font-doto text-micro uppercase tracking-widest text-white/60 whitespace-nowrap">
                            Info Location
                        </span>
                    </div>
                    <div className="text-white/40 hover:text-white transition-colors">
                        <Minus size={10} />
                    </div>
                </div>

                {/* Content */}
                <div
                    ref={contentRef}
                    className={`flex-col gap-spacing-02 w-full ${isMinimized ? "hidden opacity-0" : "flex opacity-100"}`}
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
                </div>
            </div>
        </div>
    );
}
