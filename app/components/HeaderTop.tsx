"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "./ui/ScrambleText";
import pkg from "../../package.json";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface HeaderTopProps {
  hoveredItem: string | null;
  setHoveredItem: (item: string | null) => void;
}

export function HeaderTop({ hoveredItem, setHoveredItem }: HeaderTopProps) {
  const [version] = useState(`v${pkg.version}`);
  const logoRef = useRef<HTMLDivElement>(null);
  const versionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: duration.medium, ease: easing.entrance, delay: 0.2 }
      );
    }
    if (versionRef.current) {
      gsap.fromTo(versionRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: duration.medium, ease: easing.entrance, delay: 0.4 }
      );
    }
  });

  return (
    <div
      className="fixed top-spacing-07 left-spacing-07 z-hud flex flex-col pointer-events-none"
    >
      {/* Logo/Title */}
      <div
        ref={logoRef}
        className="pointer-events-auto opacity-0" // Initial opacity handled by GSAP from, but good to have class
        onMouseEnter={() => setHoveredItem("Logo")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <Link
          href="/"
          className="font-electrolize text-h5 uppercase tracking-widest text-white mix-blend-defference opacity-80 hover:opacity-100 transition-opacity"
        >
          <ScrambleText
            text="pseudo memories"
            delay={1.2}
            duration={1.2}
            trigger={hoveredItem === "Logo"}
          />
        </Link>
      </div>

      {/* Version */}
      <div
        ref={versionRef}
        className="pointer-events-auto font-doto text-micro uppercase tracking-widest text-white/80 hover:text-white/90 transition-opacity cursor-default opacity-0"
        onMouseEnter={() => setHoveredItem("Version")}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <span className="flex gap-spacing-02">Last version:
          <ScrambleText
            text={version}
            delay={1.8}
            duration={1.5}
            trigger={hoveredItem === "Version"}
          />
        </span>
      </div>
    </div>
  );
}
