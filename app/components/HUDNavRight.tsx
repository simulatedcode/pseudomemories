"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import { useTransition } from "../context/TransitionContextCore";
import { navItems } from "@/app/data/navigation";

interface HUDNavRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDNavRight({ hoveredItem, setHoveredItem }: HUDNavRightProps) {
    const { isTransitioning } = useTransition();
    return (
        <div className="fixed right-spacing-07 top-1/2 -translate-y-1/2 z-hud flex flex-col items-end gap-spacing-06 pointer-events-none">
            {navItems.map((item, index) => (
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
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${hoveredItem === item.label ? "bg-white scale-125" : "bg-white/40"
                                    }`}
                            />
                            {hoveredItem === item.label && (
                                <motion.div
                                    layoutId="nav-dot-glow"
                                    className="absolute inset-0 bg-white/40 rounded-full blur-xs"
                                />
                            )}
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}
