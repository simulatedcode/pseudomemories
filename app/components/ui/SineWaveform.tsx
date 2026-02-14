export function SineWaveform({
    lineColor = "#F2653A",
    height = 64,
    speed = 0.2,
    amplitude = 12,
    analyser = null
}: {
    lineColor?: string;
    height?: number;
    speed?: number;
    amplitude?: number;
    analyser?: AnalyserNode | null;
}) {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const dataArrayRef = React.useRef<Uint8Array<ArrayBuffer> | null>(null);

    React.useEffect(() => {
        if (analyser) {
            const bufferLength = analyser.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
        } else {
            dataArrayRef.current = null;
        }
    }, [analyser]);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Resize handler
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = height;
            }
        };

        window.addEventListener('resize', resize);
        resize();

        const animate = () => {
            time += speed;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const w = canvas.width;
            const h = canvas.height;
            const centerY = h / 2;

            ctx.beginPath();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = lineColor;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 4;
            ctx.shadowColor = lineColor;

            // Draw sine wave
            let firstX = 0;
            let firstY = centerY;

            // If we have an analyser, use real data
            if (analyser && dataArrayRef.current) {
                analyser.getByteTimeDomainData(dataArrayRef.current);

                const bufferLength = dataArrayRef.current.length;
                // We want to map bufferLength points to canvas width w
                // But typically buffer is 256 or 512, canvas might be 200px
                const sliceWidth = w * 1.0 / bufferLength;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    const v = dataArrayRef.current[i] / 128.0; // 0..2, 1 is center
                    const y = v * h / 2; // Map 0..2 to 0..h centered

                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                    x += sliceWidth;
                }
            } else {
                // Procedural fallback
                for (let x = 0; x < w; x++) {
                    // Combine multiple sine waves for organic feel
                    const frequency = 0.03;
                    const y = centerY +
                        Math.sin(x * frequency - time) * amplitude * Math.sin(time * 0.1 + x * 0.01) +
                        Math.sin(x * 0.08 + time * 0.5) * (amplitude * 0.3);

                    if (x === 0) {
                        ctx.moveTo(x, y);
                        firstX = x;
                        firstY = y;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
            }
            ctx.stroke();

            // Leading Dot / Scanner
            // Only show scanner dot in procedural mode or simplify for analyzed mode
            if (!analyser) {
                const dotX = 30; // Fixed position near left
                const dotY = centerY +
                    Math.sin(dotX * 0.03 - time) * amplitude * Math.sin(time * 0.1 + dotX * 0.01) +
                    Math.sin(dotX * 0.08 + time * 0.5) * (amplitude * 0.3);

                ctx.beginPath();
                ctx.arc(dotX, dotY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "#c2c2c2";
                ctx.fill();
                ctx.shadowBlur = 8;
                ctx.shadowColor = "#ffffff";
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [lineColor, height, speed, amplitude, analyser]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full opacity-90"
            style={{ height: `${height}px` }}
        />
    );
}

import React from 'react';
