"use client";

import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useTransition } from "@/app/context/TransitionContext";

export function HUDFrame() {
    const { isTransitioning } = useTransition();

    return (
        <div className="fixed inset-0 pointer-events-none z-60">
            {/* Centrer right line*/}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                    opacity: isTransitioning ? 0 : 1,
                    scaleY: isTransitioning ? 0 : 1
                }}
                style={{ originY: 0.5 }}
                transition={{ duration: isTransitioning ? 0.3 : duration.cinematic, ease: easing.soft, delay: isTransitioning ? 0 : 1.0 }}
                className="absolute left-8 top-6 bottom-6 w-8 border-l border-t border-b border-white/40"
            />
            {/* Centrer left line*/}
            <motion.div
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{
                    opacity: isTransitioning ? 0 : 1,
                    scaleY: isTransitioning ? 0 : 1
                }}
                style={{ originY: 0.5 }}
                transition={{ duration: isTransitioning ? 0.3 : duration.cinematic, ease: easing.soft, delay: isTransitioning ? 0 : 1.0 }}
                className="absolute right-8 top-6 bottom-6 w-8 border-r border-t border-b border-white/40"
            />
        </div>
    );
}
