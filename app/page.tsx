"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative max-w-screen mx-auto bg-offwhite-50 text-foreground font-sans selection:bg-vermalion-600/50">
      {/* Red Gradient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermalion-700 via-vermalion-500 to-vermalion-50" />

      <main className="relative z-10 flex flex-col items-center justify-start pt-spacing-12 px-spacing-06 sm:px-spacing-08">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-plex font-black text-6xl sm:text-8xl tracking-tighter text-offwhite-500 mb-spacing-05 text-center uppercase"
        >
          Pseudo Memories
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="font-plex font-light text-2xl sm:text-4xl tracking-tighter text-offwhite-200 mb-spacing-05 text-center uppercase"
        >
          A collection of memories
        </motion.p>
      </main>
    </div>
  );
}
