export function HUDScanline() {
    return (
        <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
                backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)`,
                backgroundSize: '100% 4px'
            }}
        />
    );
}
