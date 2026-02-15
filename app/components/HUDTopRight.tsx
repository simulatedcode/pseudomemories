"use client";

import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useSystemMetrics } from "../hooks/useSystemMetrics";
import { useTransition } from "../context/TransitionContextCore";

export function HUDTopRight() {
    const { memory, gpu } = useSystemMetrics();
    const { isTransitioning } = useTransition();

    return (
        <div className="fixed right-spacing-07 top-spacing-07 z-hud flex flex-col gap-spacing-01 pointer-events-none">
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
                <div className="flex gap-spacing-05">
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
                <div className="flex gap-spacing-03">
                    <span className="font-doto text-micro text-white/60 uppercase tracking-widest">GPU</span>
                    <span className="font-doto text-micro text-white uppercase tracking-widest">
                        {gpu}%
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
