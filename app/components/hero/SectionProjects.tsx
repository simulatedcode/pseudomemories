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
import { ProjectCard } from "@/app/components/ui/ProjectCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SectionProjects({ initialProjects = [] }: { initialProjects?: SelectedProject[] }) {
    const [projects, setProjects] = useState<SelectedProject[]>(initialProjects);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const containerRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const projectRefs = useRef<HTMLDivElement[]>([]);
    const lenis = useLenis();

    useEffect(() => {
        if (initialProjects.length > 0) {
            setProjects(initialProjects);
        }
    }, [initialProjects]);

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
                        <ProjectCard
                            key={project.id}
                            ref={el => { projectRefs.current[index] = el! }}
                            project={project}
                            index={index}
                            setSelectedId={setSelectedId}
                        />
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
