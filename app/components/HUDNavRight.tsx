"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useTransition } from "../context/TransitionContextCore";
import { navItems } from "@/app/data/navigation";
import { useAudioAnalysis } from "../context/AudioAnalysisContextCore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HUDNavRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDNavRight({ hoveredItem, setHoveredItem }: HUDNavRightProps) {
    const { isTransitioning } = useTransition();
    const { analyser, isListening } = useAudioAnalysis();
    const [audioLevels, setAudioLevels] = useState<number[]>(new Array(navItems.length).fill(0));
    const requestRef = useRef<number | null>(null);

    // Dynamic sizing constants for pixel perfection
    const SVG_SIZE = 32;
    const CENTER = SVG_SIZE / 2;
    const DOT_RADIUS = 4;
    const RING_RADIUS = DOT_RADIUS + 2.5; // Bigger ring for bolder HUD feel

    // Refs for animation targets
    const navItemRefs = useRef<HTMLDivElement[]>([]);
    const labelRefs = useRef<HTMLSpanElement[]>([]);
    const circleRefs = useRef<SVGCircleElement[]>([]);
    const dotRefs = useRef<SVGCircleElement[]>([]);
    const glowRefs = useRef<SVGCircleElement[]>([]);

    useEffect(() => {
        if (!isListening || !analyser) {
            setAudioLevels(new Array(navItems.length).fill(0));
            return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLevels = () => {
            analyser.getByteFrequencyData(dataArray);

            const newLevels = navItems.map((_, index) => {
                const dataIndex = Math.floor((index / navItems.length) * (bufferLength / 2));
                const value = dataArray[dataIndex] / 255.0;
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

    useGSAP(() => {
        // Entrance / Exit Animation based on isTransitioning
        const targetOpacity = isTransitioning ? 0 : 1;
        const targetX = isTransitioning ? 20 : 0;
        const dur = isTransitioning ? 0.3 : duration.medium;

        navItemRefs.current.forEach((el, index) => {
            if (!el) return;
            gsap.to(el, {
                opacity: targetOpacity,
                x: targetX,
                duration: dur,
                delay: isTransitioning ? 0 : 1.5 + index * 0.1,
                ease: easing.entrance
            });
        });
    }, [isTransitioning]);

    // 0. Initialize SVG Origins and Rotations (Crucial for Centering)
    useGSAP(() => {
        gsap.set([...circleRefs.current, ...glowRefs.current], {
            rotation: -90,
            svgOrigin: "16 16"
        });

        gsap.set(dotRefs.current, {
            svgOrigin: "16 16"
        });
    }, []);

    // 1. Primary States (Hover Entry/Exit, Radius Growth, Drawing Progress)
    useGSAP(() => {
        navItems.forEach((item, index) => {
            const isHovered = hoveredItem === item.label;
            const label = labelRefs.current[index];
            const circle = circleRefs.current[index];
            const glow = glowRefs.current[index];
            const dot = dotRefs.current[index];

            if (label) {
                const op = hoveredItem ? (isHovered ? 1 : 0.6) : 0;
                gsap.to(label, {
                    opacity: op,
                    x: hoveredItem ? 0 : 10,
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }

            if (dot) {
                gsap.to(dot, {
                    scale: 1, // Keep dots size when hover
                    opacity: isHovered ? 1 : 0.6,
                    fill: isHovered ? "white" : "rgba(255, 255, 255, 0.8)",
                    svgOrigin: "16 16",
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }

            if (circle && glow) {
                if (isHovered) {
                    gsap.killTweensOf([circle, glow]);
                    gsap.fromTo([circle, glow],
                        {
                            rotation: -270,
                            strokeDashoffset: 1,
                            opacity: 0,
                            r: DOT_RADIUS,
                            scale: 1,
                            svgOrigin: "16 16"
                        },
                        {
                            rotation: -90,
                            r: RING_RADIUS,
                            strokeDashoffset: 0,
                            opacity: 1,
                            svgOrigin: "16 16",
                            duration: 1.0,
                            ease: "power3.out",
                            overwrite: "auto",
                            onComplete: () => {
                                // Add subtle "engaged" pulse
                                gsap.to([circle, glow], {
                                    scale: 1.05,
                                    duration: 1.5,
                                    repeat: -1,
                                    yoyo: true,
                                    ease: "sine.inOut",
                                    svgOrigin: "16 16"
                                });
                            }
                        }
                    );
                } else {
                    gsap.to([circle, glow], {
                        rotation: -90,
                        r: DOT_RADIUS,
                        strokeDashoffset: 1,
                        opacity: 0,
                        scale: 1,
                        svgOrigin: "16 16",
                        duration: 0.4,
                        ease: "power2.in",
                        overwrite: "auto"
                    });
                }
            }
        });
    }, { dependencies: [hoveredItem] });

    // 2. High-Frequency Modulation (Audio Levels)
    useGSAP(() => {
        navItems.forEach((_, index) => {
            const isHovered = hoveredItem === navItems[index].label;
            const level = audioLevels[index] || 0;
            const circle = circleRefs.current[index];
            const glow = glowRefs.current[index];
            const dot = dotRefs.current[index];

            if (!isHovered) return;

            if (circle) {
                gsap.to(circle, {
                    strokeWidth: 0.8 + level * 2,
                    svgOrigin: "16 16",
                    duration: 0.1,
                    ease: "none",
                    overwrite: "auto"
                });
            }

            if (glow) {
                gsap.to(glow, {
                    strokeWidth: 2 + level * 4,
                    opacity: 0.3 + level * 0.7,
                    svgOrigin: "16 16",
                    duration: 0.1,
                    ease: "none",
                    overwrite: "auto"
                });
            }

            if (dot) {
                const audioScale = 1 + level * 0.15;
                gsap.to(dot, {
                    scale: isHovered ? audioScale : 1,
                    opacity: isHovered ? 1 : (0.4 + level * 0.6),
                    svgOrigin: "16 16",
                    duration: 0.1,
                    overwrite: "auto"
                });
            }
        });
    }, [audioLevels, hoveredItem]);

    return (
        <div className="hidden md:flex fixed right-spacing-06 top-1/2 -translate-y-1/2 z-hud flex-col items-end gap-spacing-04 pointer-events-none">
            {navItems.map((item, index) => (
                <div
                    key={item.label}
                    ref={el => { navItemRefs.current[index] = el! }}
                    className="pointer-events-auto opacity-0 translate-x-5"
                >
                    <Link
                        href={item.href}
                        onMouseEnter={() => setHoveredItem(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group flex items-center gap-spacing-02 transition-all"
                    >
                        <span
                            ref={el => { labelRefs.current[index] = el! }}
                            className="font-iawriter text-caption uppercase tracking-widest text-white pointer-events-none opacity-0 translate-x-2"
                        >
                            <ScrambleText text={item.label} trigger={hoveredItem === item.label} />
                        </span>
                        <div className="relative w-8 h-8 flex-none flex items-center justify-center">
                            <svg
                                className="absolute inset-0 w-full h-full overflow-visible"
                                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                                shapeRendering="geometricPrecision"
                            >
                                {/* Static Background Path */}
                                <circle
                                    cx="16"
                                    cy="16"
                                    r={RING_RADIUS}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.5"
                                    className="opacity-10"
                                />

                                {/* Progressive Glow */}
                                <circle
                                    ref={el => { glowRefs.current[index] = el! }}
                                    cx="16"
                                    cy="16"
                                    r={DOT_RADIUS}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.5"
                                    pathLength="1"
                                    strokeDasharray="1"
                                    strokeDashoffset="1"
                                    className="opacity-0 blur-sm"
                                />

                                {/* Main Loader Ring */}
                                <circle
                                    ref={el => { circleRefs.current[index] = el! }}
                                    cx="16"
                                    cy="16"
                                    r={DOT_RADIUS}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.8"
                                    pathLength="1"
                                    strokeDasharray="1"
                                    strokeDashoffset="1"
                                    className="opacity-0"
                                />

                                {/* Center Dot */}
                                <circle
                                    ref={el => { dotRefs.current[index] = el! }}
                                    cx="16"
                                    cy="16"
                                    r={DOT_RADIUS}
                                    fill="white"
                                    fillOpacity="1.0"
                                />
                            </svg>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}