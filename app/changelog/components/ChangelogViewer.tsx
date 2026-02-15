"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChangelogViewerProps {
    content: string;
}

export default function ChangelogViewer({ content }: ChangelogViewerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            // Check if content height exceeds the max height (e.g., 600px)
            setIsOverflowing(contentRef.current.scrollHeight > 600);
        }
    }, [content]);

    return (
        <div className="relative">
            <motion.div
                layout
                initial={false}
                animate={{
                    height: isExpanded ? "auto" : isOverflowing ? 600 : "auto",
                }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className={`overflow-hidden relative ${!isExpanded && isOverflowing ? "mask-gradient-b" : ""}`}
            >
                <div ref={contentRef}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                {/* Gradient Mask for collapsed state */}
                <AnimatePresence>
                    {!isExpanded && isOverflowing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none"
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Expand/Collapse Button */}
            {isOverflowing && (
                <div className="flex justify-center mt-48">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="group flex items-center gap-2 px-6 py-3 rounded-full bg-vermelion-500/10 hover:bg-vermelion-500/20 text-vermelion-500 transition-all duration-300 backdrop-blur-sm border border-vermelion-500/20"
                    >
                        <span className="font-electrolize text-micro tracking-wider uppercase">
                            {isExpanded ? "Show Less" : "Read Full Changelog"}
                        </span>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
                        ) : (
                            <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
