"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { duration } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";

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
    return (
        <AnimatePresence>
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: duration.slow }}
                        onClick={() => setIsMenuOpen(false)}
                        className="fixed inset-0 bg-background/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
                    />

                    {/* Slide-down Modal */}
                    <motion.div
                        initial={{ y: "-100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0, 0, 0.38, 0.9] }} // Carbon entrance-expressive
                        className="fixed top-0 left-0 right-0 z-60 pt-[72px]" // Offset for header height
                    >
                        <div className="relative mx-auto max-w-7xl px-8">
                            {/* Glass Panel */}
                            <div className="relative bg-zinc-950/95 backdrop-blur-xl border border-white/10 overflow-hidden">
                                {/* Animated Grid Background */}
                                <div className="absolute inset-0 opacity-5">
                                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                                            </pattern>
                                        </defs>
                                        <rect width="100%" height="100%" fill="url(#grid)" />
                                    </svg>
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-linear-to-b from-vermelion/5 via-transparent to-transparent pointer-events-none" />

                                {/* Content */}
                                <div className="relative p-12">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-12">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2, duration: 0.3, ease: [0.2, 0, 0.38, 0.9] }}
                                            className="flex flex-col gap-2"
                                        >
                                            <span className="font-doto text-micro uppercase tracking-widest text-white/50">
                                                Navigation Menu
                                            </span>
                                            <h2 className="font-electrolize text-h2 text-white">
                                                System Access
                                            </h2>
                                        </motion.div>

                                        <motion.button
                                            initial={{ opacity: 0, rotate: -90 }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            transition={{ delay: 0.3, duration: 0.24, ease: [0, 0, 0.38, 0.9] }}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="group p-4 hover:bg-white/5 transition-colors border border-white/10"
                                        >
                                            <Plus className="w-6 h-6 rotate-45 group-hover:rotate-90 transition-all duration-300 text-white group-hover:text-vermelion" />
                                        </motion.button>
                                    </div>

                                    {/* Navigation Grid */}
                                    <nav className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {menuLinks.map((link, index) => (
                                            <motion.div
                                                key={link.label}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: 0.3 + index * 0.07,
                                                    duration: 0.5,
                                                    ease: [0, 0, 0.38, 0.9] // Carbon entrance-expressive
                                                }}
                                                onMouseEnter={() => setHoveredItem(link.label)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="group relative block h-full p-8 border border-white/10 hover:border-cyan-100/20 bg-black/20 hover:bg-vermelion/5 transition-all duration-300"
                                                >
                                                    {/* Number Indicator */}
                                                    <div className="absolute top-4 right-4 font-doto text-h4 text-white/10 group-hover:text-vermelion/20 transition-colors">
                                                        0{index + 1}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex flex-col gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <motion.div
                                                                className="w-2 h-2 rounded-full bg-vermelion/50"
                                                                animate={{
                                                                    scale: hoveredItem === link.label ? [1, 1.5, 1] : 1,
                                                                    opacity: hoveredItem === link.label ? [0.5, 1, 0.5] : 0.5
                                                                }}
                                                                transition={{ duration: 0.7, ease: [0.2, 0, 0.38, 0.9], repeat: hoveredItem === link.label ? Infinity : 0 }}
                                                            />
                                                            <span className="font-doto text-micro uppercase tracking-widest text-vermelion/80">
                                                                {link.desc}
                                                            </span>
                                                        </div>

                                                        <h3 className="font-electrolize text-h4 uppercase tracking-wider text-white group-hover:text-vermelion transition-colors">
                                                            <ScrambleText
                                                                text={link.label}
                                                                trigger={hoveredItem === link.label}
                                                                duration={0.5}
                                                            />
                                                        </h3>

                                                        {/* Animated Underline */}
                                                        <div className="h-px w-0 group-hover:w-full bg-linear-to-r from-vermelion to-transparent transition-all duration-500" />
                                                    </div>

                                                    {/* Hover Glow Effect */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                        <div className="absolute inset-0 bg-linear-to-br from-vermelion/10 via-transparent to-transparent" />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </nav>

                                    {/* Footer Info */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.24, ease: [0.2, 0, 0.38, 0.9] }}
                                        className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <motion.div
                                                    className="w-2 h-2 rounded-full bg-cyan"
                                                    animate={{ opacity: [1, 0.3, 1] }}
                                                    transition={{ duration: 0.7, ease: [0.2, 0, 0.38, 0.9], repeat: Infinity }}
                                                />
                                                <span className="font-doto text-micro uppercase tracking-widest text-white/50">
                                                    System Online
                                                </span>
                                            </div>
                                        </div>
                                        <span className="font-doto text-micro text-white/30 uppercase tracking-widest">
                                            ESC to close
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
