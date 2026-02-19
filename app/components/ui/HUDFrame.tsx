"use client";

import { useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useTransition } from "@/app/context/TransitionContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function HUDFrame() {
    const { isTransitioning } = useTransition();
    const startTransitionRef = useRef(false); // To track if initial load happened
    const leftLineRef = useRef<HTMLDivElement>(null);
    const rightLineRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const targetOpacity = isTransitioning ? 0 : 1;
        const targetScaleY = isTransitioning ? 0 : 1;
        const dur = isTransitioning ? 0.3 : duration.cinematic;
        const delay = isTransitioning ? 0 : 1.0;
        const ease = easing.soft;

        if (leftLineRef.current) {
            gsap.to(leftLineRef.current, {
                opacity: targetOpacity,
                scaleY: targetScaleY,
                duration: dur,
                delay: delay,
                ease: ease,
                transformOrigin: "center"
            });
        }

        if (rightLineRef.current) {
            gsap.to(rightLineRef.current, {
                opacity: targetOpacity,
                scaleY: targetScaleY,
                duration: dur,
                delay: delay,
                ease: ease,
                transformOrigin: "center"
            });
        }
    }, [isTransitioning]);

    return (
        <div className="fixed inset-0 pointer-events-none z-hud">
            {/* Center right line*/}
            <div
                ref={leftLineRef}
                className="absolute left-4 top-4 bottom-4 w-4 border-l border-t border-b border-white/40 opacity-0 scale-y-0"
            />
            {/* Center left line*/}
            <div
                ref={rightLineRef}
                className="absolute right-4 top-4 bottom-4 w-4 border-r border-t border-b border-white/40 opacity-0 scale-y-0"
            />
        </div>
    );
}
