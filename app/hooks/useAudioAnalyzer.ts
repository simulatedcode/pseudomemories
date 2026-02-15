import { useState, useRef, useCallback, useEffect } from 'react';

interface AudioAnalyzerState {
    isListening: boolean;
    error: string | null;
    toggleAudio: () => Promise<void>;
    analyser: AnalyserNode | null;
}

export function useAudioAnalyzer(fftSize: number = 256, monitoring: boolean = false): AudioAnalyzerState {
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);

    const stopAudio = useCallback(() => {
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        if (gainRef.current) {
            gainRef.current.disconnect();
            gainRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        setAnalyser(null);
        setIsListening(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopAudio();
        };
    }, [stopAudio]);

    const startAudio = useCallback(async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: false
                }
            });
            streamRef.current = stream;

            // Handle cross-browser AudioContext
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            audioContextRef.current = audioContext;

            const newAnalyser = audioContext.createAnalyser();
            newAnalyser.fftSize = fftSize;

            const source = audioContext.createMediaStreamSource(stream);
            sourceRef.current = source;
            source.connect(newAnalyser);

            // If monitoring is enabled, connect to destination (speakers)
            if (monitoring) {
                // Add a gain node to control volume if needed (default 1)
                const gainNode = audioContext.createGain();
                gainNode.gain.value = 0.06;
                source.connect(gainNode);
                gainNode.connect(audioContext.destination);
                gainRef.current = gainNode;
            }

            setAnalyser(newAnalyser);
            setIsListening(true);

        } catch (err: any) {
            console.error("Error accessing microphone:", err);
            setError(err.message || "Could not access microphone");
            stopAudio();
        }
    }, [fftSize, monitoring, stopAudio]);

    const toggleAudio = useCallback(async () => {
        if (isListening) {
            stopAudio();
        } else {
            await startAudio();
        }
    }, [isListening, startAudio, stopAudio]);

    return { isListening, error, toggleAudio, analyser };
}

