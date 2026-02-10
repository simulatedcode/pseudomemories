"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "./ui/ScrambleText";
import Link from "next/link";
import { X } from "lucide-react";

interface MenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuLinks = [
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/documentation" },
    { label: "Archive", href: "/#archive" },
    { label: "Mission", href: "/#mission" },
    { label: "Connect", href: "/#connect" },
];

export function Menu({ isOpen, onClose }: MenuProps) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 cursor-pointer"
                    />

                    <motion.div
                        initial={{ x: 320 }}
                        animate={{ x: 0 }}
                        exit={{ x: 320 }}
                        transition={{ type: "spring", stiffness: 220, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-[320px] z-50 bg-vermelion/20 backdrop-blur-2xl p-spacing-08 flex flex-col"
                    >
                        <div className="flex justify-start mb-spacing-12">
                            <button onClick={onClose} className="group">
                                <X className="w-6 h-6 text-offwhite-100/60 group-hover:text-offwhite-100 transition-colors" />
                            </button>
                        </div>

                        <nav className="flex flex-col gap-spacing-06">
                            {menuLinks.map((link, index) => (
                                <motion.div
                                    key={link.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 + index * 0.08 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className="group flex flex-col"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="font-doto text-micro text-vermelion/60 group-hover:text-vermelion transition-colors">
                                                0{index + 1}
                                            </span>
                                            <span className="font-electrolize text-h4 uppercase tracking-wider text-offwhite-100/80 group-hover:text-offwhite-100 transition-all">
                                                <ScrambleText text={link.label} trigger duration={0.8} />
                                            </span>
                                        </div>
                                        <div className="h-px w-0 group-hover:w-full bg-vermelion/30 transition-all duration-500 mt-2" />
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
