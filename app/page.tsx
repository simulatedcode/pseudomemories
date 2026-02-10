"use client";

import dynamic from "next/dynamic";


const DustStar = dynamic(() => import("./components/hero/DustStar"), { ssr: false });
const Hero8Bit = dynamic(() => import("./components/hero/Hero8Bit").then(mod => mod.Hero8Bit), { ssr: false });
const HeroCharacter = dynamic(() => import("./components/hero/HeroCharacter"), { ssr: false });
import { useIntro } from "./context/IntroContextCore";
import { motion, AnimatePresence, useInView } from "framer-motion";

export default function Home() {
  const { isComplete } = useIntro();

  return (
    <div className="relative max-w-full mx-auto text-foreground font-sans selection:bg-inverse flex flex-col">
      {/* Red Gradient Background - Slides up after intro */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isComplete ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
        style={{ willChange: "transform, opacity" }}
        className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermelion-800 via-vermelion-500 to-cyan-200"
      />

      <DustStar />

      {/* Hero Components - Staggered appearance */}
      <AnimatePresence>
        {isComplete && (
          <>
            <motion.div
              key="hero-8bit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 1.8 }}
              style={{ willChange: "opacity" }}
            >
              <Hero8Bit />
            </motion.div>
            <motion.div
              key="hero-character"
              initial={{ opacity: 0, scale: 1, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, delay: 1.6 }}
              style={{ willChange: "opacity, filter" }}
              className="fixed inset-0 z-10 pointer-events-none"
            >
              <HeroCharacter />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Spacer to push content below fixed hero */}
      <div className="h-screen w-full relative pointer-events-none" />
    </div>
  );
}


