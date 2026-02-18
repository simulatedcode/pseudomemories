"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    text?: string;
}

export default function Loader({ size = "md", className = "", text = "LOADING" }: LoaderProps) {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const centerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const sizeClasses = {
        sm: "w-4 h-4 text-[10px]",
        md: "w-6 h-6 sm:w-8 sm:h-8 text-[10px] sm:text-micro",
        lg: "w-8 h-8 sm:w-12 sm:h-12 text-micro sm:text-caption",
    };

    useGSAP(() => {
        if (outerRef.current) {
            gsap.to(outerRef.current, {
                rotation: 360,
                duration: 3,
                ease: "linear",
                repeat: -1
            });
        }
        if (innerRef.current) {
            gsap.to(innerRef.current, {
                rotation: -360,
                duration: 2,
                ease: "linear",
                repeat: -1
            });
        }
        if (centerRef.current) {
            gsap.fromTo(centerRef.current,
                { opacity: 0.3 },
                { opacity: 1, duration: 0.7, ease: "power1.inOut", repeat: -1, yoyo: true }
            );
        }
        if (textRef.current) {
            gsap.fromTo(textRef.current,
                { opacity: 0.4 },
                { opacity: 1, duration: 0.7, ease: "power1.inOut", repeat: -1, yoyo: true }
            );
        }
    });

    return (
        <div className={`flex flex-col items-center justify-center gap-spacing-03 ${className}`}>
            <div className={`relative flex items-center justify-center ${sizeClasses[size].split(" ")[0]} ${sizeClasses[size].split(" ")[1]}`}>
                {/* Outer Ring */}
                <div
                    ref={outerRef}
                    className="absolute inset-0 border-2 border-vermelion/20 rounded-full"
                    style={{ borderTopColor: "transparent", borderBottomColor: "rgba(224, 73, 31, 1)" }}
                />

                {/* Inner Ring */}
                <div
                    ref={innerRef}
                    className="absolute inset-[25%] border-2 border-cyan-500/20 rounded-full"
                    style={{ borderLeftColor: "rgba(6, 182, 212, 1)", borderRightColor: "transparent" }}
                />

                {/* Center Dot */}
                <div
                    ref={centerRef}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                />
            </div>

            {text && (
                <span
                    ref={textRef}
                    className={`font-doto uppercase tracking-widest text-white/60 ${sizeClasses[size].split(" ").slice(2).join(" ")}`}
                >
                    {text}
                </span>
            )}
        </div>
    );
}
