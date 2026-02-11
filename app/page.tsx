"use client";

import dynamic from "next/dynamic";
import { useIntro } from "@/app/context/IntroContextCore";
import { motion, AnimatePresence } from "framer-motion";

/* Effects */
const DustStar = dynamic(() => import("@/app/components/hero/DustStar"), { ssr: false });

/* Hero (Grid + Character merged) */
const Hero = dynamic(() => import("@/app/components/hero/Hero"), { ssr: false });

export default function Home() {
  const { isComplete } = useIntro();

  return (
    <div className="relative max-w-full mx-auto text-foreground font-sans selection:bg-inverse flex flex-col">

      {/* Gradient Background */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isComplete ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
        className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermelion-800 via-vermelion-500 to-cyan-200"
      />

      <DustStar />

      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 1.4 }}
            className="fixed inset-0 z-10 pointer-events-none"
          >
            <Hero x={204} anchor="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="h-screen w-full relative pointer-events-none" />
    </div>
  );
}
