"use client";

import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useSystemMetrics } from "../hooks/useSystemMetrics";
import { useTransition } from "../context/TransitionContext";

export function HUDTopRight() {
    const { memory, gpu } = useSystemMetrics();
    const { isTransitioning } = useTransition();

    return (
        <div className="fixed right-10 top-8 z-[100] flex flex-col gap-1 pointer-events-none">
            {/* Memory Box */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
                transition={{
                    duration: isTransitioning ? 0.3 : duration.medium,
                    delay: isTransitioning ? 0 : 1.8,
                    ease: easing.entrance,
                }}
                className="pointer-events-auto"
            >
                <div className="flex gap-4">
                    <span className="font-doto text-micro text-white/60 uppercase tracking-widest">Mem</span>
                    <span className="font-doto text-micro text-white">
                        {memory}%
                    </span>
                </div>
            </motion.div>

            {/* GPU Box */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
                transition={{
                    duration: isTransitioning ? 0.3 : duration.medium,
                    delay: isTransitioning ? 0 : 2.0,
                    ease: easing.entrance,
                }}
                className="pointer-events-auto "
            >
                <div className="flex gap-2">
                    <span className="font-doto text-micro text-white/60 uppercase tracking-widest">GPU</span>
                    <span className="font-doto text-micro text-white uppercase tracking-widest">
                        {gpu}%
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
