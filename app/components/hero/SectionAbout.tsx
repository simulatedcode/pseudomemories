"use client";

import { motion } from "framer-motion";

export default function SectionAbout() {
    return (
        <section className="relative w-full min-h-screen flex items-center justify-center px-6 py-32">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="space-y-6"
                >
                    <p className="text-micro uppercase tracking-widest text-vermelion/70">
                        About Simulasi
                    </p>

                    <h2 className="font-electrolize text-4xl lg:text-5xl leading-tight">
                        Pseudo Memories
                        <br />
                        As Visual Experiments
                    </h2>

                    <p className="text-offwhite/70 max-w-xl">
                        You explore memory as reconstruction.
                        You treat visuals as simulations of experience.
                        Your studio becomes a place where process, error, and intuition shape meaning.
                    </p>

                    <p className="text-offwhite/60 max-w-xl">
                        Simulasi works through screen printing, digital systems, and experimental imagery.
                        You don’t document reality. You reinterpret it.
                    </p>
                </motion.div>

                {/* Visual Block */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    viewport={{ once: true }}
                    className="relative w-full aspect-4/3 rounded-md overflow-hidden bg-linear-to-br from-vermelion/30 via-cyan/10 to-black"
                >
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                    <div className="absolute inset-0 border border-offwhite/10 rounded-md" />
                </motion.div>

            </div>
        </section>
    );
}
