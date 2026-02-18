"use client";

import Image from "next/image";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ImgCategory } from "@/app/data/img_category";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { urlFor } from "@/sanity/lib/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

interface CategoryClientProps {
    category: ImgCategory;
    categoryProjects: any[];
    slug: string;
}

export default function CategoryClient({ category, categoryProjects, slug }: CategoryClientProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const runningTextRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Header Entrance
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { opacity: 0, x: -30 },
                { opacity: 1, x: 0, duration: duration.slow, ease: easing.carbonExpressive }
            );
        }

        // Meta Entrance
        if (metaRef.current) {
            gsap.fromTo(metaRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: duration.slow, ease: easing.carbonExpressive, delay: 0.3 }
            );
        }

        // Grid Entrance (Staggered)
        // We target the immediate children of gridRef
        if (gridRef.current) {
            const cards = gridRef.current.children;
            gsap.fromTo(cards,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: duration.slow, ease: easing.carbonExpressive, stagger: 0.1, delay: 0.1 }
            );
        }

        // Running Text Animation (Infinite Loop)
        if (runningTextRef.current) {
            gsap.to(runningTextRef.current, {
                xPercent: 100, // Move from -100% to 100%? Original was -100 to 100?
                // Original: animate={{ x: ["-100%", "100%"] }}
                // So it moves across the container.
                ease: "linear",
                duration: 2,
                repeat: -1,
                from: { xPercent: -100 }
            });
            // Need to check how to implement repeat properly with fromTo or similar in GSAP.
            // GSAP to with repeat: -1 repeats indefinitely.
            // But we need to reset position.
            // .fromTo would be better.
            gsap.fromTo(runningTextRef.current,
                { xPercent: -100 },
                { xPercent: 100, ease: "linear", duration: 2, repeat: -1 }
            );
        }

    }, { scope: containerRef });

    return (
        <main ref={containerRef} className="relative min-h-screen bg-background text-white overflow-hidden pt-32 pb-24">
            {/* Scanlines Effect */}
            <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-size-[100%_2px,3px_100%] opacity-20" />

            {/* HUD Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 container mx-auto px-8 md:px-spacing-12">
                {/* Header Section */}
                <header className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                    <div
                        ref={headerRef}
                        className="space-y-4 opacity-0 -translate-x-5"
                    >
                        <nav className="flex items-center gap-4 font-doto text-micro text-white/40 mb-8">
                            <Link href="/" className="hover:text-cyan transition-colors">ROOT</Link>
                            <span>/</span>
                            <Link href="/projects" className="hover:text-cyan transition-colors">PROJECTS</Link>
                            <span>/</span>
                            <span className="text-cyan uppercase">{slug}</span>
                        </nav>

                        <h1 className="font-electrolize text-h2 md:text-h1 leading-none tracking-tighter uppercase relative">
                            <ScrambleText text={category.title} delay={0.2} />
                            <span className="absolute -top-4 -right-8 font-doto text-micro text-cyan/40 animate-pulse">
                                TYPE: {slug.toUpperCase()}
                            </span>
                        </h1>
                        <p className="font-iawriter text-body text-white/60 max-w-xl border-l border-cyan/30 pl-6">
                            {category.description}
                        </p>
                    </div>

                    <div
                        ref={metaRef}
                        className="font-doto text-micro text-right hidden lg:block opacity-0 scale-90"
                    >
                        <div className="space-y-1 text-white/40 uppercase">
                            <p>Sector: Gallery_A</p>
                            <p>Format: Digital_Fragment</p>
                            <p>Status: Localized</p>
                            <p className="text-cyan">Counts: {categoryProjects.length} Items</p>
                        </div>
                    </div>
                </header>

                {/* Gallery Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-4">
                    {categoryProjects.map((project, index) => (
                        <div
                            key={project.id}
                            className="group opacity-0 translate-y-8"
                        >
                            <div className="relative aspect-4/5 overflow-hidden bg-white/5 border border-white/10 transition-colors group-hover:border-cyan/50">
                                <Image
                                    src={urlFor(project.image).url()}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-all duration-700 ease-out grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105"
                                />

                                {/* HUD Overlay Elements */}
                                <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none z-10">
                                    <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-8 h-px bg-cyan" />
                                        <div className="font-doto text-micro text-cyan self-end">
                                            F_{project.year}
                                        </div>
                                    </div>

                                    <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="font-doto text-micro text-cyan uppercase tracking-widest bg-cyan/10 px-2 py-0.5 border border-cyan/20 inline-block">
                                            0{project.id}
                                        </span>
                                        <h3 className="font-electrolize text-h4 text-white leading-tight">
                                            {project.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Glitch Overlay (SVG-like) */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none mix-blend-overlay bg-neutral-900"
                                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)' }} />

                                {/* Decorative corners for each card */}
                                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    ))}

                    {/* Empty Slots to fill the HUD feel */}
                    {Array.from({ length: Math.max(0, 4 - categoryProjects.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="hidden xl:block aspect-4/5 border border-dashed border-white/5 relative opacity-20">
                            <div className="absolute inset-0 flex items-center justify-center text-white/10 font-doto text-micro uppercase">
                                [ Available_Node ]
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background HUD Decor */}
            <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 pointer-events-none opacity-20 hidden md:block">
                <div className="font-doto text-micro text-right text-cyan space-y-2 uppercase">
                    <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-1 bg-cyan/20 overflow-hidden relative">
                            <div
                                ref={runningTextRef}
                                className="absolute inset-0 bg-cyan"
                            />
                        </div>
                        <span>Transfer_Rate: 48kb/s</span>
                    </div>
                    <p>MEM_USAGE: (RAM) - 482MB</p>
                    <p>BUF_STREAM: ACTIVE</p>
                </div>
            </div>
        </main>
    );
}
