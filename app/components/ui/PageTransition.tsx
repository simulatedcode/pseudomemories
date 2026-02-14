"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { ScrambleText } from "./ScrambleText";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useLenis } from "lenis/react";
import { useTransition } from "@/app/context/TransitionContext";

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [displayPath, setDisplayPath] = useState(pathname);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { setIsTransitioning: setGlobalTransition } = useTransition();

    const lenis = useLenis();

    useEffect(() => {
        if (pathname !== displayPath) {
            setIsTransitioning(true);
            setGlobalTransition(true);
            const timer = setTimeout(() => {
                setDisplayPath(pathname);
                setIsTransitioning(false);
                setGlobalTransition(false);
                if (lenis) {
                    lenis.scrollTo(0, { immediate: true });
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [pathname, displayPath, lenis, setGlobalTransition]);

    const getRouteLabel = (path: string) => {
        if (path === "/" || path === "") return "MEMORY_ROOT";
        return path.split("/").filter(Boolean).pop()?.toUpperCase() || "ACCESS_GRANTED";
    };

    return (
        <>
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{
                        opacity: 0,
                        y: 100,
                        scale: 0.95
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                    }}
                    exit={{
                        opacity: 0,
                        y: -50,
                        scale: 1.02
                    }}
                    transition={{
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1], // Smooth easing
                        opacity: { duration: 0.6 },
                        scale: { duration: 0.8 }
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
                                    transition={{ duration: 0.8, ease: [0, 0, 0.38, 0.9] }}
                                />
                            </div>
                            <h4 className="font-electrolize text-body sm:text-h4 tracking-[0.3em] text-offwhite-100 flex items-center gap-4">
                                <span className="text-vermelion opacity-60">[</span>
                                <ScrambleText text={getRouteLabel(pathname)} duration={0.8} />
                                <span className="text-vermelion opacity-60">]</span>
                            </h4>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}