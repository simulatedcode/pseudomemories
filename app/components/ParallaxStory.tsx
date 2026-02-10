"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const storySegments = [
    {
        text: "Everything begins with the space where vision meets the world.",
        className: "top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        speed: 0.15,
        type: "display"
    },
    {
        text: "From that point emerges the notion of liminality—the state of being in-between.",
        className: "top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        speed: 0.25,
        type: "display"
    },
    {
        text: "Between space and time, the past and present.",
        className: "top-[25%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        speed: 0.1,
        type: "display"
    },
    {
        text: "It does not seek a single truth.",
        className: "top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2",
        speed: 0.2,
        type: "display"
    }
];

export default function ParallaxStory() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 40, // More fluid, less "snappy" for cinematic feel
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={containerRef} className="relative w-full h-[1280vh] pointer-events-none">
            {storySegments.map((segment, index) => (
                <StoryBlock
                    key={index}
                    segment={segment}
                    scrollYProgress={smoothProgress}
                    index={index}
                />
            ))}
        </div>
    );
}

function StoryBlock({ segment, scrollYProgress, index }: { segment: any, scrollYProgress: any, index: number }) {
    const start = index / storySegments.length;
    const end = (index + 1) / storySegments.length;

    // Multi-stage transitions for premium feel
    const opacity = useTransform(
        scrollYProgress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    );

    // Parallax movement based on segment speed
    const yOffset = useTransform(
        scrollYProgress,
        [start, end],
        [150 * segment.speed, -350 * segment.speed]
    );

    const blurValue = useTransform(
        scrollYProgress,
        [start, start + 0.05, end - 0.05, end],
        [10, 0, 0, 10]
    );

    const scaleValue = useTransform(
        scrollYProgress,
        [start, end],
        [0.9, 1.1]
    );

    const filter = useTransform(blurValue, (v) => `blur(${v}px)`);

    const textClass = segment.type === "display" ? "text-h4" : "text-h5";

    return (
        <motion.div
            style={{
                opacity,
                y: yOffset,
                scale: scaleValue,
                filter
            }}
            className={`fixed ${segment.className} z-20 w-[90vw] md:w-full max-w-7xl px-spacing-08 text-offwhite-100 mix-blend-difference text-center`}
        >
            <h2 className={`${textClass} transition-all duration-700 font-medium`}>
                {segment.text}
            </h2>
        </motion.div>
    );
}

