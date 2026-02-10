"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { ScrambleText } from "./ScrambleText";

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [displayPath, setDisplayPath] = useState(pathname);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        if (pathname !== displayPath) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setDisplayPath(pathname);
                setIsTransitioning(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [pathname, displayPath]);

    const getRouteLabel = (path: string) => {
        if (path === "/" || path === "") return "MEMORY_ROOT";
        return path.split("/").filter(Boolean).pop()?.toUpperCase() || "ACCESS_GRANTED";
    };

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{
                        duration: 0.6,
                        ease: [0.19, 1, 0.22, 1] // Fast out, slow in
                    }}
                    className="w-full relative z-10 min-h-screen"
                >
                    {children}
                </motion.div>
            </AnimatePresence>

            {/* Cinematic Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none"
                    >
                        <div className="flex flex-col items-center gap-spacing-03">
                            <span className="font-doto text-micro tracking-[0.5em] text-vermelion opacity-60 uppercase mb-spacing-02">
                                Accessing Segment
                            </span>
                            <div className="h-[2px] w-24 bg-vermelion/20 overflow-hidden relative mb-spacing-04">
                                <motion.div
                                    className="absolute inset-0 bg-vermelion"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "0%" }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                />
                            </div>
                            <h4 className="font-electrolize text-h4 sm:text-h3 tracking-[0.3em] text-offwhite-100 flex items-center gap-4">
                                <span className="text-vermelion opacity-40">[</span>
                                <ScrambleText text={getRouteLabel(pathname)} duration={0.8} />
                                <span className="text-vermelion opacity-40">]</span>
                            </h4>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
