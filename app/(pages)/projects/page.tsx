"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ImgCategory } from "@/app/data/img_category";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { client } from "@/sanity/lib/client";
import { ALL_CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
    const [categories, setCategories] = useState<ImgCategory[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await client.fetch(ALL_CATEGORIES_QUERY);
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    // Map vertical scroll to horizontal movement
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

    return (
        <main ref={containerRef} className="relative z-content w-full bg-background" style={{ height: `${categories.length * 60 + 100}vh` }}>

            {/* Sticky Viewport */}
            <div className="fixed top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-background">

                {/* Left: Sticky Sidebar */}
                <aside className="w-full md:w-[35%] h-[30vh] md:h-full flex flex-col justify-center px-6 md:px-spacing-10 py-12 md:py-0 border-b md:border-b-0 md:border-r border-white/10 z-20 bg-background/80 backdrop-blur-sm">
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
                </aside>

                {/* Right: Horizontal Section */}
                <section className="w-full md:w-[65%] h-[70vh] md:h-full flex items-center relative overflow-hidden">
                    <motion.div
                        style={{ x }}
                        className="flex items-center gap-spacing-08 px-spacing-10"
                    >
                        {categories.map((category, index) => (
                            <Link
                                key={category.id}
                                href={`/projects/${category.id}`}
                                className="relative flex-none group w-[80vw] md:w-[45vw] lg:w-[35vw] aspect-4/5"
                            >
                                <div className="w-full h-full relative overflow-hidden bg-white/5 border border-white/10 transition-colors group-hover:border-cyan/40">
                                    {/* Image Holder */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: duration.slow, ease: easing.carbonExpressive, delay: index * 0.1 }}
                                        className="w-full h-full relative overflow-hidden"
                                    >
                                        <Image
                                            src={urlFor(category.image).url()}
                                            alt={category.title}
                                            fill
                                            className="object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100 opacity-60 group-hover:opacity-100"
                                        />

                                        {/* Decorative corners */}
                                        <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-white/20 group-hover:border-cyan/40 transition-colors" />
                                        <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-white/20 group-hover:border-cyan/40 transition-colors" />
                                        <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-white/20 group-hover:border-cyan/40 transition-colors" />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-white/20 group-hover:border-cyan/40 transition-colors" />
                                    </motion.div>

                                    {/* Scanlines effect */}
                                    <div className="absolute inset-0 pointer-events-none opacity-[0.4] group-hover:opacity-[0.6] transition-opacity duration-300"
                                        style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)' }} />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-doto text-micro uppercase tracking-widest text-cyan">
                                                CAT_{String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="h-px flex-1 bg-cyan/20 group-hover:bg-cyan/40 transition-colors" />
                                        </div>
                                        <h3 className="font-electrolize text-h3 text-white">
                                            {category.title}
                                        </h3>
                                        <p className="font-iawriter text-micro text-white/40 group-hover:text-white/60 transition-colors line-clamp-1 mt-1">
                                            {category.description}
                                        </p>
                                    </div>

                                    {/* HUD Decorative Data */}
                                    <div className="absolute top-4 right-4 font-doto text-[10px] text-white/20 flex flex-col items-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>STATUS: LOCALIZED</span>
                                        <span>FRAGMENT: {category.id.toUpperCase()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </motion.div>
                </section>
            </div>
        </main>
    );
}
