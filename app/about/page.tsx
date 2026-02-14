"use client"
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "@/app/components/ui/ScrambleText";

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });

    return (
        <div ref={containerRef} className="relative w-full min-h-screen">
            <div className="fixed top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-background">
                {/* Left: Pinned Headers */}
                <div className="w-full md:w-[32%] h-[35vh] md:h-full flex flex-col justify-center px-spacing-08 md:px-spacing-10 py-8 md:py-0 border-b md:border-b-0 md:border-r border-white/10 z-20 bg-background/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                        className="flex flex-col gap-6"
                    >
                    </motion.div>

                    {/* Portrait Placeholder */}
                    <div className="w-full aspect-3/4 bg-zinc-900 border border-white/10 relative overflow-hidden group mt-8 md:mt-12 mb-8">
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 font-doto uppercase tracking-widest text-micro">
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
                        </div>
                    </div>
                </div>

                {/* Right: Scrollable Content */}
                <div className="w-full md:w-[68%] h-[70vh] md:h-full overflow-y-auto no-scrollbar flex flex-col justify-center px-spacing-08 md:px-spacing-10 py-12 md:py-0">
                    {/* header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                        className="flex flex-col gap-6"
                    >
                        <span className="font-doto text-micro uppercase tracking-widest text-cyan block items-center gap-2">
                            <span className="w-2 h-2 inline-block rounded-full bg-cyan mr-2 animate-pulse" />
                            Profile
                        </span>
                        <h1 className="font-electrolize text-h3 md:text-h1 uppercase tracking-tighter text-white leading-none">
                            <ScrambleText text="The Engineer" delay={0.2} />
                        </h1>
                        <p className="font-iawriter text-caption text-white/60 max-w-md mb-16   ">
                            Designer & Illustrator
                        </p>
                    </motion.div>

                    {/* content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive, delay: 0.2 }}
                        className="max-w-2xl space-y-12"
                    >

                        <div className="space-y-8 font-iawriter text-body text-offwhite-100/60 leading-relaxed">
                            <p>
                                Muhammad Fahriza Ansyari (b.1998) is a designer, illustrator and also as a screen printer. Now based in Yogyakarta, he runs a commercial studio called <span className="text-white">Simulasi</span>.
                            </p>
                            <p>
                                In his artistic practice, he focuses on exploring screen printing techniques with landscape illustrations that reflect the liminality of spatial experience. He is also an active member of a printmaking collective called <span className="text-white">Krack! Studio</span>.
                            </p>
                            <div className="h-px w-24 bg-white/20 my-8" />
                            <p>
                                Since 2024, his work has focused on developing a new web application for screen printing tools, facilitating color mixing with base ink CMYK acrylic paint, and transparent medium.
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <span className="font-doto text-micro uppercase tracking-widest text-white/40 block mb-2">Location</span>
                                <span className="font-iawriter text-white">Yogyakarta, ID</span>
                            </div>
                            <div>
                                <span className="font-doto text-micro uppercase tracking-widest text-white/40 block mb-2">Studio</span>
                                <span className="font-iawriter text-white">Simulasi</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
