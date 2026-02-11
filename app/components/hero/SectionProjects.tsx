"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { createPortal } from "react-dom";
import { PlusIcon } from "lucide-react";

const projects = [
    {
        id: 1,
        title: "Project Alpha",
        category: "Visual Simulation",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
        pos: 1,
        description: "An exploration of visual simulations through the lens of fragmented memories. This project investigates how digital reconstructions can mimic the ephemeral nature of human recollection.",
        year: "2024",
        client: "Autonomous Research Lab"
    },
    {
        id: 2,
        title: "Project Beta",
        category: "Memory Archive",
        image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
        pos: 4,
        description: "A digital archive designed to preserve and catalog synthetic memories. The system uses advanced neural mapping to visualize stored experiences as interactive landscapes.",
        year: "2023",
        client: "Memory Trust Foundation"
    },
    {
        id: 3,
        title: "Project Gamma",
        category: "Digital Reconstruction",
        image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=800&auto=format&fit=crop",
        pos: 6,
        description: "Focuses on the reconstruction of architectural landmarks within a virtual space, emphasizing the decay and evolution of structures over time.",
        year: "2024",
        client: "Urban Heritage Institute"
    },
    {
        id: 4,
        title: "Shine on",
        category: "In a Landscape",
        image: "/projects/landscape-01.jpg",
        pos: 7,
        description: "A multi-layered simulation environment that blends real-world sensory data with procedural generation to create high-fidelity synthetic realities.",
        year: "2023",
        client: "Nexus Reality Systems"
    },
    {
        id: 5,
        title: "Project Epsilon",
        category: "Neural Landscape",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=800&auto=format&fit=crop",
        pos: 9,
        description: "Visualizing the hidden topographies of neural networks as they process complex emotional datasets, revealing patterns of collective consciousness.",
        year: "2024",
        client: "Cognitive Art Initiative"
    },
    {
        id: 6,
        title: "Project Zeta",
        category: "Quantum Echo",
        image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop",
        pos: 12,
        description: "An experimental installation reflecting the mathematical beauty of quantum decoherence and its parallel to the fading of memory.",
        year: "2023",
        client: "Theoretical Physics Group"
    },
    {
        id: 7,
        title: "Project Eta",
        category: "Temporal Glitch",
        image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=800&auto=format&fit=crop",
        pos: 13,
        description: "A series of works exploring temporal inconsistencies in recorded history, visualized through intentional digital glitching and layering.",
        year: "2024",
        client: "Historical Distortion Archive"
    },
    {
        id: 8,
        title: "Project Theta",
        category: "Kinetic Drift",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop",
        pos: 15,
        description: "Capturing the fluid motion of environmental particles over vast desert landscapes, rendered as intricate kinetic patterns.",
        year: "2024",
        client: "Geographical Flow Project"
    }
];

