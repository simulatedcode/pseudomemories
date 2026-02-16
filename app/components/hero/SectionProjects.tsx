"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { selectedProjects, SelectedProject } from "@/app/data/selected_project";
import ProjectModal from "@/app/components/ui/ProjectModal";

export default function SectionProjects() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const lenis = useLenis();

    const { scrollYProgress: fadeProgress } = useScroll({
        target: containerRef,
        offset: ["start 0.1", "center 0.8"]
    });

    const headerFade = useTransform(fadeProgress, [0, 1], [1, 0]);
    const textOpacity = headerFade;

    const selectedProject = selectedProjects.find((p: SelectedProject) => p.id === selectedId);

    useEffect(() => {
        if (!lenis) return;
        if (selectedId) {
            lenis.stop();
        } else {
            lenis.start();
        }

    }, [selectedId, lenis]);

    const gridItems = Array.from({ length: 16 }, (_, i) => {
        const project = selectedProjects.find((p: SelectedProject) => p.pos === i + 1);
        return project || null;
    });

    const variants = {
        staggerContainer: {
            hidden: {},
            visible: {
                transition: { staggerChildren: 1 },
            },
        },
        fadeDrift: {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
        },
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 bg-linear-to-t from-background/80 via-background/50 mask-to-b backdrop-blur-lg text-white"
        >
            {/* Sticky Header - Direct child of section */}
            <motion.div
                style={{ opacity: textOpacity }}
                className="sticky top-24 z-50 px-spacing-08 md:px-spacing-10 pb-12 mix-blend-difference"
            >
                <motion.div
                    variants={variants.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20%" }}
                    className="flex flex-col gap-4 pointer-events-none"
                >
                    {/* heading project title  */}
                    <motion.div
                        variants={variants.fadeDrift}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                        className="pointer-events-auto"
                    >
                        <p className="text-body font-doto uppercase tracking-widest text-white mb-4">
                            Project Preview
                        </p>
                        <h3 className="font-electrolize text-h3 md:text-h2 max-w-2xl">
                            Selection of sketches highlighting from fragmented memories.
                        </h3>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Grid - Scrolls past sticky header */}
            <div className="relative z-0 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-0 md:gap-1 px-spacing-08 md:px-spacing-10">
                {gridItems.map((project, index) => {
                    if (!project) {
                        return <div key={`empty-${index}`} className="hidden lg:block col-span-3 aspect-video" />;
                    }

                    return (
                        <motion.div
                            key={project.id}
                            layoutId={`project-${project.id}`}
                            onClick={() => setSelectedId(project.id)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: duration.slow, ease: easing.carbonExpressive, delay: (index % 4) * 0.07 }}
                            className="col-span-full sm:col-span-2 lg:col-span-3 group cursor-pointer"
                        >
                            <div className="relative aspect-4/3 overflow-hidden bg-white/5">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0.38,0.9)] scale-160 group-hover:scale-100 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0.38,0.9)]" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0,0,0.38,0.9)] translate-y-4 group-hover:translate-y-0">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-doto text-micro uppercase tracking-wider text-white/80 mb-0">
                                                {project.category}
                                            </p>
                                            <h4 className="font-iawriter text-h4 text-white">
                                                {project.title}
                                            </h4>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-4 left-6 text-h4 font-doto text-black/60 transition-opacity duration-200 ease-[cubic-bezier(0.2,0,1,0.9)] group-hover:opacity-0" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                                    0{project.id}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <ProjectModal
                project={selectedProject || null}
                onClose={() => setSelectedId(null)}
            />
        </section>
    );
}
