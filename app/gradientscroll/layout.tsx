export default function GradientScrollLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full overflow-x-hidden bg-black">
            {children}
        </div>
    );
}
