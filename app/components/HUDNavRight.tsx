"use client";

import React, { useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useTransition } from "../context/TransitionContextCore";
import { navItems } from "@/app/data/navigation";
import { useSolarStarColor } from "@/app/hooks/useSolarColor";
import { HUDNavItem } from "./HUDNavItem";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HUDNavRightProps {
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
}

export function HUDNavRight({
    hoveredItem,
    setHoveredItem
}: HUDNavRightProps) {
    const { isTransitioning } = useTransition();
    const solarColor = useSolarStarColor();

    // store DOM elements here
    const navRefs = useRef<(HTMLElement | null)[]>([]);

    // ── Entrance / Exit animation ─────────────────────────
    useGSAP(() => {
        const opacity = isTransitioning ? 0 : 1;
        const x = isTransitioning ? 20 : 0;
        const dur = isTransitioning ? 0.3 : duration.medium;

        navRefs.current.forEach((el, i) => {
            if (!el) return;

            gsap.killTweensOf(el);

            gsap.to(el, {
                opacity,
                x,
                duration: dur,
                delay: isTransitioning ? 0 : 1.6 + i * 0.12,
                ease: easing.entrance,
                overwrite: "auto"
            });
        });
    }, [isTransitioning]);

    return (
        <div className="hidden md:flex fixed right-spacing-06 top-1/2 -translate-y-1/2 z-hud flex-col items-end gap-spacing-05 pointer-events-none">
            {navItems.map((item, i) => (
                <HUDNavItem
                    key={item.label}
                    ref={(el) => { navRefs.current[i] = el!; }}
                    item={item}
                    index={i}
                    hoveredItem={hoveredItem}
                    setHoveredItem={setHoveredItem}
                    solarColor={solarColor}
                    isTransitioning={isTransitioning}
                />
            ))}
        </div>
    );
}