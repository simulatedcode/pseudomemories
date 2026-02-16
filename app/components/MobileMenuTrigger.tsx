"use client";

import React from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { duration, easing } from "../lib/motion-tokens";

interface MobileMenuTriggerProps {
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export function MobileMenuTrigger({ isMenuOpen, setIsMenuOpen }: MobileMenuTriggerProps) {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
                opacity: isMenuOpen ? 0 : 1,
                scale: isMenuOpen ? 0.8 : 1,
                pointerEvents: isMenuOpen ? "none" : "auto"
            }}
            transition={{
                duration: duration.medium,
                ease: easing.entrance,
            }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden fixed top-spacing-07 right-spacing-07 z-100 p-3 bg-white/10 backdrop-blur-md border border-white/10 text-white hover:text-vermelion transition-colors group"
            aria-label="Toggle Menu"
        >
            <div className="relative w-4 h-4 flex items-center justify-center">
                <Menu className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />

                {/* Decorative corners for the button */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-l border-t border-white/20 group-hover:border-vermelion/40 transition-colors" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-r border-b border-white/20 group-hover:border-vermelion/40 transition-colors" />
            </div>
        </motion.button>
    );
}
