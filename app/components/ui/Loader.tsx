"use client";

import { motion } from "framer-motion";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    text?: string;
}

export default function Loader({ size = "md", className = "", text = "LOADING" }: LoaderProps) {
    const sizeClasses = {
        sm: "w-4 h-4 text-[10px]",
        md: "w-6 h-6 sm:w-8 sm:h-8 text-[10px] sm:text-micro",
        lg: "w-8 h-8 sm:w-12 sm:h-12 text-micro sm:text-caption",
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-spacing-03 ${className}`}>
            <div className={`relative flex items-center justify-center ${sizeClasses[size].split(" ")[0]} ${sizeClasses[size].split(" ")[1]}`}>
                {/* Outer Ring */}
                <motion.div
                    className="absolute inset-0 border-2 border-vermelion/20 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                    style={{ borderTopColor: "transparent", borderBottomColor: "rgba(224, 73, 31, 1)" }}
                />

                {/* Inner Ring */}
                <motion.div
                    className="absolute inset-[25%] border-2 border-cyan-500/20 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                    style={{ borderLeftColor: "rgba(6, 182, 212, 1)", borderRightColor: "transparent" }}
                />

                {/* Center Dot */}
                <motion.div
                    className="w-1.5 h-1.5 bg-white rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                />
            </div>

            {text && (
                <motion.span
                    className={`font-doto uppercase tracking-widest text-white/60 ${sizeClasses[size].split(" ").slice(2).join(" ")}`}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                >
                    {text}
                </motion.span>
            )}
        </div>
    );
}