export default function SectionProjects() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    const lenis = useLenis();

    useEffect(() => {
        setMounted(true);
    }, []);

    const selectedProject = projects.find(p => p.id === selectedId);

    // Stop/start Lenis scroll when modal opens/closes
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

    return (
        <section className="relative w-full pt-14 bg-black/60 backdrop-blur-lg text-white">
            <div className="max-w-screen mx-auto">
                <div className="flex flex-col px-8 md:flex-row md:items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-4 pb-8"
                    >
                        <p className="text-micro font-doto uppercase tracking-widest text-white mb-2">
                            Project Preview
                        </p>
                        <h2 className="font-electrolize text-h3 md:text-h2 max-w-2xl">
                            Selection of sketches highlighting from fragmented memories.
                        </h2>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-1">
                    {gridItems.map((project, index) => {
                        if (!project) {
                            return <div key={`empty-${index}`} className="hidden lg:block aspect-4/3" />;
                        }

                        return (
                            <motion.div
                                key={project.id}
                                layoutId={`project-${project.id}`}
                                onClick={() => setSelectedId(project.id)}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: (index % 4) * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-4/3  overflow-hidden bg-white/5">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 scale-134 group-hover:scale-138 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="font-doto text-micro uppercase tracking-wider text-white/60 mb-0">
                                                    {project.category}
                                                </p>
                                                <h3 className="font-iawriter text-h3 text-white">
                                                    {project.title}
                                                </h3>
                                            </div>
                                            <div className="text-h3 text-white/40 font-doto">
                                                0{project.id}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 left-6 text-body font-doto text-white/80 transition-opacity group-hover:opacity-0">
                                        0{project.id}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {mounted && createPortal(
                <AnimatePresence>
                    {selectedId && selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-9999 flex items-center justify-center p-0 md:p-0"
                        >
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedId(null)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-lg cursor-pointer"
                            />

                            {/* Modal Content */}
                            <motion.div
                                layoutId={`project-${selectedId}`}
                                className="relative w-[95dvw] max-w-screen h-[90dvh] grid grid-cols-1 lg:grid-cols-3 bg-zinc-950 overflow-hidden border border-white/10"
                            >
                                {/* Info Side (Col 1) - Scrollable Internally */}
                                <div className="lg:col-span-1 p-8 md:p-16 flex flex-col justify-between overflow-hidden border-r border-white/5">
                                    <div className="flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide py-8">
                                        <div className="space-y-8 lg:space-y-12">
                                            <div className="overflow-hidden">
                                                <motion.p
                                                    initial={{ y: "100%" }}
                                                    animate={{ y: 0 }}
                                                    transition={{ delay: 0.2, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                                    className="font-doto text-micro uppercase tracking-widest text-white/40 mb-2"
                                                >
                                                    {selectedProject.category} — {selectedProject.year}
                                                </motion.p>
                                            </div>
                                            <div className="overflow-hidden">
                                                <motion.h2
                                                    initial={{ y: "100%" }}
                                                    animate={{ y: 0 }}
                                                    transition={{ delay: 0.3, duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                                                    className="font-electrolize text-h2 md:text-h1 leading-none tracking-tighter"
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
                                                    transition={{ delay: 0.5, duration: 0.8 }}
                                                    className="font-iawriter text-body-lg text-white/80 leading-relaxed"
                                                >
                                                    {selectedProject.description}
                                                </motion.p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                                                <div className="overflow-hidden">
                                                    <motion.div
                                                        initial={{ y: "100%" }}
                                                        animate={{ y: 0 }}
                                                        transition={{ delay: 0.6, duration: 0.8 }}
                                                    >
                                                        <p className="text-micro text-white/40 uppercase mb-2">Client</p>
                                                        <p className="font-doto text-body text-pretty">{selectedProject.client}</p>
                                                    </motion.div>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <motion.div
                                                        initial={{ y: "100%" }}
                                                        animate={{ y: 0 }}
                                                        transition={{ delay: 0.7, duration: 0.8 }}
                                                    >
                                                        <p className="text-micro text-white/40 uppercase mb-2">Identifier</p>
                                                        <p className="font-doto text-body">REF:PX-{selectedId.toString().padStart(3, '0')}</p>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="pt-8 flex items-center gap-4 shrink-0"
                                    >
                                        <div className="h-px flex-1 bg-white/10" />
                                        <p className="font-doto text-micro text-white/20 uppercase tracking-widest">
                                            Pseudo Memories © 2024
                                        </p>
                                    </motion.div>
                                </div>

                                {/* Image Side (Cols 2-3) */}
                                <div className="lg:col-span-2 relative flex flex-col overflow-hidden">
                                    <div className="p-4 flex justify-end shrink-0 z-10">
                                        <motion.button
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            onClick={() => setSelectedId(null)}
                                            className="text-white hover:text-vermelion transition-all flex items-center gap-2 group"
                                        >
                                            <PlusIcon className="h-12 w-12 transition-all hover:rotate-45 cursor-pointer" />
                                        </motion.button>
                                    </div>

                                    <div className="flex-1 relative flex items-end justify-end overflow-hidden">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                            transition={{ delay: 0.3, duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
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

