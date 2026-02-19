"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { SelectedProject } from "@/app/data/selected_project";
import ProjectModal from "@/app/components/ui/ProjectModal";
import { client } from "@/sanity/lib/client";
import { ALL_PROJECTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionProjects() {
    const [projects, setProjects] = useState<SelectedProject[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const projectRefs = useRef<HTMLDivElement[]>([]);
    const lenis = useLenis();

    useEffect(() => {
        const fetchProjects = async () => {
            const data = await client.fetch(ALL_PROJECTS_QUERY);
            setProjects(data);
        };
        fetchProjects();
    }, []);

    const selectedProject = projects.find((p: SelectedProject) => p.id === selectedId);

    useEffect(() => {
        if (!lenis) return;
        if (selectedId) {
            lenis.stop();
        } else {
            lenis.start();
        }

    }, [selectedId, lenis]);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Header Animations (Scroll Linked)
        if (headerRef.current) {
            // Initial State
            gsap.set(headerRef.current, { y: 0, opacity: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom center",
                    scrub: true,
                }
            });

            // Parallax the header (move it up slower than scroll)
            tl.to(headerRef.current, { y: -50, opacity: 0, ease: "none" }, 0);
        }

        // Grid Parallax - Move the whole grid slightly to create depth against the header
        gsap.to(".project-grid", {
            y: 50,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // Grid Items Animation
        if (projectRefs.current.length) {
            projectRefs.current.forEach((el) => {
                if (!el) return;

                // Staggered Entrance with subtle rotation/scale
                gsap.fromTo(el,
                    { opacity: 0, y: 100, rotation: 2 },
                    {
                        opacity: 1,
                        y: 0,
                        rotation: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 95%",
                            end: "bottom 80%",
                            scrub: 1
                        }
                    }
                );
            });
        }

    }, { dependencies: [projects], scope: containerRef }); // Re-run when projects load

    // Grid Items Logic
    const gridItems = Array.from({ length: 16 }, (_, i) => {
        const project = projects.find((p: SelectedProject) => p.pos === i + 1);
        return project || null;
    });

    return (
        <section
            ref={containerRef}
            className="relative w-full pt-spacing-10 pb-12 bg-linear-to-t from-background via-background/70 mask-to-b backdrop-blur-md "
        >
            {/* Sticky Header - Direct child of section */}
            <div
                ref={headerRef}
                className="sticky top-24 z-50 px-spacing-08 md:px-spacing-10 pb-12 mix-blend-difference"
            >
                <div
                    className="flex flex-col gap-4 pointer-events-none"
                >
                    {/* heading project title  */}
                    <div
                        className="pointer-events-auto"
                    >
                        <p className="text-body font-doto uppercase tracking-widest mix-blend-difference text-white mb-4">
                            Project Preview
                        </p>
                        <h3 className="font-electrolize text-h3 md:text-h2 mix-blend-difference max-w-2xl">
                            Selection of sketches highlighting from fragmented memories.
                        </h3>
                    </div>
                </div>
            </div>

            {/* Grid - Scrolls past sticky header */}
            <div
                className="project-grid relative z-10 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-0 md:gap-1 px-spacing-08 md:px-spacing-10"
            >
                {gridItems.map((project, index) => {
                    if (!project) {
                        return <div key={`empty-${index}`} className="hidden lg:block col-span-3 aspect-video" />;
                    }

                    return (
                        <div
                            key={project.id}
                            ref={el => { projectRefs.current[index] = el! }}
                            onClick={() => setSelectedId(project.id)}
                            className="col-span-full sm:col-span-2 lg:col-span-3 group cursor-pointer opacity-0" // Initial opacity handled by GSAP fromTo, ensuring no flash
                        >
                            <div className="relative aspect-4/3 overflow-hidden bg-white/5">
                                <Image
                                    src={urlFor(project.image).url()}
                                    alt={project.title}
                                    fill
                                    className="object-cover object-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0.38,0.9)] scale-160 group-hover:scale-100 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                                />

                                {/* Scanlines effect */}
                                <div className="absolute inset-0 pointer-events-none opacity-[1.15] group-hover:opacity-[1.25] transition-opacity duration-300"
                                    style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)' }} />

                                {/* Cyan Hover Overlay & Border */}
                                <div className="absolute inset-0 border border-transparent group-hover:border-cyan/40 bg-cyan/0 group-hover:bg-cyan/5 transition-all duration-300 pointer-events-none" />

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
                        </div>
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
