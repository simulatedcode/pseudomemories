"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import Link from "next/link";

type TechRowProps = {
    label: string;
    value: string;
    delay?: number;
};

const TechRow = ({ label, value, delay = 0 }: TechRowProps) => {
    const ref = useRef<HTMLTableRowElement | null>(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.tr
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3, ease: "easeOut" }}
            className="border-b border-white/10 hover:bg-white/5 transition"
        >
            <td className="px-3 py-2 font-electrolize text-[10px] uppercase tracking-widest opacity-60">
                {label}
            </td>
            <td className="px-3 py-2 font-doto text-micro uppercase tracking-wider text-offwhite-100/90">
                <ScrambleText
                    text={value}
                    delay={delay}
                    duration={0.8}
                    trigger={isInView || isHovered}
                />
            </td>
        </motion.tr>
    );
};

export const Footer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isGithubHovered, setIsGithubHovered] = useState(false);

    const [isCopyrightHovered, setIsCopyrightHovered] = useState(false);

    return (
        <footer className="fixed bottom-spacing-04 left-0 right-0 sm:left-auto sm:right-spacing-06 z-50 flex flex-col items-center sm:items-end pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence mode="wait">
                    {!isOpen ? (
                        <motion.button
                            key="footer-closed"
                            layoutId="footer-container"
                            onClick={() => setIsOpen(true)}
                            onMouseEnter={() => setIsCopyrightHovered(true)}
                            onMouseLeave={() => setIsCopyrightHovered(false)}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ scale: 1.0 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-black/60 backdrop-blur-md border-2 border-white/10 rounded-md px-3 py-1.5 shadow-md shadow-black/40 cursor-pointer group"
                        >
                            <span className="font-doto text-micro uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                                <ScrambleText
                                    text={`© 2018 - ${new Date().getFullYear()}`}
                                    delay={0}
                                    duration={0.6}
                                    trigger={isCopyrightHovered}
                                />
                            </span>
                        </motion.button>
                    ) : (
                        <motion.div
                            key="footer-open"
                            layoutId="footer-container"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-[90vw] sm:w-[400px] rounded-xl border-2 border-white/15 bg-black/60 backdrop-blur-md shadow-md shadow-black/50 p-5 overflow-hidden origin-bottom sm:origin-bottom-right"
                        >
                            <div className="flex flex-col gap-6">
                                {/* Header */}
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-white/10 pb-4">
                                    <div className="flex flex-col gap-2">
                                        <h3 className="font-electrolize text-caption uppercase tracking-tighter opacity-80">
                                            Technical Specifications
                                        </h3>
                                        <p className="font-doto text-[10px] uppercase tracking-widest opacity-60">
                                            Build Rev. {new Date().getFullYear()}.02.07 // System Active
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-spacing-04">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsOpen(false);
                                            }}
                                            className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                                            aria-label="Close footer"
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-60 group-hover:opacity-100 transition-opacity">
                                                <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Tech Table */}
                                <div className="overflow-hidden relative">
                                    <table className="w-full text-left border border-white/15">
                                        <thead className="bg-white/5">
                                            <tr>
                                                <th className="px-3 py-2 font-electrolize text-[10px] uppercase tracking-widest opacity-50">
                                                    Module
                                                </th>
                                                <th className="px-3 py-2 font-electrolize text-[10px] uppercase tracking-widest opacity-50">
                                                    Stack
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <TechRow label="Framework" value="Next.js 15" delay={0.1} />
                                            <TechRow label="Components" value="React 19" delay={0.2} />
                                            <TechRow label="Graphics" value="GLSL Shaders" delay={0.3} />
                                            <TechRow label="Motion" value="Framer Motion" delay={0.4} />
                                            <TechRow label="Styling" value="Tailwind v4" delay={0.5} />
                                            <TechRow label="Metadata" value="Geoloc API" delay={0.6} />
                                            <TechRow label="Deploy" value="Firebase" delay={0.7} />
                                        </tbody>
                                    </table>
                                </div>

                                {/* Bottom */}
                                <div className="flex flex-col pt-4 gap-4 border-t border-white/5">
                                    <div className="flex flex-wrap gap-spacing-06">
                                        <span className="font-doto text-micro uppercase tracking-widest opacity-50">
                                            © 2018 - {new Date().getFullYear()}
                                        </span>

                                        <span
                                            className="font-doto text-micro uppercase tracking-widest opacity-50 hover:opacity-100 transition"
                                            onMouseEnter={() => setIsGithubHovered(true)}
                                            onMouseLeave={() => setIsGithubHovered(false)}
                                        > Repositories:
                                            <Link
                                                href="https://github.com/simulationcode"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ScrambleText
                                                    text=" GitHub"
                                                    delay={0}
                                                    duration={0.6}
                                                    trigger={isGithubHovered}
                                                />
                                            </Link>
                                        </span>
                                    </div>

                                    <div className="font-doto text-micro uppercase tracking-widest opacity-50">
                                        <ScrambleText text="All circuits busy" delay={0.1} duration={2} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </footer>
    );
};
