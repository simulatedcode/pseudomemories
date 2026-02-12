"use client";

import dynamic from "next/dynamic";
import { useIntro } from "@/app/context/IntroContextCore";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";

/* Effects */
const DustStar = dynamic(() => import("@/app/components/hero/DustStar"), { ssr: false });
const SectionProjects = dynamic(() => import("@/app/components/hero/SectionProjects"), { ssr: false });

/* Hero (Grid + Character merged) */
const Hero = dynamic(() => import("@/app/components/hero/Hero"), { ssr: false });
const SectionSlide = dynamic(() => import("@/app/components/hero/SectionSlide"), { ssr: false });

export default function Home() {
  const { isComplete } = useIntro();
  const { scrollYProgress } = useScroll();

  // Softer spring for more "luxurious" movement
  const smoothY = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 30,
    mass: 1,
    restDelta: 0.001
  });

  const bgY = useTransform(smoothY, [0, 1], ["0%", "-10%"]);

  return (
    <div className="relative max-w-full mx-auto text-foreground font-sans selection:bg-inverse flex flex-col">

      {/* Gradient Background */}
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isComplete ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        style={{ y: bgY }}
        transition={{ duration: duration.cinematic, ease: easing.memoryFade, delay: 0.8 }}
        className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermelion-800 via-vermelion-500 to-cyan-200"
      />

      <DustStar />

      <AnimatePresence>
        {isComplete && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.cinematic, ease: easing.entrance, delay: 1.4 }}
            className="fixed inset-0 z-10 pointer-events-none"
          >
            <Hero x={204} anchor="bottom" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Flow */}
      <div className="relative z-20">
        {/* Hero Spacer */}
        <div className="h-screen w-full pointer-events-none" />

        {/* Sections: No delay/fade here to prevent gaps */}
        {isComplete && (
          <>
            <SectionProjects />
            <SectionSlide />
          </>
        )}
      </div>
    </div>
  );
}
