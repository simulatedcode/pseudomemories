"use client";

import { motion, scale } from "framer-motion";

export default function PageShell({
    children,
    isMenuOpen,
}: {
    children: React.ReactNode;
    isMenuOpen: boolean;
}) {
    return (
        <motion.div
            animate={{
                x: isMenuOpen ? -320 : 0,
            }}
            transition={{ type: "spring", stiffness: 220, damping: 30 }}
            className="relative z-40 min-h-screen w-full shadow-2xl"
        >
            {children}
        </motion.div>
    );
}
