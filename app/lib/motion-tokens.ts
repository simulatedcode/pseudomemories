export const duration = {
    // Quick UI feedback (0.24s) for modals, overlays
    instant: 0.24,
    // Fast content reveals (0.3s)
    quick: 0.3,
    // Standard fast timing (0.6s)
    fast: 0.6,
    // Base cinematic timing (0.8s) for standard elements
    slow: 0.8,
    // Reflective timing (1.2s) for larger sections
    medium: 1.2,
    // Deep memory timing (1.6s) for page transitions/hero
    cinematic: 1.6,
};

export const easing = {
    // Custom cubic-bezier for "memory fade" - hesitant start, smooth end
    memoryFade: [0.3, 0, 0.2, 1] as const,
    // Soft ease for standard transitions
    soft: [0.32, 0.72, 0, 1] as const,
    // Gentle entrance for content
    entrance: [0.4, 0, 0.6, 1] as const,
    // Carbon Design System - expressive entrance
    carbonExpressive: [0, 0, 0.38, 0.9] as const,
    // Carbon Design System - soft variant
    carbonSoft: [0.2, 0, 0.38, 0.9] as const,
};

export const variants = {
    // Fade only - strictly no layout shift
    fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    },
    // Fade with subtle Y drift (20px) - safe for most containers
    fadeDrift: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    },
    // Stagger children
    staggerContainer: {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3,
            },
        },
    },
};
