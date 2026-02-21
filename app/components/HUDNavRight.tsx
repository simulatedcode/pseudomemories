"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useTransition } from "../context/TransitionContextCore";
import { navItems } from "@/app/data/navigation";
import { useAudioAnalysis } from "../context/AudioAnalysisContextCore";
import { useSolarStarColor } from "@/app/hooks/useSolarColor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HUDNavRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDNavRight({ hoveredItem, setHoveredItem }: HUDNavRightProps) {
    const { isTransitioning } = useTransition();
    const { analyser, isListening } = useAudioAnalysis();
    const [audioLevels, setAudioLevels] = useState<number[]>(
        new Array(navItems.length).fill(0)
    );
    const requestRef = useRef<number | null>(null);

    // Solar colour — tints the ring to match the current sky phase
    const solarColor = useSolarStarColor();

    // ── Sizing ─────────────────────────────────────────────────────────────────
    const SVG_SIZE = 36;
    const CENTER = SVG_SIZE / 2;          // 18
    const DOT_RADIUS = 2.5;               // crisp, tiny indicator dot
    const RING_RADIUS = 9;                // orbital ring radius
    const ORIGIN = `${CENTER} ${CENTER}`; // "18 18" — pixel-exact SVG origin
    const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ~56.55

    // ── Refs ───────────────────────────────────────────────────────────────────
    const navItemRefs = useRef<HTMLDivElement[]>([]);
    const labelRefs = useRef<HTMLSpanElement[]>([]);
    const circleRefs = useRef<SVGCircleElement[]>([]);
    const dotRefs = useRef<SVGCircleElement[]>([]);
    const glowRefs = useRef<SVGCircleElement[]>([]);

    // ── Audio level collection (visual-only — does not drive ring/dot) ──────
    useEffect(() => {
        if (!isListening || !analyser) {
            setAudioLevels(new Array(navItems.length).fill(0));
            return;
        }
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const updateLevels = () => {
            analyser.getByteFrequencyData(dataArray);
            setAudioLevels(
                navItems.map((_, i) => {
                    const idx = Math.floor((i / navItems.length) * (bufferLength / 2));
                    return dataArray[idx] / 255.0;
                })
            );
            requestRef.current = requestAnimationFrame(updateLevels);
        };
        updateLevels();
        return () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, [analyser, isListening]);

    // ── Entrance / Exit ────────────────────────────────────────────────────────
    useGSAP(() => {
        const opacity = isTransitioning ? 0 : 1;
        const x = isTransitioning ? 20 : 0;
        const dur = isTransitioning ? 0.3 : duration.medium;
        navItemRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                opacity,
                x,
                duration: dur,
                delay: isTransitioning ? 0 : 1.6 + i * 0.12,
                ease: easing.entrance,
            });
        });
    }, [isTransitioning]);

    // ── Init SVG Transform Origins ─────────────────────────────────────────────
    useGSAP(() => {
        gsap.set([...circleRefs.current, ...glowRefs.current], {
            rotation: 0,
            svgOrigin: ORIGIN,
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: CIRCUMFERENCE,
            r: DOT_RADIUS,
            opacity: 0,
        });
        gsap.set(dotRefs.current, { svgOrigin: ORIGIN });
    }, []);

    // ── Hover State ────────────────────────────────────────────────────────────
    useGSAP(() => {
        navItems.forEach((item, i) => {
            const isHovered = hoveredItem === item.label;

            const label = labelRefs.current[i];
            const circle = circleRefs.current[i];
            const glow = glowRefs.current[i];
            const dot = dotRefs.current[i];

            // ── LABEL ──────────────────────────────────────────────────────────
            if (label) {
                gsap.to(label, {
                    opacity: hoveredItem ? (isHovered ? 1 : 0.25) : 0,
                    x: hoveredItem ? 0 : 10,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: "auto",
                });
            }

            // ── DOT — opacity only, no scale ───────────────────────────────────
            if (dot) {
                gsap.to(dot, {
                    opacity: isHovered ? 1 : 0.45,
                    duration: 0.4,
                    ease: "power2.out",
                    svgOrigin: ORIGIN,
                    overwrite: "auto",
                });
            }

            // ── RING – draw from 0 → full circle, then breathe ─────────────────
            if (!circle || !glow) return;

            gsap.killTweensOf([circle, glow]);

            if (isHovered) {
                // Snap to initial draw state: hidden, at dot size, rotation ready
                gsap.set([circle, glow], {
                    r: RING_RADIUS,
                    strokeDasharray: CIRCUMFERENCE,
                    strokeDashoffset: CIRCUMFERENCE, // fully hidden
                    rotation: -90,                   // start from 12 o'clock
                    opacity: 1,
                    scale: 1,
                    svgOrigin: ORIGIN,
                });

                // Draw: sweep strokeDashoffset → 0 (full circle) at fixed rotation
                gsap.to([circle, glow], {
                    strokeDashoffset: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: "power2.inOut",
                    overwrite: "auto",
                    onComplete() {
                        // Gentle breathing pulse — ring stays in place
                        gsap.to([circle, glow], {
                            scale: 1.04,
                            duration: 2.2,
                            repeat: -1,
                            yoyo: true,
                            ease: "sine.inOut",
                            svgOrigin: ORIGIN,
                        });
                    },
                });

            } else {
                // Collapse: fade & shrink back to invisible
                gsap.to([circle, glow], {
                    strokeDashoffset: CIRCUMFERENCE,
                    r: DOT_RADIUS,
                    opacity: 0,
                    scale: 1,
                    svgOrigin: ORIGIN,
                    duration: 0.25,
                    ease: "power2.in",
                    overwrite: "auto",
                });
            }
        });
    }, { dependencies: [hoveredItem] });

    return (
        <div className="hidden md:flex fixed right-spacing-06 top-1/2 -translate-y-1/2 z-hud flex-col items-end gap-spacing-05 pointer-events-none">
            {navItems.map((item, i) => (
                <div
                    key={item.label}
                    ref={el => { navItemRefs.current[i] = el! }}
                    className="pointer-events-auto opacity-0 translate-x-5"
                >
                    <Link
                        href={item.href}
                        onMouseEnter={() => setHoveredItem(item.label)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="flex items-center gap-2.5"
                    >
                        {/* Label */}
                        <span
                            ref={el => { labelRefs.current[i] = el! }}
                            className="font-mono text-micro uppercase tracking-[0.35em] text-white/70 pointer-events-none opacity-0 translate-x-2.5 select-none"
                        >
                            <ScrambleText text={item.label} trigger={hoveredItem === item.label} />
                        </span>

                        {/* Hairline tick connecting label → dot */}
                        <span className="block w-2.5 h-px bg-white/15 flex-none" />

                        {/* Dot + Ring */}
                        <div className="relative flex-none flex items-center justify-center"
                            style={{ width: SVG_SIZE, height: SVG_SIZE }}>
                            <svg
                                className="absolute inset-0 overflow-visible"
                                viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
                                width={SVG_SIZE}
                                height={SVG_SIZE}
                                shapeRendering="geometricPrecision"
                            >
                                {/* Static orbital track — always visible, very faint */}
                                <circle
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={RING_RADIUS}
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.4"
                                    opacity="0.07"
                                />

                                {/* Glow ring — solar-coloured, softly blurred */}
                                <circle
                                    ref={el => { glowRefs.current[i] = el! }}
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={DOT_RADIUS}
                                    fill="none"
                                    stroke={solarColor}
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    opacity="0"
                                    style={{ filter: "blur(1.5px)" }}
                                />

                                {/* Main animated ring — solar-coloured */}
                                <circle
                                    ref={el => { circleRefs.current[i] = el! }}
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={DOT_RADIUS}
                                    fill="none"
                                    stroke={solarColor}
                                    strokeWidth="0.9"
                                    strokeLinecap="round"
                                    opacity="0"
                                />

                                {/* Centre dot — small, precise */}
                                <circle
                                    ref={el => { dotRefs.current[i] = el! }}
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={DOT_RADIUS}
                                    fill="white"
                                    opacity="0.9"
                                />
                            </svg>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}