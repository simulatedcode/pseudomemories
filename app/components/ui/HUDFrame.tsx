"use client";

import React from "react";
import { motion } from "framer-motion";

export function HUDFrame() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            {/* Centrer right line*/}
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute left-8 top-6 bottom-6 w-8 border-l-2 border-t-2 border-b-2 border-white/60"
            />
            {/* Centrer left line*/}
            <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute right-8 top-6 bottom-6 w-8 border-r-2 border-t-2 border-b-2 border-white/60"
            />
        </div>
    );
}
