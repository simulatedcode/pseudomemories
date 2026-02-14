"use client";

import { motion } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "@/app/components/ui/ScrambleText";

export default function AboutPage() {
    return (
        <div className="min-h-screen w-full pt-32 pb-24 px-spacing-08 md:px-spacing-10 flex flex-col justify-center">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                {/* Image Placeholder */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                    className="col-span-1 lg:col-span-5 relative aspect-3/4 lg:aspect-4/5 bg-zinc-900 border border-white/10 overflow-hidden group"
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

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: duration.slow, ease: easing.carbonExpressive, delay: 0.2 }}
                    className="col-span-1 lg:col-span-7 flex flex-col justify-center h-full"
                >
                    <div className="mb-12">
                        <span className="font-doto text-micro uppercase tracking-widest text-cyan mb-4 block">
                            Profile
                        </span>
                        <h1 className="font-electrolize text-h3 md:text-h2 uppercase tracking-tighter text-white">
                            <ScrambleText text="M Fahriza Ansyari" delay={0.4} />
                        </h1>
                        <p className="font-iawriter text-body text-white/60 mt-2">
                            Designer & Illustrator
                        </p>
                    </div>

                    <div className="space-y-8 font-iawriter text-body text-offwhite-100/60 leading-relaxed max-w-2xl">
                        <p>
                            Born in Banjarmasin in 1984. He has been working as a designer, illustrator and also as a screen printer for the past 13 years. Now based in Yogyakarta, he runs a commercial studio called <span className="text-white">Simulasi</span>.
                        </p>
                        <p>
                            In his artistic practice, he focuses on exploring screen printing techniques with landscape illustrations that reflect the liminality of spatial experience. He is also an active member of a printmaking collective called <span className="text-white">Krack! Studio</span>.
                        </p>
                        <div className="h-px w-24 bg-white/20 my-8" />
                        <p>
                            Since 2024, his work has focused on developing a new web application for screen printing tools, facilitating color mixing with base ink CMYK acrylic paint, and transparent medium.
                        </p>
                    </div>

                    {/* Metadata / Footer-like info */}
                    <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
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
    );
}
