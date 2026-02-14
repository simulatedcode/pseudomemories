"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "Ohm",
        category: "Ethereal Sketch",
        image: "/projects/ohm.jpg",
        pos: 1,
        description: "A spiritual ascent captured in charcoal, exploring the boundary between the physical and the infinite.",
        year: "2025"
    },
    {
        id: 2,
        title: "stay unknow Nº.5",
        category: "Minimalist Line",
        image: "/projects/stay-unknow-05.jpg",
        pos: 4,
        description: "Raw, unrefined strokes mapping the silent majesty of peaks that refuse to be fully known.",
        year: "2025",
    },
    {
        id: 3,
        title: "Systen ultra",
        category: "sketch",
        image: "/projects/systen-ultra-02.jpg",
        pos: 6,
        description: "A rhythmic layering of ocean blues and atmospheric clouds, frozen in a moment of perpetual stillness.",
        year: "2020",
    },
    {
        id: 4,
        title: "Shine on",
        category: "Graphite Terrain",
        image: "/projects/landscape-01.jpg",
        pos: 7,
        description: "Detailed geological textures documenting the slow, tectonic shifts of a memory being reconstructed.",
        year: "2025",
    },
    {
        id: 5,
        title: "Landscape Nº.2",
        category: "Framed Void",
        image: "/projects/landscape-02.jpg",
        pos: 9,
        description: "A reductive landscape study where the horizon is merely a suggestion within a digital blue frame.",
        year: "2025",
    },
    {
        id: 6,
        title: "Where are you",
        category: "Fragmentary Form",
        image: "/projects/where-are-you.jpg",
        pos: 12,
        description: "A solitary object standing in a minimalist expanse, questioning its own presence in a fading reality.",
        year: "2025",
    },
    {
        id: 7,
        title: "Stay Unknow Nº.2",
        category: "Shadow Works",
        image: "/projects/sketsa-yang-hilang.jpg",
        pos: 14,
        description: "A lonely silhouette traversing a vibrant pink void, leaving behind nothing but a long, dark memory.",
        year: "2025",
    },
    {
        id: 8,
        title: "Systen ultra Nº.1",
        category: "Blue Synthesis",
        image: "/projects/systen-ultra-01.jpg",
        pos: 16,
        description: "Exploring the chaotic beauty of fluid dynamics and cellular expansion in a hyper-saturated cobalt field.",
        year: "2025",
    }
];

