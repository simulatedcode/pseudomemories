"use client";

import dynamic from "next/dynamic";

const DustStar = dynamic(() => import("./components/DustStar"), { ssr: false });
const Hero8Bit = dynamic(() => import("./components/Hero8Bit").then(mod => mod.Hero8Bit), { ssr: false });
const HeroCharacter = dynamic(() => import("./components/HeroCharacter"), { ssr: false });

const ParallaxStory = dynamic(() => import("./components/ParallaxStory"), { ssr: false });

export default function Home() {
  return (
    <div className="relative max-w-full mx-auto bg-offwhite-50 text-foreground font-sans selection:bg-inverse min-h-[1280vh] flex flex-col">
      {/* Red Gradient Background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-linear-to-b from-vermelion-800 via-vermelion-500 to-cyan-200" />
      <DustStar />
      <Hero8Bit />
      <HeroCharacter y={-102} />
      {/* Parallax Content Layer */}
      <ParallaxStory />
    </div>
  );
}
