"use client";

import React from "react";
import Image from "next/image";
import { SelectedProject } from "@/app/data/selected_project";
import { urlFor } from "@/sanity/lib/image";

interface ProjectCardProps {
    project: SelectedProject;
    index: number;
    setSelectedId: (id: number | null) => void;
}

export const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
    ({ project, index, setSelectedId }, ref) => {
        return (
            <div
                ref={ref}
                onClick={() => setSelectedId(project.id)}
                className="col-span-full sm:col-span-2 lg:col-span-3 group cursor-pointer opacity-0"
            >
                <div className="relative aspect-4/3 overflow-hidden bg-white/5">
                    <Image
                        src={urlFor(project.image).url()}
                        alt={project.title}
                        fill
                        className="object-cover object-center transition-all duration-300 ease-[cubic-bezier(0.2,0,0.38,0.9)] scale-160 group-hover:scale-100 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                    />

                    {/* Scanlines effect */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-[1.15] group-hover:opacity-[1.25] transition-opacity duration-300"
                        style={{
                            background:
                                "repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.5) 1px, rgba(0,0,0,0.5) 2px)",
                        }}
                    />

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

                    <div
                        className="absolute top-4 left-6 text-h4 font-doto text-black/60 transition-opacity duration-200 ease-[cubic-bezier(0.2,0,1,0.9)] group-hover:opacity-0"
                        style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                    >
                        0{project.id}
                    </div>
                </div>
            </div>
        );
    }
);

ProjectCard.displayName = "ProjectCard";
