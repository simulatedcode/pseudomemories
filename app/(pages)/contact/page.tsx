"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { duration, easing } from "@/app/lib/motion-tokens";
import { ScrambleText } from "@/app/components/ui/ScrambleText";
import { ArrowUpRight, Send, Check, AlertCircle } from "lucide-react";
import { HUDFrame } from "@/app/components/ui/HUDFrame";

export default function ContactPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState("submitting");

        const form = e.target as HTMLFormElement;
        const formData = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value,
            email: (form.elements.namedItem("email") as HTMLInputElement).value,
            subject: (form.elements.namedItem("subject") as HTMLInputElement).value,
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setFormState("success");
                form.reset();
                setTimeout(() => setFormState("idle"), 5000);
            } else {
                setFormState("error");
                setTimeout(() => setFormState("idle"), 5000);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setFormState("error");
            setTimeout(() => setFormState("idle"), 5000);
        }
    };

    const socials = [
        {
            label: "Instagram",
            url: "https://instagram.com/keppett",
            handle: "@keppett"
        },
        {
            label: "Linkedin",
            url: "https://linkedin.com/in/rzans2026",
            handle: "Muhammad Fahriza Ansyari"
        }
    ];

    return (
        <div ref={containerRef} style={{ height: "140vh" }} className="relative z-content w-full">
            <div className="fixed top-0 h-screen w-full overflow-hidden flex flex-col md:flex-row bg-background">
                {/* Left: Fixed Sidebar - Unchanged */}
                <div className="w-full md:w-[35%] h-[30vh] md:h-full flex flex-col justify-center px-spacing-08 md:px-spacing-10 py-8 md:py-0 border-b md:border-b-0 md:border-r border-white/10 z-20 bg-background/80 backdrop-blur-sm relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive }}
                        className="flex flex-col gap-6"
                    >
                        <span className="font-doto text-micro uppercase tracking-widest text-cyan block items-center gap-2">
                            <span className="w-2 h-2 inline-block rounded-full bg-cyan mr-2 animate-pulse" />
                            Contact
                        </span>
                        <h1 className="font-electrolize text-h4 md:text-h3 uppercase tracking-tighter text-white leading-none">
                            <ScrambleText text="Signal Transmission" delay={0.2} />
                        </h1>
                        <p className="font-iawriter text-body text-white/60 max-w-sm">
                            Initiate communication protocol or follow the data stream.
                        </p>
                    </motion.div>
                </div>

                {/* Right: Scrollable Content */}
                <div className="w-full md:w-[65%] h-[70vh] md:h-full overflow-hidden flex flex-col px-spacing-08 md:px-spacing-10 py-12 md:py-24">
                    <motion.div
                        style={{ y }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: duration.slow, ease: easing.carbonExpressive, delay: 0.2 }}
                        className="max-w-xl w-full flex flex-col gap-16 pb-24"
                    >
                        {/* Social Links */}
                        <section className="space-y-8">
                            {/* ... Socials grid remains same ... */}
                            <div className="flex flex-col gap-2">
                                <h2 className="font-electrolize text-h3 md:text-h2 uppercase tracking-tight text-white leading-none">
                                    <ScrambleText text="Connect" delay={0.4} />
                                </h2>
                                <p className="font-doto text-body text-white/60 uppercase tracking-widest">Network Nodes</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {socials.map((social, index) => (
                                    <a
                                        key={social.label}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex flex-col gap-2 p-6 border border-white/10 hover:border-cyan/50 hover:bg-cyan/5 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <span className="font-doto text-micro uppercase tracking-widest">{social.label}</span>
                                            <ArrowUpRight className="w-4 h-4 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                        <span className="font-electrolize text-body text-white group-hover:text-cyan transition-colors">
                                            {social.handle}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </section>

                        {/* Contact Form */}
                        <section className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <h2 className="font-electrolize text-h5 md:text-h4 uppercase tracking-tight text-white leading-none">
                                    <ScrambleText text="Message" delay={0.5} />
                                </h2>
                                <p className="font-doto text-caption text-white/60 uppercase tracking-widest">Direct Feed</p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="font-doto text-micro uppercase tracking-widest text-white/60">Identify</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            className="w-full bg-transparent border-b border-white/20 py-3 text-caption font-iawriter text-white focus:border-cyan focus:outline-none transition-colors placeholder:text-white/10"
                                            placeholder="YOUR NAME"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="font-doto text-micro uppercase tracking-widest text-white/60">Frequency</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            className="w-full bg-transparent border-b border-white/20 py-3 text-caption font-iawriter text-white focus:border-cyan focus:outline-none transition-colors placeholder:text-white/10"
                                            placeholder="EMAIL ADDRESS"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="font-doto text-micro uppercase tracking-widest text-white/60">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        id="subject"
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-caption font-iawriter text-white focus:border-cyan focus:outline-none transition-colors placeholder:text-white/10"
                                        placeholder="TOPIC OF TRANSMISSION"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="font-doto text-micro uppercase tracking-widest text-white/60">Data Packet</label>
                                    <textarea
                                        name="message"
                                        id="message"
                                        required
                                        rows={4}
                                        className="w-full bg-transparent border-b border-white/20 py-3 text-caption font-iawriter text-white focus:border-cyan focus:outline-none transition-colors placeholder:text-white/10 resize-none"
                                        placeholder="ENTER MESSAGE CONTENT..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={formState === "submitting"}
                                    className={`
                                        group flex items-center justify-center gap-4 w-full md:w-auto md:self-start px-8 py-4 
                                        border border-white/20 bg-white/5 hover:bg-cyan/10 hover:border-cyan/50 hover:text-cyan 
                                        transition-all duration-300 font-electrolize text-button uppercase tracking-widest mt-12
                                        ${formState === "submitting" ? "opacity-50 cursor-not-allowed" : ""}
                                    `}
                                >
                                    {formState === "submitting" ? (
                                        <>
                                            <span className="animate-pulse">Sending...</span>
                                        </>
                                    ) : formState === "success" ? (
                                        <>
                                            <span>Sent</span>
                                            <Check className="w-4 h-4 text-green-500" />
                                        </>
                                    ) : formState === "error" ? (
                                        <>
                                            <span>Retry</span>
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Transmit</span>
                                            <Send className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                {formState === "success" && (
                                    <p className="font-doto text-micro text-green-500 mt-2 uppercase tracking-widest">
                                        Transmission received. Stand by for response.
                                    </p>
                                )}
                                {formState === "error" && (
                                    <p className="font-doto text-micro text-red-500 mt-2 uppercase tracking-widest">
                                        Transmission failed. Check frequency and retry.
                                    </p>
                                )}
                            </form>
                        </section>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