export default function SectionProjects() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const lenis = useLenis();

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Sticky text wrapper - stays visible until section ends
    const textOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const selectedProject = projects.find(p => p.id === selectedId);

    useEffect(() => {
        if (!lenis) return;
        if (selectedId) {
            lenis.stop();
        } else {
            lenis.start();
        }

    }, [selectedId, lenis]);

    const gridItems = Array.from({ length: 16 }, (_, i) => {
        const project = projects.find(p => p.pos === i + 1);
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
            hidden: { opacity: 0, y: 10 },
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
                className="sticky top-24 z-50 px-12 pb-12 mix-blend-difference"
            >
                <motion.div
                    variants={variants.staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    className="flex flex-col gap-4 pointer-events-none"
                >
                    <motion.div
                        variants={variants.fadeDrift}
                        transition={{ duration: 0.5, ease: [0, 0, 0.38, 0.9] }}
                        className="pointer-events-auto"
                    >
                        <p className="text-body font-doto uppercase tracking-widest text-white mb-4">
                            Project Preview
                        </p>
                        <h4 className="font-electrolize text-h3 md:text-h2 max-w-2xl">
                            Selection of sketches highlighting from fragmented memories.
                        </h4>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Grid - Scrolls past sticky header */}
            <div className="relative z-0 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-0 md:gap-1 px-12">
                {gridItems.map((project, index) => {
                    if (!project) {
                        return <div key={`empty-${index}`} className="hidden lg:block col-span-3 aspect-4/3" />;
                    }

                    return (
                        <motion.div
                            key={project.id}
                            layoutId={`project-${project.id}`}
                            onClick={() => setSelectedId(project.id)}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: [0, 0, 0.38, 0.9], delay: (index % 4) * 0.07 }}
                            className="col-span-full sm:col-span-3 lg:col-span-3 group cursor-pointer"
                        >
                            <div className="relative aspect-4/3 overflow-hidden bg-white/5">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-all duration-300 ease-[cubic-bezier(0.2,0,0.38,0.9)] scale-160 group-hover:scale-170 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.2,0,0.38,0.9)]" />

                                <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0,0,0.38,0.9)] translate-y-4 group-hover:translate-y-0">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-doto text-micro uppercase tracking-wider text-white/60 mb-0">
                                                {project.category}
                                            </p>
                                            <h3 className="font-iawriter text-h3 text-white">
                                                {project.title}
                                            </h3>
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

            {mounted && createPortal(
                <AnimatePresence>
                    {selectedId && selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.24, ease: [0.2, 0, 0.38, 0.9] }}
                            className="fixed inset-0 z-9999 flex items-center justify-center p-0 md:p-0"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.24, ease: [0.2, 0, 0.38, 0.9] }}
                                onClick={() => setSelectedId(null)}
                                className="absolute inset-0 bg-background/80 backdrop-blur-lg cursor-pointer"
                            />
                            <motion.div
                                layoutId={`project-${selectedId}`}
                                className="relative w-[95dvw] max-w-screen h-[90dvh] grid grid-cols-1 lg:grid-cols-3 bg-background overflow-hidden border border-white/10"
                            >
                                <div className="lg:col-span-1 p-8 md:p-10 flex flex-col justify-between overflow-hidden border-r border-white/5">
                                    <div className="flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide">
                                        <div className="space-y-8 lg:space-y-8">
                                            <div className="overflow-hidden">
                                                <motion.p
                                                    initial={{ y: "100%" }}
                                                    animate={{ y: 0 }}
                                                    transition={{ delay: 0.15, duration: 0.3, ease: [0, 0, 0.38, 0.9] }}
                                                    className="font-doto text-body uppercase tracking-widest text-white/80 mb-6"
                                                >
                                                    {selectedProject.category} — {selectedProject.year}
                                                </motion.p>
                                            </div>
                                            <div className="overflow-hidden">
                                                <motion.h2
                                                    initial={{ y: "100%" }}
                                                    animate={{ y: 0 }}
                                                    transition={{ delay: 0.2, duration: 0.3, ease: [0, 0, 0.38, 0.9] }}
                                                    className="font-electrolize text-h2 md:text-h1 leading-none tracking-tighter mb-4"
                                                >
                                                    {selectedProject.title}
                                                </motion.h2>
                                            </div>
                                        </div>
                                        <div className="space-y-6 lg:space-y-8">
                                            <div className="overflow-hidden">
                                                <motion.p
                                                    initial={{ y: "20%", opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.3, duration: 0.3, ease: [0.2, 0, 0.38, 0.9] }}
                                                    className="font-iawriter text-body text-white/80 leading-relaxed"
                                                >
                                                    {selectedProject.description}
                                                </motion.p>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.24, ease: [0.2, 0, 0.38, 0.9] }}
                                        className="pt-8 flex items-center gap-4 shrink-0"
                                    >
                                        <p className="font-doto text-micro text-white/60 uppercase tracking-widest">
                                            Pseudo Memories © {new Date().getFullYear()}
                                        </p>
                                        <div className="h-px flex-1 bg-white/10" />
                                    </motion.div>
                                </div>
                                <div className="lg:col-span-2 relative flex flex-col overflow-hidden">
                                    <div className="p-4 flex justify-end shrink-0 z-10">
                                        <motion.button
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.24, ease: [0, 0, 0.38, 0.9] }}
                                            onClick={() => setSelectedId(null)}
                                            className="text-white hover:text-vermelion transition-all flex items-center gap-2 group"
                                        >
                                            <Plus className="h-12 w-12 transition-all hover:rotate-45 cursor-pointer" />
                                        </motion.button>
                                    </div>
                                    <div className="flex-1 relative flex items-end justify-end overflow-hidden">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            transition={{ delay: 0.2, duration: 0.5, ease: [0, 0, 0.38, 0.9] }}
                                            className="relative w-full aspect-video overflow-hidden"
                                        >
                                            <Image
                                                src={selectedProject.image}
                                                alt={selectedProject.title}
                                                fill
                                                className="object-cover"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                                        </motion.div>
                                    </div>
                                    <div className="absolute inset-0 bg-linear-to-bl from-zinc-950/20 via-transparent to-transparent pointer-events-none" />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
}
