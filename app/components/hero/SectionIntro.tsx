"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const lines = [
    "Human civilization operates inside a constructed past.",
    "Historical memory has been shaped and rewritten across time.",
    "Social patterns driven by constant mobility have replaced direct experience of the world."
];

export default function SectionIntro() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<HTMLParagraphElement[]>([]);
    const parallaxRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Parallax Background/Container
        if (parallaxRef.current) {
            gsap.to(parallaxRef.current, {
                y: -100, // Move somewhat counter to scroll
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        }

        // Create a single timeline linked to the scroll progress of the container
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "start end", // when top of container hits bottom of viewport
                end: "end start",   // when bottom of container hits top of viewport
                scrub: 1, // Smooth scrubbing
            }
        });

        // Current FM implementation splits the scroll distance (0 to 1) into 3 parts
        // Each part: Enter (0-20%), Hold (20-80%), Exit (80-100%)

        lines.forEach((_, i) => {
            const el = textRefs.current[i];
            if (!el) return;

            const partDuration = 1 / lines.length; // 0.333
            const start = i * partDuration; // 0, 0.33, 0.66

            // Relative times within the timeline (0 to 1)
            const fadeInEnd = start + (partDuration * 0.25);
            const fadeOutStart = start + partDuration - (partDuration * 0.25); // end - 0.2*part
            const end = start + partDuration;

            // Initial state
            gsap.set(el, { opacity: 0, y: 80, scale: 0.95 });

            // Fade In + Move Up + Scale Up
            tl.to(el, { opacity: 1, y: 0, scale: 1, duration: fadeInEnd - start, ease: "power2.out" }, start);

            // Hold (do nothing) 
            // The tween above ends at 'fadeInEnd'. The next one starts at 'fadeOutStart'.

            // Fade Out + Move Up + Scale Down (slightly)
            tl.to(el, { opacity: 0, y: -80, scale: 1.05, duration: end - fadeOutStart, ease: "power2.in" }, fadeOutStart);
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative h-[180vh] w-full bg-background z-20 overflow-hidden">
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background z-10 pointer-events-none" />

            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-spacing-08 md:px-spacing-10 overflow-hidden">
                <div
                    ref={parallaxRef}
                    className="max-w-4xl w-full mx-auto relative h-screen flex items-center justify-center"
                >
                    {lines.map((text, i) => (
                        <p
                            key={i}
                            ref={el => { textRefs.current[i] = el! }}
                            className="font-iawriter text-h3 md:text-h2 leading-tight text-white/90 mix-blend-difference absolute max-w-4xl text-center px-6 opacity-0"
                        >
                            {text}
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
