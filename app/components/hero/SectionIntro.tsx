"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";

const lines = [
    "Human civilization operates inside a constructed past. Historical memory has been shaped and rewritten across time.",
    "Social patterns driven by constant mobility have replaced direct experience of the world."
];

export default function SectionIntro() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <section ref={containerRef} className="relative h-[300vh] w-full">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center px-spacing-08 md:px-spacing-10">
                <div className="max-w-4xl w-full mx-auto flex flex-col gap-12">
                    {lines.map((text, i) => {
                        const start = 0.15 + i * 0.25;
                        const end = start + 0.3;

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const opacity = useTransform(scrollYProgress, [start, start + 0.1], [0, 1]);
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const y = useTransform(scrollYProgress, [start, end], [30, -30]);

                        return (
                            <motion.p
                                key={i}
                                style={{ opacity, y }}
                                className="font-iawriter text-h3 md:text-h2 leading-tight text-white/90 mix-blend-difference"
                            >
                                {text}
                            </motion.p>
                        );
                    })}
                </div>
            </div>


        </section>
    );
}
