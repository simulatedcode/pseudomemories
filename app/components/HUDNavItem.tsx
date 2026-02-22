"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ScrambleText } from "./ui/ScrambleText";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HUDNavItemProps {
    item: { label: string; href: string };
    index: number;
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
    solarColor: string;
    isTransitioning: boolean;
}

export const HUDNavItem = React.forwardRef<HTMLDivElement, HUDNavItemProps>(
    ({ item, index, hoveredItem, setHoveredItem, solarColor, isTransitioning }, ref) => {
        const isHovered = hoveredItem === item.label;

        // ── Sizing ─────────────────────────────────────────────────────────────────
        const SVG_SIZE = 36;
        const CENTER = SVG_SIZE / 2;
        const DOT_RADIUS = 2.5;
        const RING_RADIUS = 9;
        const ORIGIN = `${CENTER} ${CENTER}`;
        const CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

        // ── Refs ───────────────────────────────────────────────────────────────────
        const labelRef = useRef<HTMLSpanElement>(null);
        const circleRef = useRef<SVGCircleElement>(null);
        const dotRef = useRef<SVGCircleElement>(null);
        const glowRef = useRef<SVGCircleElement>(null);

        // ── Init SVG Transform Origins ─────────────────────────────────────────────
        useGSAP(() => {
            gsap.set([circleRef.current, glowRef.current], {
                rotation: 0,
                svgOrigin: ORIGIN,
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset: CIRCUMFERENCE,
                r: DOT_RADIUS,
                opacity: 0,
            });
            gsap.set(dotRef.current, { svgOrigin: ORIGIN });
        }, []);

        // ── Hover State ────────────────────────────────────────────────────────────
        useGSAP(() => {
            const label = labelRef.current;
            const circle = circleRef.current;
            const glow = glowRef.current;
            const dot = dotRef.current;

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
        }, { dependencies: [hoveredItem, isHovered, solarColor] });

        return (
            <div
                ref={ref}
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
                        ref={labelRef}
                        className="font-mono text-micro uppercase tracking-[0.35em] text-white/70 pointer-events-none opacity-0 translate-x-2.5 select-none"
                    >
                        <ScrambleText text={item.label} trigger={isHovered} />
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
                                ref={glowRef}
                                cx={CENTER}
                                cy={CENTER}
                                r={DOT_RADIUS}
                                fill="none"
                                stroke={solarColor}
                                strokeWidth="1"
                                strokeLinecap="round"
                                opacity="0"
                                style={{ filter: "blur(1.5px)" }}
                                suppressHydrationWarning
                            />

                            {/* Main animated ring — solar-coloured */}
                            <circle
                                ref={circleRef}
                                cx={CENTER}
                                cy={CENTER}
                                r={DOT_RADIUS}
                                fill="none"
                                stroke={solarColor}
                                strokeWidth="0.9"
                                strokeLinecap="round"
                                opacity="0"
                                suppressHydrationWarning
                            />

                            {/* Centre dot — small, precise */}
                            <circle
                                ref={dotRef}
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
        );
    }
);

HUDNavItem.displayName = "HUDNavItem";
