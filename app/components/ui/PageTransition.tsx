"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useState, useEffect, useRef } from "react";
import { ScrambleText } from "./ScrambleText";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useLenis } from "lenis/react";
import { useTransition } from "@/app/context/TransitionContext";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function PageTransition({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [displayPath, setDisplayPath] = useState(pathname);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { setIsTransitioning: setGlobalTransition } = useTransition();

    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const overlayBarRef = useRef<HTMLDivElement>(null);

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

    // Animate content on route change (Enter animation only)
    useGSAP(() => {
        if (!containerRef.current) return;

        // Simulating "Enter" animation
        gsap.fromTo(containerRef.current,
            { opacity: 0, y: 100, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto",
                clearProps: "all"
            }
        );
    }, { dependencies: [pathname], scope: containerRef });

    // Animate Overlay
    useGSAP(() => {
        if (isTransitioning && overlayRef.current) {
            // Enter
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );

            if (overlayBarRef.current) {
                gsap.fromTo(overlayBarRef.current,
                    { x: "-100%" },
                    { x: "0%", duration: 0.8, ease: "power2.out", delay: 0.1 }
                );
            }
        }
    }, [isTransitioning]);

    return (
        <>
            <div
                ref={containerRef}
                key={pathname} // Force remount/animate on path change
                className="w-full relative z-10 min-h-screen"
            >
                {children}
            </div>

            {/* Cinematic Transition Overlay */}
            {isTransitioning && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none"
                    style={{ opacity: 0 }} // Initial state handled by GSAP
                >
                    <div className="flex flex-col items-center gap-spacing-03">
                        <span className="font-doto text-micro tracking-[0.5em] text-vermilion opacity-60 uppercase mb-spacing-02">
                            Accessing Segment
                        </span>
                        <div className="h-[2px] w-24 bg-vermilion/20 overflow-hidden relative mb-spacing-04">
                            <div
                                ref={overlayBarRef}
                                className="absolute inset-0 bg-vermilion"
                            />
                        </div>
                        <h4 className="font-electrolize text-body sm:text-h4 tracking-[0.3em] text-offwhite-100 flex items-center gap-4">
                            <span className="text-vermilion opacity-60">[</span>
                            <ScrambleText text={getRouteLabel(pathname)} duration={0.8} />
                            <span className="text-vermilion opacity-60">]</span>
                        </h4>
                    </div>
                </div>
            )}
        </>
    );
}