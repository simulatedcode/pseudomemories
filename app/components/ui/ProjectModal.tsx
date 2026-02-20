"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Plus } from "lucide-react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { SelectedProject } from "@/app/data/selected_project";
import { urlFor } from "@/sanity/lib/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectModalProps {
    project: SelectedProject | null;
    onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [mounted, setMounted] = useState(false);
    const [renderProject, setRenderProject] = useState<SelectedProject | null>(project);
    const [isVisible, setIsVisible] = useState(false);

    const overlayRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const contentRefs = useRef<HTMLElement[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync project prop to internal render state to allow exit animation
    useEffect(() => {
        if (project) {
            setRenderProject(project);
            setIsVisible(true);
        } else {
            // Wait for exit animation to complete before clearing renderProject
            // Handled by GSAP effect below
        }
    }, [project]);

    useGSAP(() => {
        if (!mounted) return;

        if (project) {
            // Animate In
            if (overlayRef.current) {
                gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: duration.instant, ease: easing.carbonSoft });
            }
            if (modalRef.current) {
                gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: duration.instant, ease: easing.carbonSoft });
            }

            // Stagger content
            if (contentRefs.current.length) {
                // Reset values first - filter out potentially null/undefined refs
                const validRefs = contentRefs.current.filter((el): el is HTMLElement => !!el);
                if (validRefs.length > 0) {
                    gsap.set(validRefs, { y: "100%", opacity: 0 }); // Initial state for text
                }

                // Animate elements specifically based on index/layout
                // 0: category, 1: title, 2: description, 3: footer, 4: close btn, 5: image

                // Text elements
                if (contentRefs.current[0]) gsap.to(contentRefs.current[0], { y: 0, opacity: 1, duration: duration.quick, ease: easing.carbonExpressive, delay: 0.15 });
                if (contentRefs.current[1]) gsap.to(contentRefs.current[1], { y: 0, opacity: 1, duration: duration.quick, ease: easing.carbonExpressive, delay: 0.2 });
                if (contentRefs.current[2]) gsap.to(contentRefs.current[2], { y: 0, opacity: 1, duration: duration.quick, ease: easing.carbonSoft, delay: 0.3 });
                if (contentRefs.current[3]) gsap.fromTo(contentRefs.current[3], { opacity: 0 }, { opacity: 1, duration: duration.instant, ease: easing.carbonSoft, delay: 0.4 });

                // Close button
                if (contentRefs.current[4]) gsap.fromTo(contentRefs.current[4], { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: duration.instant, ease: easing.carbonExpressive, delay: 0.3 });

                // Image
                if (contentRefs.current[5]) {
                    gsap.fromTo(contentRefs.current[5],
                        { opacity: 0, scale: 1.05, filter: "blur(10px)" },
                        { opacity: 1, scale: 1, filter: "blur(0px)", duration: duration.slow, ease: easing.carbonExpressive, delay: 0.2 }
                    );
                }
            }

        } else if (isVisible) {
            // Animate Out
            const tl = gsap.timeline({
                onComplete: () => {
                    setIsVisible(false);
                    setRenderProject(null);
                }
            });

            if (modalRef.current) {
                tl.to(modalRef.current, { opacity: 0, duration: duration.instant, ease: easing.carbonSoft }, 0);
            }
            if (overlayRef.current) {
                tl.to(overlayRef.current, { opacity: 0, duration: duration.instant, ease: easing.carbonSoft }, 0);
            }
        }
    }, [project, mounted]); // Dependency on project triggers animation

    if (!mounted || !renderProject || (!project && !isVisible)) return null;

    return createPortal(
        <div className="fixed inset-0 z-modal flex items-center justify-center p-0">
            {/* Backdrop */}
            <div
                ref={overlayRef}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Container */}
            <div
                ref={modalRef}
                className="relative w-[95dvw] max-w-screen h-[90dvh] grid grid-cols-1 lg:grid-cols-3 bg-background overflow-hidden border border-white/10"
            >
                <div className="lg:col-span-1 p-6 md:p-10 flex flex-col justify-between overflow-hidden border-r border-white/5">
                    <div className="flex flex-col h-full overflow-y-auto pr-4 scrollbar-hide">
                        <div className="space-y-8 lg:space-y-8">
                            <div className="overflow-hidden">
                                <p
                                    ref={el => { contentRefs.current[0] = el! }}
                                    className="font-doto text-body uppercase tracking-widest text-white/80 mb-6 "
                                >
                                    {renderProject.category} — {renderProject.year}
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <h2
                                    ref={el => { contentRefs.current[1] = el! }}
                                    className="font-electrolize text-h2 md:text-h1 leading-none tracking-tighter mb-4"
                                >
                                    {renderProject.title}
                                </h2>
                            </div>
                        </div>
                        <div className="space-y-6 lg:space-y-8">
                            <div className="overflow-hidden">
                                <p
                                    ref={el => { contentRefs.current[2] = el! }}
                                    className="font-iawriter text-body text-white/80 leading-relaxed"
                                >
                                    {renderProject.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        ref={el => { contentRefs.current[3] = el! }}
                        className="pt-8 flex items-center gap-4 shrink-0"
                    >
                        <p className="font-doto text-micro text-white/60 uppercase tracking-widest" suppressHydrationWarning>
                            Pseudo Memories © {new Date().getFullYear()}
                        </p>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>
                </div>
                <div className="lg:col-span-2 relative flex flex-col overflow-hidden">
                    <div className="p-4 flex justify-end shrink-0 z-10">
                        <button
                            ref={el => { contentRefs.current[4] = el! }}
                            onClick={onClose}
                            className="text-white hover:text-vermilion transition-all flex items-center gap-2 group"
                        >
                            <Plus className="h-12 w-12 transition-all hover:rotate-45 cursor-pointer" />
                        </button>
                    </div>

                    <div className="flex-1 relative flex items-end justify-end overflow-hidden">

                        <div
                            ref={el => { contentRefs.current[5] = el! }}
                            className="relative w-full aspect-3/4 md:aspect-4/3 lg:aspect-video overflow-hidden"
                        >
                            <Image
                                src={urlFor(renderProject.image).url()}
                                alt={renderProject.title}
                                fill
                                className="object-cover"
                                loading="lazy"
                            />
                            {/* Scanlines effect */}
                            <div className="absolute inset-0 pointer-events-none opacity-[2.15] group-hover:opacity-[2.25] transition-opacity duration-300"
                                style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)' }} />
                            <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                        </div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none" />
                </div>
            </div>
        </div>,
        document.body
    );
}
