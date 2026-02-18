"use client"
import { useRef } from "react";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { updates } from "@/app/data/updates";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function UpdatesPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarContentRef = useRef<HTMLDivElement>(null);
    const scrollableContentRef = useRef<HTMLDivElement>(null);
    const updatesListRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        // Sidebar Entrance
        if (sidebarContentRef.current) {
            gsap.fromTo(sidebarContentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: duration.slow, ease: easing.carbonExpressive }
            );
        }

        // Header Entrance
        if (headerRef.current) {
            gsap.fromTo(headerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: duration.slow, ease: easing.carbonExpressive }
            );
        }

        // Updates List Entrance
        if (updatesListRef.current) {
            gsap.fromTo(updatesListRef.current,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: duration.slow, ease: easing.carbonExpressive, delay: 0.2 }
            );
        }

        // Scroll Parallax for updates list container
        // Original: y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"])
        // This suggests the list moves UP faster than scroll, or slower? 
        // "0%" to "-50%" on scrollYProgress [0, 1].
        // This is a parallax effect.
        if (scrollableContentRef.current) {
            // We can achieve this with a scrub ScrollTrigger
            gsap.to(scrollableContentRef.current, {
                yPercent: -50,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: true
                }
            });
        }

    }, { scope: containerRef });

    return (
        <div ref={containerRef} style={{ height: `${updates.length * 50 + 100}vh` }} className="relative z-content w-full">
            <div className="fixed top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-background">
                {/* Left: Pinned Sidebar */}
                <div className="w-full md:w-[35%] h-[30vh] md:h-full flex flex-col justify-center px-spacing-08 md:px-spacing-10 py-8 md:py-0 border-b md:border-b-0 md:border-r border-white/10 z-20 bg-background/80 backdrop-blur-sm relative">
                    <div
                        ref={sidebarContentRef}
                        className="flex flex-col gap-6 opacity-0 translate-y-8"
                    >
                        <span className="font-doto text-micro uppercase tracking-widest text-cyan block items-center gap-2">
                            <span className="w-2 h-2 inline-block rounded-full bg-cyan mr-2 animate-pulse" />
                            Updates
                        </span>
                        <h1 className="font-electrolize text-h4 md:text-h3 uppercase tracking-tighter text-white leading-none">
                            <ScrambleText text="History & Information" delay={0.2} />
                        </h1>
                        <p className="font-iawriter text-body text-white/60 max-w-sm">
                            Here you can find the latest updates on my work and exhibitions.
                        </p>
                        <div className="hidden md:block w-12 h-px bg-white/20 mt-8 mb-8" />
                        <p className="hidden md:block font-doto text-caption text-white/40">
                            the last update was on {updates[0].date}
                        </p>
                    </div>
                </div>

                {/* Right: Scrollable Content */}
                <div className="w-full md:w-[65%] h-[70vh] md:h-full overflow-hidden flex flex-col px-spacing-08 md:px-spacing-10 py-12 md:py-24">
                    {/* HUD Grid Background */}
                    <div className="fixed inset-0 pointer-events-none z-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div ref={scrollableContentRef} className="relative flex flex-col gap-6 w-full will-change-transform">
                        {/* header */}
                        <div className="mb-12">
                            <div
                                ref={headerRef}
                                className="flex flex-col gap-2 opacity-0 translate-y-8"
                            >
                                <h2 className="font-electrolize text-h3 md:text-h2 uppercase tracking-widest text-white leading-none">
                                    <ScrambleText text="Data Stream" delay={0.2} />
                                </h2>
                                <p className="font-doto text-body text-white/60 uppercase tracking-widest">cached memories</p>
                            </div>
                        </div>

                        {/* list of updates */}
                        <div
                            ref={updatesListRef}
                            className="max-w-3xl space-y-1 w-full pb-24 opacity-0 translate-x-5"
                        >
                            {updates.map((update, index) => (
                                <div
                                    key={update.id}
                                    className="group border-b border-white/10 py-6 hover:bg-zinc-900/40 transition-all px-6 first:border-t"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-4 mb-2">
                                                <span className="font-doto text-micro text-white/40 uppercase tracking-widest">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <h3 className="font-electrolize text-body uppercase tracking-wider text-white group-hover:text-cyan transition-colors">
                                                    {update.title}
                                                </h3>
                                            </div>
                                            <div className="ml-0 md:ml-8 space-y-1">
                                                {update.location && (
                                                    <p className="font-doto text-caption text-white/60 uppercase tracking-widest">
                                                        {update.location}
                                                    </p>
                                                )}
                                                {update.description && (
                                                    <p className="font-doto text-caption text-white/50">
                                                        {update.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-left md:text-right ml-8 md:ml-0">
                                            <span className="font-doto text-micro uppercase tracking-widest text-white/60 block bg-white/5 border border-white/10 px-2 py-1 w-fit md:w-auto md:ml-auto">
                                                {update.date}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
