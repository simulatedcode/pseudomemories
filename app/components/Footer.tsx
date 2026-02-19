"use client";

import React, { useState, useRef } from "react";
import { ScrambleText } from "./ui/ScrambleText"
import { useIntro } from "../context/IntroContextCore";
import pkg from "../../package.json";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type TechRowProps = {
    label: string;
    value: string;
    delay?: number;
};

// Simplified TechRow as animations will be handled by parent or simple refs if needed
// Actually, GSAP batching is best done in parent.
// But for simplicity, we can just use useGSAP in each row or parent. 
// Given the original had useInView per row, we can just use ScrollTrigger per row.

function TechRow({ label, value, delay = 0 }: TechRowProps) {
    const ref = useRef<HTMLTableRowElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useGSAP(() => {
        if (!ref.current) return;

        gsap.fromTo(ref.current,
            { opacity: 0, y: 8 },
            {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out", // easeOut equivalent
                delay: delay,
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, [delay]);

    // Check visibility for ScrambleText trigger using ScrollTrigger's isActive or manually?
    // ScrambleText uses a boolean trigger. 
    // We can use a state that ScrollTrigger toggles.
    const [isInView, setIsInView] = useState(false);

    useGSAP(() => {
        ScrollTrigger.create({
            trigger: ref.current,
            start: "top 95%",
            onEnter: () => setIsInView(true),
            onLeaveBack: () => setIsInView(false)
        });
    }, []);

    return (
        <tr
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="border-b border-white/10 hover:bg-white/5 transition opacity-0 translate-y-2" // Initial state matching GSAP from
        >
            <td className="px-3 py-2 font-electrolize text-[10px] uppercase tracking-widest opacity-60">
                {label}
            </td>
            <td className="px-3 py-2 font-doto text-micro uppercase tracking-wider text-offwhite-100/90 ">
                <ScrambleText
                    text={value}
                    delay={delay}
                    duration={0.8}
                    trigger={isInView || isHovered}
                />
            </td>
        </tr>
    );
}

export function Footer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCopyrightHovered, setIsCopyrightHovered] = useState(false);
    const [isGithubHovered, setIsGithubHovered] = useState(false);
    const { isComplete } = useIntro();
    const [refId, setRefId] = useState(`v${pkg.version}`);
    const pulseRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Version is static for the session
    }, []);

    useGSAP(() => {
        if (pulseRef.current) {
            gsap.to(pulseRef.current, {
                opacity: 0.5,
                duration: 2,
                repeat: -1,
                yoyo: true, // Animates back to original opacity (1) then to 0.5...
                ease: "power1.inOut"
            });
            // Original FM: [0.5, 1, 0.5]
            // GSAP pulse: from default (likely 1 or defined class) to 0.5 yoyo
            // If starting opacity is 1, yoyo to 0.5 and back works.
        }
    }, []);

    return (
        <footer className="fixed hidden md:flex bottom-0 z-content w-full min-h-32 flex-col justify-center items-center py-spacing-07">
            <div className="w-full max-w-4xl px-spacing-04 py-spacing-04 flex flex-col gap-spacing-04 border border-white/10 bg-background/5 backdrop-blur-md ">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-spacing-05 border-b border-white/10 pb-spacing-04">
                    <div className="flex flex-col gap-spacing-02">
                        <h3 className="font-electrolize text-caption uppercase tracking-[0.2em] text-offwhite-100">
                            System Architecture
                        </h3>
                        <p className="font-doto text-micro uppercase tracking-[0.3em] text-offwhite-100/60">
                            {new Date().getFullYear()}.02.11 // v{pkg.version} // Active Protocol
                        </p>
                    </div>

                    <div className="flex items-center gap-spacing-02">
                        <div className="flex justify-end gap-spacing-02 items-center bg-white/5 border border-white/10 backdrop-blur-md p-spacing-02 px-2">
                            <span className="font-electrolize text-micro uppercase text-white/50">Status</span>
                            <span className="flex items-center gap-spacing-01 font-doto text-micro uppercase text-white/50 tracking-widest">
                                <div
                                    ref={pulseRef}
                                    className="w-2 h-2 rounded-full bg-green-600 mr-spacing-01"
                                />
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="font-doto text-[10px] uppercase tracking-widest">
                            © {new Date().getFullYear()} Pseudo Memories
                        </span>
                        <span className="font-doto text-[10px] uppercase tracking-widest text-white/80">
                            All systems nominal
                        </span>
                    </div>
                    <div>
                        <span className="font-doto text-[10px] uppercase tracking-widest text-white/80">
                            Last version: {refId}
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
