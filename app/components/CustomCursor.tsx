"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false);
    const cursorRef = useRef<HTMLDivElement>(null);
    const dotRef = useRef<HTMLDivElement>(null);

    // QuickTo for high performance mouse following
    const xTo = useRef<gsap.QuickToFunc | null>(null);
    const yTo = useRef<gsap.QuickToFunc | null>(null);

    useGSAP(() => {
        if (!cursorRef.current) return;

        // Setup QuickTo
        xTo.current = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3.out" });
        yTo.current = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3.out" });

        // Initial hidden state
        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    }, { scope: cursorRef });

    useGSAP(() => {
        if (!dotRef.current) return;

        gsap.to(dotRef.current, {
            width: 16,
            height: 16,
            opacity: isVisible ? 0.8 : 0,
            duration: 0.15,
            ease: "power2.out"
        });
    }, [isVisible]);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (xTo.current && yTo.current) {
                xTo.current(e.clientX);
                yTo.current(e.clientY);
            }
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseEnter = () => setIsVisible(true);
        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isVisible]);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        >
            <div
                ref={dotRef}
                className="square bg-vermilion opacity-0"
                style={{ width: 0, height: 0 }}
            />
        </div>
    );
}
