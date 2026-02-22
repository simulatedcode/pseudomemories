"use client";

import React from "react";
import Link from "next/link";
import { ScrambleText } from "./ui/ScrambleText";

interface MenuLinkProps {
    link: { label: string; href: string; desc: string };
    index: number;
    hoveredItem: string | null;
    setHoveredItem: (item: string | null) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
}

export const MenuLink = React.forwardRef<HTMLDivElement, MenuLinkProps>(
    ({ link, index, hoveredItem, setHoveredItem, setIsMenuOpen }, ref) => {
        return (
            <div
                ref={ref}
                className="opacity-0"
                onMouseEnter={() => setHoveredItem(link.label)}
                onMouseLeave={() => setHoveredItem(null)}
            >
                <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="group relative block h-full p-4 border border-white/10 hover:border-cyan-100/20 bg-black/20 hover:bg-vermilion/5 transition-all duration-300"
                >
                    {/* Number Indicator */}
                    <div className="absolute top-4 right-4 font-doto text-body text-white/10 group-hover:text-vermilion/20 transition-colors">
                        0{index + 1}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-2 h-2 rounded-full bg-vermilion/50 transition-all duration-700 ${hoveredItem === link.label ? "scale-150 opacity-100 animate-pulse" : "scale-100 opacity-50"
                                    }`}
                            />
                            <span className="font-doto text-micro uppercase tracking-widest text-vermilion/80">
                                {link.desc}
                            </span>
                        </div>

                        <h3 className="font-electrolize text-h5 uppercase tracking-wider text-white group-hover:text-vermilion transition-colors">
                            <ScrambleText
                                text={link.label}
                                trigger={hoveredItem === link.label}
                                duration={0.5}
                            />
                        </h3>

                        {/* Animated Underline */}
                        <div className="h-px w-0 group-hover:w-full bg-linear-to-r from-vermilion to-transparent transition-all duration-500" />
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <div className="absolute inset-0 bg-linear-to-br from-vermilion/10 via-transparent to-transparent" />
                    </div>
                </Link>
            </div>
        );
    }
);

MenuLink.displayName = "MenuLink";
