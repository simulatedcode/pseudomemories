"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const slideImages = [
    {
        id: 1,
        src: "/projects/slide/1-1.png",
        ratio: "aspect-square",
        width: "w-[40dvw] md:w-[30dvw]",
        label: "Composition 01",
        desc: "1:1 Square"
    },
    {
        id: 2,
        src: "/projects/slide/4-3.png",
        ratio: "aspect-[4/3]",
        width: "w-[60dvw] md:w-[45dvw]",
        label: "Composition 02",
        desc: "4:3 Classic"
    },
    {
        id: 3,
        src: "/projects/slide/4-5.png",
        ratio: "aspect-[4/5]",
        width: "w-[35dvw] md:w-[25dvw]",
        label: "Composition 03",
        desc: "4:5 Portrait"
    },
    {
        id: 4,
        src: "/projects/slide/2-1.png",
        ratio: "aspect-[2/1]",
        width: "w-[80dvw] md:w-[60dvw]",
        label: "Composition 04",
        desc: "2:1 Panoramic"
    }
];

export default function SectionSlide() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "center center"]
    });

    // With smaller images, they almost fit the screen. 
    // We start at 0% (aligned left) and move slightly left (-25%) to reveal the end + padding.
    const x = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);
    return (
        <section
            ref={sectionRef}
            className="relative h-[dvh] bg-background/80 backdrop-blur-sm px-12"
        >
            <div className="sticky top-0 max-w-none h-screen w-full flex flex-col justify-center overflow-hidden">
                <div className="px-8 mb-12 md:mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-micro font-doto uppercase tracking-widest text-white mb-4"
                    >
                        Section Slide
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.3, ease: [0.2, 0, 0.38, 0.9] }} // Carbon entrance-productive
                        className="font-electrolize text-h2 md:text-h1 max-w-2xl text-white leading-tight"
                    >
                        Exploration of visual balance through varied aspect ratios.
                    </motion.h2>
                </div>

                <div className="relative w-full">
                    <motion.div
                        style={{ x }}
                        className="flex items-start gap-2 md:gap-4 px-8"
                    >
                        {slideImages.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.60 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.07, ease: [0, 0, 0.38, 0.9] }} // Carbon entrance-expressive
                                className="shrink-0 w-[10dvw] md:w-[23dvw] flex flex-col gap-4"
                            >
                                <div className={`relative ${item.ratio} overflow-hidden bg-white/5 border border-white/10 group`}>
                                    <Image
                                        src={item.src}
                                        alt={item.label}
                                        fill
                                        className="object-ratio object-top transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                                <div className="flex justify-between items-start pt-2">
                                    <div>
                                        <h3 className="font-iawriter text-body md:text-h4 text-white uppercase tracking-tight">
                                            {item.label}
                                        </h3>
                                        <p className="font-doto text-micro text-white/50 uppercase">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <span className="font-doto text-micro text-white/35">0{index + 1}</span>
                                </div>
                            </motion.div>
                        ))}

                        {/* Spacer to ensure the last image can reach the left side if desired, 
                            or just enough to comfortably finish the slide */}
                        <div className="w-[10vw] shrink-0" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
