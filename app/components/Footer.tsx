"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, easeOut } from "framer-motion";
import { ScrambleText } from "./ScrambleText";
import Link from "next/link";
import { useIntro } from "../context/IntroContextCore";

type TechRowProps = {
    label: string;
    value: string;
    delay?: number;
};

function TechRow({ label, value, delay = 0 }: TechRowProps) {
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
            <td className="px-3 py-2 font-doto text-micro uppercase tracking-wider text-offwhite-100/90 ">
                <ScrambleText
                    text={value}
                    delay={delay}
                    duration={0.8}
                    trigger={isInView || isHovered}
                />
            </td>
        </motion.tr>
    );
}

export function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (open: boolean) => {
        setIsOpen(open);
    };

    const [isCopyrightHovered, setIsCopyrightHovered] = useState(false);
    const [isGithubHovered, setIsGithubHovered] = useState(false);
    const { isComplete } = useIntro();
    const [refId, setRefId] = useState("LOADING...");

    React.useEffect(() => {
        setRefId(Math.random().toString(36).substring(7).toUpperCase());
    }, []);

    return (
        <footer className="relative z-20 w-full min-h-screen bg-black/80 backdrop-blur-xl flex flex-col justify-center items-center py-spacing-10">
            <div className="w-full max-w-4xl px-spacing-08 flex flex-col gap-spacing-08">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-spacing-05 border-b border-white/10 pb-spacing-06">
                    <div className="flex flex-col gap-spacing-02">
                        <h3 className="font-electrolize text-h4 uppercase tracking-[0.2em] text-offwhite-100">
                            System Architecture
                        </h3>
                        <p className="font-doto text-caption uppercase tracking-[0.3em] text-offwhite-100/60">
                            v.{new Date().getFullYear()}.02.10 // Active Protocol
                        </p>
                    </div>

                    <div className="flex items-center gap-spacing-04">
                        <div className="flex flex-col items-end">
                            <span className="font-electrolize text-caption uppercase text-white/40">Status</span>
                            <span className="flex items-center gap-spacing-03 font-doto text-micro uppercase text-vermelion tracking-widest">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-vermelion"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-08">
                    {/* Tech Stack / Specs */}
                    <div className="flex flex-col gap-spacing-05">
                        <h4 className="font-doto text-micro uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Technical Specifications</h4>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center border-b border-white/5 py-2">
                                <span className="font-electrolize text-caption text-white/60">Core Framework</span>
                                <span className="font-doto text-micro text-white">Next.js 15 (App Router)</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 py-2">
                                <span className="font-electrolize text-caption text-white/60">Rendering Engine</span>
                                <span className="font-doto text-micro text-white">Three.js R160 + Fiber</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 py-2">
                                <span className="font-electrolize text-caption text-white/60">Physics/Motion</span>
                                <span className="font-doto text-micro text-white">Framer Motion 12</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 py-2">
                                <span className="font-electrolize text-caption text-white/60">Styling System</span>
                                <span className="font-doto text-micro text-white">TailwindCSS v4</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 py-2">
                                <span className="font-electrolize text-caption text-white/60">Geolocation</span>
                                <span className="font-doto text-micro text-white">IP-Based Solar Calculation</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation / Links */}
                    <div className="flex flex-col gap-spacing-05">
                        <h4 className="font-doto text-micro uppercase tracking-widest text-white/40 border-b border-white/5 pb-2">Communications</h4>
                        <div className="flex flex-col gap-spacing-04">
                            <Link
                                href="https://github.com/simulatedcode"
                                target="_blank"
                                className="group flex items-center justify-between p-spacing-04 border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <span className="font-electrolize text-body uppercase">Github Repository</span>
                                <span className="font-doto text-micro text-white/40 group-hover:text-white transition-colors">→</span>
                            </Link>
                            <Link
                                href="/documentation"
                                className="group flex items-center justify-between p-spacing-04 border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <span className="font-electrolize text-body uppercase">Documentation</span>
                                <span className="font-doto text-micro text-white/40 group-hover:text-white transition-colors">→</span>
                            </Link>

                            <Link
                                href="https://instagram.com/keppett"
                                target="_blank"
                                className="group flex items-center justify-between p-spacing-04 border border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <span className="font-electrolize text-body uppercase">Instagram Connection</span>
                                <span className="font-doto text-micro text-white/40 group-hover:text-white transition-colors">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex justify-between items-end pt-spacing-08 border-t border-white/10 mt-spacing-04 opacity-60">
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
                            REF: {refId}
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
