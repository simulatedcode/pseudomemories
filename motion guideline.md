# Motion Design Guidelines

1. Create a cinematic website experience based on the concept of Pseudo Memories. The website should feel like a mirage. Time feels stretched. Memory feels unstable. Users should feel like they are recalling something, not browsing.

2. The mood is slow, reflective, slightly disorienting. Avoid sharp transitions. Avoid fast interactions. Every movement should feel delayed and intentional.

3. Define motion behavior

Use Framer Motion with slow cinematic transitions.
Duration between 0.8s and 1.6s.
Use easeInOut or custom cubic bezier for soft motion.
Use subtle y-axis movement between 20px and 40px.
Use opacity fade instead of aggressive scale effects.
Stagger children elements with noticeable delay.

4. Define scroll behavior

Use scroll-triggered animations instead of click-based transitions.
Sections should overlap slightly in timing.
Avoid snapping.
Scrolling should feel continuous and fluid.

5. Define typography behavior

Typography should fade and slide softly.
Headlines appear slightly after images.
Use large spacing between lines.
Avoid tight layouts. Let the text breathe.

6. Define image treatment

Images should feel slightly detached from reality.
Use subtle parallax movement.
Keep aspect ratios varied but controlled.
Center the main visual element in each frame.

7. Define interaction philosophy

Interactions should not feel like buttons.
Hover states should be minimal and soft.
No aggressive scaling or bouncing.
Focus on immersion, not conversion.

8. Define technical stack

Build using Next.js and Framer Motion.
Use motion components for sections, images, and text.
Use staggerChildren and variants for consistent motion system.
Keep animation values reusable as design tokens.

9. Final instruction block

The final result should feel like entering a digital memory archive that shifts over time. The user should feel present inside a fading recollection, not navigating a typical website.