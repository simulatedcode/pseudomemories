"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { img_categories } from "@/app/data/img_category";
import { ScrambleText } from "@/app/components/ui/ScrambleText";

export default function ProjectsPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    // Map vertical scroll to horizontal movement
    // The content moves left as we scroll down
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-43%"]);

    return (
        // Outer container provides the scrollable height
        <div ref={containerRef} className="relative z-content w-full" style={{ height: `${img_categories.length * 50 + 100}vh` }}>

            {/* Sticky Viewport */}
            <div className="fixed top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-background">

                {/* Left: Pinned Sidebar */}
                <div className="w-full md:w-[35%] h-[30vh] md:h-full flex flex-col justify-center px-spacing-08 md:px-spacing-10 py-8 md:py-0 border-b md:border-b-0 md:border-r border-white/10 z-20 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                        className="flex flex-col gap-6"
                    >
                        <span className="font-doto text-micro uppercase tracking-widest text-cyan block items-center gap-2">
                            <span className="w-2 h-2 inline-block rounded-full bg-cyan mr-2 animate-pulse" />
                            Gallery Index
                        </span>
                        <h1 className="font-electrolize text-h4 md:text-h3 uppercase tracking-tighter text-white leading-none">
                            <ScrambleText text="Selected Works" delay={0.2} />
                        </h1>
                        <p className="font-iawriter text-body text-white/60 max-w-sm">
                            A curated collection of visual experiments exploring the intersection of digital noise and analog memories.
                        </p>
                        <div className="hidden md:block w-12 h-px bg-white/20 mt-8" />
                        <p className="hidden md:block font-doto text-micro text-white/40">
                            Scroll to navigate <span className="animate-bounce inline-block ml-1">↓</span>
                        </p>
                    </motion.div>
                </div>

                {/* Right: Horizontal Scroll Section */}
                <div className="w-full md:w-[65%] h-[70vh] md:h-full overflow-hidden flex items-center relative bg-background">
                    <motion.div
                        style={{ x }}
                        className="flex items-center gap-spacing-04 md:gap-spacing-06 pl-spacing-03 md:pl-spacing-06 pr-[50vw]"
                    >
                        {img_categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/projects/${category.id}`}
                                className="relative flex-none group w-[70vw] md:w-[45vw] lg:w-[35vw] aspect-3/4 md:aspect-4/5"
                            >
                                <div className="w-full h-full relative overflow-hidden">
                                    {/* Image Placeholder */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                                        className="w-full h-full relative bg-zinc-900 border border-white/10 overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center text-white/20 font-doto uppercase tracking-widest text-micro group-hover:text-white/40 transition-colors">
                                            [ Portrait Placeholder ]
                                        </div>
                                        {/* Decorative corners */}
                                        <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/30" />
                                        <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/30" />
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/30" />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/30" />
                                    </motion.div>

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-linear-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                    {/* Content Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-doto text-micro uppercase tracking-widest text-cyan">
                                                CAT.{String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <h3 className="font-electrolize text-h4 md:text-h3 text-white mb-2">
                                            {category.title}
                                        </h3>
                                        <p className="font-iawriter text-micro md:text-caption text-white/60 line-clamp-2 md:line-clamp-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {category.description}
                                        </p>
                                    </div>

                                    {/* ID Number */}
                                    <div className="absolute top-4 right-4 font-doto text-h2 md:text-h1 text-white/5 group-hover:text-white/10 transition-colors duration-500 leading-none select-none">
                                        {String(index + 1).padStart(2, '0')}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
