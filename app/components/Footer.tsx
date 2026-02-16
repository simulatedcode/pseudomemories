"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, easeOut } from "framer-motion";
import { ScrambleText } from "./ui/ScrambleText"
import { useIntro } from "../context/IntroContextCore";
import pkg from "../../package.json";

type TechRowProps = {
    label: string;
    value: string;
    delay?: number;
};

function TechRow({ label, value, delay = 0 }: TechRowProps) {
    const ref = useRef<HTMLTableRowElement | null>(null);
    const isInView = useInView(ref, { once: false, amount: 0.4 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.tr
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.3, ease: "easeOut" }}
            className="border-b border-white/10 hover:bg-white/5 transition"
        >
            <td className="px-3 py-2 font-electrolize text-[10px] uppercase tracking-widest opacity-60">
                {label}
            </td>
            <td className="px-3 py-2 font-doto text-micro uppercase tracking-wider text-offwhite-100/90 ">
                <ScrambleText
                    text={value}
                    delay={delay}
                    duration={0.8}
                    trigger={isInView || isHovered}
                />
            </td>
        </motion.tr>
    );
}

export function Footer() {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (open: boolean) => {
        setIsOpen(open);
    };

    const [isCopyrightHovered, setIsCopyrightHovered] = useState(false);
    const [isGithubHovered, setIsGithubHovered] = useState(false);
    const { isComplete } = useIntro();
    const [refId, setRefId] = useState(`v${pkg.version}`);

    React.useEffect(() => {
        // Version is static for the session
    }, []);

    return (
        <footer className="relative hidden md:flex bottom-0 z-content w-full min-h-32 bg-background/80 backdrop-blur-lg flex-col justify-center items-center py-spacing-07">
            <div className="w-full max-w-4xl px-spacing-04 flex flex-col gap-spacing-04 ">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-spacing-05 border-b border-white/10 pb-spacing-04">
                    <div className="flex flex-col gap-spacing-02">
                        <h3 className="font-electrolize text-caption uppercase tracking-[0.2em] text-offwhite-100">
                            System Architecture
                        </h3>
                        <p className="font-doto text-micro uppercase tracking-[0.3em] text-offwhite-100/60">
                            {new Date().getFullYear()}.02.11 // v{pkg.version} // Active Protocol
                        </p>
                    </div>

                    <div className="flex items-center gap-spacing-02">
                        <div className="flex justify-end gap-spacing-02 items-center bg-white/5 border border-white/10 backdrop-blur-md p-spacing-02 px-2">
                            <span className="font-electrolize text-micro uppercase text-white/50">Status</span>
                            <span className="flex items-center gap-spacing-01 font-doto text-micro uppercase text-white/50 tracking-widest">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-green-600 mr-spacing-01"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="font-doto text-[10px] uppercase tracking-widest">
                            © {new Date().getFullYear()} Pseudo Memories
                        </span>
                        <span className="font-doto text-[10px] uppercase tracking-widest text-white/80">
                            All systems nominal
                        </span>
                    </div>
                    <div>
                        <span className="font-doto text-[10px] uppercase tracking-widest text-white/80">
                            REF: {refId}
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
}
