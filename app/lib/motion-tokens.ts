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
    memoryFade: "power2.inOut",
    // Soft ease for standard transitions
    soft: "power2.out",
    // Gentle entrance for content
    entrance: "power3.out",
    // Carbon Design System - expressive entrance
    carbonExpressive: "expo.out",
    // Carbon Design System - soft variant
    carbonSoft: "sine.out",
};

// GSAP doesn't use variants in the same way, but we can keep these as reference or remove them.
// For now, removing them to avoid confusion and enforce direct GSAP usage.

