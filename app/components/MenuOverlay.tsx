"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { MenuLink } from "./MenuLink";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface MenuOverlayProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
    menuLinks: Array<{ label: string; href: string; desc: string }>;
}

export function MenuOverlay({
    isMenuOpen,
    setIsMenuOpen,
    hoveredItem,
    setHoveredItem,
    menuLinks
}: MenuOverlayProps) {
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const linksRef = useRef<HTMLDivElement[]>([]);
    const footerRef = useRef<HTMLDivElement>(null);

    // Sync visibility with props and handle animations
    useGSAP(() => {
        if (isMenuOpen) {
            setIsVisible(true);

            // Animate In
            if (backdropRef.current) {
                gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: duration.slow });
            }
            if (modalRef.current) {
                gsap.fromTo(modalRef.current,
                    { y: "-100%", opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.5, ease: easing.carbonExpressive }
                );
            }
            if (headerRef.current) {
                gsap.fromTo(headerRef.current,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: duration.quick, ease: easing.carbonExpressive, delay: 0.2 }
                );
            }
            if (closeBtnRef.current) {
                gsap.fromTo(closeBtnRef.current,
                    { opacity: 0, rotation: -90 },
                    { opacity: 1, rotation: 0, duration: duration.instant, ease: easing.carbonExpressive, delay: 0.3 }
                );
            }

            // Stagger links
            if (linksRef.current.length) {
                gsap.fromTo(linksRef.current,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: easing.carbonExpressive,
                        stagger: 0.07,
                        delay: 0.3
                    }
                );
            }

            if (footerRef.current) {
                gsap.fromTo(footerRef.current,
                    { opacity: 0 },
                    { opacity: 1, duration: duration.instant, ease: easing.carbonExpressive, delay: 0.6 }
                );
            }

        } else {
            // Animate Out
            if (isVisible) {
                const tl = gsap.timeline({
                    onComplete: () => setIsVisible(false)
                });

                if (modalRef.current) {
                    tl.to(modalRef.current, {
                        y: "-100%",
                        opacity: 0,
                        duration: 0.5,
                        ease: easing.carbonExpressive
                    }, 0);
                }
                if (backdropRef.current) {
                    tl.to(backdropRef.current, { opacity: 0, duration: duration.slow }, 0);
                }
            }
        }
    }, [isMenuOpen]);

    if (!isVisible) return null;

    return (
        <div ref={containerRef} className="relative z-50">
            {/* Backdrop */}
            <div
                ref={backdropRef}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-background/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm opacity-0"
            />

            {/* Slide-down Modal */}
            <div
                ref={modalRef}
                className="fixed top-0 left-0 right-0 z-contain pt-spacing-12 opacity-0" // Offset for header height
            >
                <div className="relative mx-auto max-w-6xl px-4 md:px-8 h-screen overflow-y-auto no-scrollbar pb-12">
                    {/* Glass Panel */}
                    <div className="relative bg-zinc-950/5 backdrop-blur-xl border border-white/10 overflow-hidden">
                        {/* Animated Grid Background */}
                        <div className="absolute inset-0 opacity-5">
                            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                        <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#grid)" />
                            </svg>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-background pointer-events-none" />

                        {/* Content */}
                        <div className="relative p-6 md:p-12">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-12">
                                <div
                                    ref={headerRef}
                                    className="flex flex-col gap-2 opacity-0"
                                >
                                    <span className="font-doto text-micro uppercase tracking-widest text-white/50">
                                        Navigation Menu
                                    </span>
                                    <h2 className="font-electrolize text-h4 text-white">
                                        System Access
                                    </h2>
                                </div>

                                <button
                                    ref={closeBtnRef}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="group p-1 hover:bg-white/5 transition-colors border border-white/10 opacity-0"
                                >
                                    <Plus className="w-6 h-6 rotate-45 group-hover:rotate-90 transition-all duration-300 text-white group-hover:text-vermilion" />
                                </button>
                            </div>

                            {/* Navigation Grid */}
                            <nav className="grid grid-cols-1 gap-2">
                                {menuLinks.map((link, index) => (
                                    <MenuLink
                                        key={link.label}
                                        ref={el => { linksRef.current[index] = el! }}
                                        link={link}
                                        index={index}
                                        hoveredItem={hoveredItem}
                                        setHoveredItem={setHoveredItem}
                                        setIsMenuOpen={setIsMenuOpen}
                                    />
                                ))}
                            </nav>

                            {/* Footer Info */}
                            <div
                                ref={footerRef}
                                className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between opacity-0"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-cyan animate-[pulse_1.5s_ease-in-out_infinite]" />
                                        <span className="font-doto text-micro uppercase tracking-widest text-white/50">
                                            System Online
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
