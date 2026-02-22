"use client";

import dynamic from "next/dynamic";
import { useIntro } from "@/app/context/IntroContextCore";
import { duration, easing } from "@/app/lib/motion-tokens";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SelectedProject } from "@/app/data/selected_project";

gsap.registerPlugin(ScrollTrigger);

/* Effects */
const DustStar = dynamic(() => import("@/app/components/hero/DustStar"), { ssr: false });

/* Hero (Grid + Character merged) */
const Hero = dynamic(() => import("@/app/components/hero/Hero"), { ssr: false });

/* Grid lines only */
const HeroGrid = dynamic(() => import("@/app/components/hero/HeroGrid"), { ssr: false });

/* 3D Cinematic Character */
const Helas = dynamic(() => import("@/app/components/hero/Helas"), { ssr: false });

/* Background */
const GradientBackground = dynamic(() => import("@/app/components/ui/GradientBackground"), { ssr: false });

export default function HomeClient({ projects }: { projects: SelectedProject[] }) {
    const { isComplete } = useIntro();
    const bgRef = useRef<HTMLDivElement>(null);
    const heroContainerRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!isComplete) return;

        // Background animations are now handled within AtmosphericBackground component

        // Hero Entrance
        if (heroContainerRef.current) {
            gsap.fromTo(heroContainerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: duration.cinematic, ease: easing.entrance, delay: 1.4 }
            );

        }

    }, [isComplete]);

    return (
        <div ref={mainRef} className="relative max-w-full  mx-auto text-foreground font-sans selection:bg-inverse flex flex-col">
            {isComplete && <GradientBackground />}
            <DustStar />
            {isComplete && (
                <div
                    ref={heroContainerRef}
                    className="fixed inset-0 z-10"
                    style={{ opacity: 0 }}
                >
                    <HeroGrid />
                    <Helas
                        x="center" y="center"
                        tabletX="center" tabletY="center"
                        mobileX="center" mobileY="center"
                        anchor="center"
                    />
                </div>
            )}

            {/* Main Content Flow */}
            <div className="relative z-content">
                {/* Extra spacer to allow for background scroll sequence */}
                <div className="min-h-screen w-full pointer-events-none" />
            </div>
        </div>
    );
}
