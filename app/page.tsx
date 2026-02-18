"use client";

import dynamic from "next/dynamic";
import { useIntro } from "@/app/context/IntroContextCore";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HUDScanline } from "./components/ui/HUDScanline";

gsap.registerPlugin(ScrollTrigger);

/* Effects */
const DustStar = dynamic(() => import("@/app/components/hero/DustStar"), { ssr: false });
const SectionIntro = dynamic(() => import("@/app/components/hero/SectionIntro"), { ssr: false });
const SectionProjects = dynamic(() => import("@/app/components/hero/SectionProjects"), { ssr: false });

/* Hero (Grid + Character merged) */
const Hero = dynamic(() => import("@/app/components/hero/Hero"), { ssr: false });

export default function Home() {
  const { isComplete } = useIntro();
  const bgRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!isComplete) return;

    // Background Entrance
    if (bgRef.current) {
      gsap.fromTo(bgRef.current,
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: duration.cinematic, ease: easing.memoryFade, delay: 0.8 }
      );
    }

    // Hero Entrance
    if (heroContainerRef.current) {
      gsap.fromTo(heroContainerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: duration.cinematic, ease: easing.entrance, delay: 1.4 }
      );

      // Scrollytelling: Fade out Hero as we scroll
      ScrollTrigger.create({
        trigger: mainRef.current,
        start: "top top",
        end: "25% top", // Fade out over first 25% of scroll
        scrub: true,
        onUpdate: (self) => {
          if (heroContainerRef.current) {
            // Opacity goes from 1 to 0
            gsap.set(heroContainerRef.current, { opacity: 1 - self.progress });
          }
        }
      });
    }

  }, [isComplete]);

  return (
    <div ref={mainRef} className="relative max-w-full  mx-auto text-foreground font-sans selection:bg-inverse flex flex-col">

      {/* Gradient Background */}
      <div
        ref={bgRef}
        className="pointer-events-none fixed inset-0 z-base bg-linear-to-b from-vermelion-800 via-vermelion-500 to-cyan-200 opacity-0 translate-y-full"
      >
        <HUDScanline />
      </div>

      <DustStar />

      {isComplete && (
        <div
          ref={heroContainerRef}
          className="fixed inset-0 z-10 pointer-events-none opacity-0"
        >
          <Hero x="64%" y="2%" mobileX="92%" mobileY="2%" anchor="bottom" />
        </div>
      )}

      {/* Main Content Flow */}
      <div className="relative z-content">
        {/* Hero Spacer */}
        <div className="h-screen w-full pointer-events-none" />

        {/* Sections: No delay/fade here to prevent gaps */}
        {isComplete && (
          <>
            <SectionIntro />
            <SectionProjects />
          </>
        )}
      </div>
    </div>
  );
}
