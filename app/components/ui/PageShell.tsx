"use client";

import { motion } from "framer-motion";

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
            className="relative z-30 min-h-screen w-full"
        >
            {children}
        </motion.div>
    );
}
