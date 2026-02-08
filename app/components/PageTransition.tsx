"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.95 }}
                transition={{
                    duration: 0.4,
                    ease: [0.33, 0, 0.66, 1]
                }}
                className="w-full relative z-10"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
