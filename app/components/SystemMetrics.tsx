"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSystemMetrics } from "../hooks/useSystemMetrics";

function MemoryIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
            <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 15V9M12 15V9M17 15V9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function GPUIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current">
            <rect x="2" y="6" width="20" height="12" rx="2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 10H6.01M10 10H10.01M14 10H14.01M18 10H18.01M6 14H6.01M10 14H10.01M14 14H14.01M18 14H18.01" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function SystemMetrics({ className }: { className?: string }) {
    const { memory, gpu } = useSystemMetrics();

    return (
        <nav className={`flex items-center gap-spacing-02 sm:gap-spacing-04 md:gap-spacing-06 lg:gap-spacing-8 ${className}`}>
            <motion.div
                className="flex items-center gap-spacing-02"
            >
                <div className="p-2 sm:p-0">
                    <MemoryIcon />
                </div>
                <span className="font-doto cursor-default text-micro uppercase tracking-[0.2em] hidden sm:inline">
                    MEM: {memory}%
                </span>
            </motion.div>
            <motion.div
                className="flex items-center gap-spacing-02"
            >
                <div className="p-2 sm:p-0">
                    <GPUIcon />
                </div>
                <span className="font-doto cursor-default text-micro uppercase tracking-[0.2em] hidden sm:inline">
                    GPU: {gpu}%
                </span>
            </motion.div>
        </nav>
    );
};
