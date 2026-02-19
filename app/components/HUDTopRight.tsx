"use client";

import { useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useSystemMetrics } from "../hooks/useSystemMetrics";
import { useTransition } from "../context/TransitionContextCore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function HUDTopRight() {
    const { memory, gpu } = useSystemMetrics();
    const { isTransitioning } = useTransition();
    const memRef = useRef<HTMLDivElement>(null);
    const gpuRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const targetOpacity = isTransitioning ? 0 : 1;
        const targetY = isTransitioning ? -20 : 0;
        const dur = isTransitioning ? 0.3 : duration.medium;

        if (memRef.current) {
            gsap.to(memRef.current, {
                opacity: targetOpacity,
                y: targetY,
                duration: dur,
                delay: isTransitioning ? 0 : 1.8,
                ease: easing.entrance
            });
        }

        if (gpuRef.current) {
            gsap.to(gpuRef.current, {
                opacity: targetOpacity,
                y: targetY,
                duration: dur,
                delay: isTransitioning ? 0 : 2.0,
                ease: easing.entrance
            });
        }

    }, [isTransitioning]);

    return (
        <div className="hidden md:flex fixed right-spacing-07 top-spacing-07 z-hud flex-col gap-spacing-01 pointer-events-none">
            {/* Memory Box */}
            <div
                ref={memRef}
                className="pointer-events-auto opacity-0 -translate-y-5"
            >
                <div className="flex gap-spacing-05">
                    <span className="font-doto text-micro text-white/60 uppercase tracking-widest">Mem</span>
                    <span className="font-doto text-micro text-white">
                        {memory}%
                    </span>
                </div>
            </div>

            {/* GPU Box */}
            <div
                ref={gpuRef}
                className="pointer-events-auto opacity-0 -translate-y-5"
            >
                <div className="flex gap-spacing-03">
                    <span className="font-doto text-micro text-white/60 uppercase tracking-widest">GPU</span>
                    <span className="font-doto text-micro text-white uppercase tracking-widest">
                        {gpu}%
                    </span>
                </div>
            </div>
        </div>
    );
}
