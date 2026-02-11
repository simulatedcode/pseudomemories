"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
    {
        id: 1,
        title: "Project Alpha",
        category: "Visual Simulation",
        image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop",
        pos: 1 // Row 1, Col 1
    },
    {
        id: 2,
        title: "Project Beta",
        category: "Memory Archive",
        image: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop",
        pos: 4 // Row 1, Col 4
    },
    {
        id: 3,
        title: "Project Gamma",
        category: "Digital Reconstruction",
        image: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?q=80&w=800&auto=format&fit=crop",
        pos: 6 // Row 2, Col 2
    },
    {
        id: 4,
        title: "Project Delta",
        category: "Synthetic Reality",
        image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800&auto=format&fit=crop",
        pos: 7 // Row 2, Col 3
    },
    {
        id: 5,
        title: "Project Epsilon",
        category: "Neural Landscape",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=800&auto=format&fit=crop",
        pos: 9 // Row 3, Col 1
    },
    {
        id: 6,
        title: "Project Zeta",
        category: "Quantum Echo",
        image: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=800&auto=format&fit=crop",
        pos: 12 // Row 3, Col 4
    },
    {
        id: 7,
        title: "Project Eta",
        category: "Temporal Glitch",
        image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?q=80&w=800&auto=format&fit=crop",
        pos: 13 // Row 4, Col 1
    },
    {
        id: 8,
        title: "Project Theta",
        category: "Kinetic Drift",
        image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop",
        pos: 15 // Row 4, Col 3
    }
];

export default function SectionProjects() {
    // We'll create a full grid of 16 slots (4x4)
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
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: (index % 4) * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <div className="relative aspect-4/3 overflow-hidden bg-white/5">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
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

                                    {/* Small number in corner like screenshot */}
                                    <div className="absolute top-4 left-6 text-body font-doto text-white/80 transition-opacity group-hover:opacity-0">
                                        0{project.id}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
