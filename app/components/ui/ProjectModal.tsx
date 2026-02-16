"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Plus } from "lucide-react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { Project } from "@/app/data/projects";

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {project && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: duration.instant, ease: easing.carbonSoft }}
                    className="fixed inset-0 z-modal flex items-center justify-center p-0"
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: duration.instant, ease: easing.carbonSoft }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-lg cursor-pointer"
                    />
                    <motion.div
                        layoutId={`project-${project.id}`}
                        className="relative w-[95dvw] max-w-screen h-[90dvh] grid grid-cols-1 lg:grid-cols-3 bg-zinc-900 overflow-hidden border border-white/10"
                    >
                        <div className="lg:col-span-1 p-6 md:p-10 flex flex-col justify-between overflow-hidden border-r border-white/5">
                            <div className="flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide">
                                <div className="space-y-8 lg:space-y-8">
                                    <div className="overflow-hidden">
                                        <motion.p
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.15, duration: duration.quick, ease: easing.carbonExpressive }}
                                            className="font-doto text-body uppercase tracking-widest text-white/80 mb-6"
                                        >
                                            {project.category} — {project.year}
                                        </motion.p>
                                    </div>
                                    <div className="overflow-hidden">
                                        <motion.h2
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            transition={{ delay: 0.2, duration: duration.quick, ease: easing.carbonExpressive }}
                                            className="font-electrolize text-h2 md:text-h1 leading-none tracking-tighter mb-4"
                                        >
                                            {project.title}
                                        </motion.h2>
                                    </div>
                                </div>
                                <div className="space-y-6 lg:space-y-8">
                                    <div className="overflow-hidden">
                                        <motion.p
                                            initial={{ y: "20%", opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.3, duration: duration.quick, ease: easing.carbonSoft }}
                                            className="font-iawriter text-body text-white/80 leading-relaxed"
                                        >
                                            {project.description}
                                        </motion.p>
                                    </div>
                                </div>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: duration.instant, ease: easing.carbonSoft }}
                                className="pt-8 flex items-center gap-4 shrink-0"
                            >
                                <p className="font-doto text-micro text-white/60 uppercase tracking-widest" suppressHydrationWarning>
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
                                    transition={{ delay: 0.3, duration: duration.instant, ease: easing.carbonExpressive }}
                                    onClick={onClose}
                                    className="text-white hover:text-vermelion transition-all flex items-center gap-2 group"
                                >
                                    <Plus className="h-12 w-12 transition-all hover:rotate-45 cursor-pointer" />
                                </motion.button>
                            </div>
                            <div className="flex-1 relative flex items-end justify-end overflow-hidden">
                                <motion.div
                                    initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                    transition={{ delay: 0.2, duration: duration.slow, ease: easing.carbonExpressive }}
                                    className="relative w-full aspect-video overflow-hidden"
                                >
                                    <Image
                                        src={project.image}
                                        alt={project.title}
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
    );
}
