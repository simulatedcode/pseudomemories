"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ChangelogViewerProps {
    content: string;
}

export default function ChangelogViewer({ content }: ChangelogViewerProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            // Check if content height exceeds the max height (e.g., 600px)
            setIsOverflowing(contentRef.current.scrollHeight > 600);
        }
    }, [content]);

    useGSAP(() => {
        if (!containerRef.current) return;

        const targetHeight = isExpanded ? "auto" : (isOverflowing ? 600 : "auto");

        gsap.to(containerRef.current, {
            height: targetHeight,
            duration: 0.5,
            ease: "power2.inOut"
        });

        if (maskRef.current && isOverflowing) {
            gsap.to(maskRef.current, {
                opacity: isExpanded ? 0 : 1,
                duration: 0.3,
                pointerEvents: isExpanded ? "none" : "auto"
            });
        }

    }, [isExpanded, isOverflowing]);

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className={`overflow-hidden relative`}
                style={{ height: isOverflowing && !isExpanded ? 600 : 'auto' }}
            >
                <div ref={contentRef}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                {/* Gradient Mask for collapsed state */}
                {isOverflowing && (
                    <div
                        ref={maskRef}
                        className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none"
                    />
                )}
            </div>

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
