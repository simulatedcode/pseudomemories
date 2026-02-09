declare module 'react-player' {
    import React from 'react';

    export interface ReactPlayerProps {
        url?: string | string[] | MediaStream;
        playing?: boolean;
        loop?: boolean;
        controls?: boolean;
        light?: boolean | string;
        volume?: number;
        muted?: boolean;
        playbackRate?: number;
        width?: string | number;
        height?: string | number;
        style?: React.CSSProperties;
        progressInterval?: number;
        playsinline?: boolean;
        pip?: boolean;
        stopOnUnmount?: boolean;
        fallback?: React.ReactElement;
        wrapper?: any;
        playIcon?: React.ReactElement;
        previewTabIndex?: number;
        config?: {
            soundcloud?: {
                options?: any;
            };
            youtube?: {
                playerVars?: any;
                embedOptions?: any;
                onUnstarted?: () => void;
            };
            facebook?: {
                appId?: string;
                version?: string;
                playerId?: string;
                attributes?: any;
            };
            dailymotion?: {
                params?: any;
            };
            vimeo?: {
                playerOptions?: any;
                title?: string;
            };
            file?: {
                attributes?: any;
                tracks?: any[];
                forceVideo?: boolean;
                forceAudio?: boolean;
                forceHLS?: boolean;
                forceDASH?: boolean;
                forceFLV?: boolean;
            };
            wistia?: {
                options?: any;
                playerId?: string;
                customControls?: any[];
            };
            mixcloud?: {
                options?: any;
            };
            vidyard?: {
                options?: any;
            };
        };
        onReady?: (player: ReactPlayer) => void;
        onStart?: () => void;
        onPlay?: () => void;
        onPause?: () => void;
        onBuffer?: () => void;
        onBufferEnd?: () => void;
        onEnded?: () => void;
        onError?: (error: any, data?: any, hlsInstance?: any, hlsGlobal?: any) => void;
        onDuration?: (duration: number) => void;
        onSeek?: (seconds: number) => void;
        onProgress?: (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => void;
        onEnablePIP?: () => void;
        onDisablePIP?: () => void;
        [key: string]: any;
    }

    const ReactPlayer: React.FC<ReactPlayerProps>;
    export default ReactPlayer;
}
