export default function DocumentationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative w-full bg-background pb-spacing-12">
            {/* Linear Gradient Background - Aesthetic alignment with the Pseudo Memories theme */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 40%, #111111 100%)',
                }}
            />

            {/* Ambient Vermelion Glow */}
            <div
                className="absolute top-[-10%] right-[-5%] w-[60%] h-[40%] rounded-full blur-[120px] opacity-10 pointer-events-none"
                style={{ background: 'var(--color-vermelion)' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-spacing-08 py-spacing-10 pt-40">
                <article className="prose prose-invert max-w-none 
                    /* Headings */
                    prose-h1:font-electrolize prose-h1:uppercase prose-h1:tracking-widest prose-h1:text-h2 prose-h1:mb-spacing-08
                    prose-h2:font-electrolize prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-h4 prose-h2:text-offwhite-100/80 prose-h2:mt-spacing-09 prose-h2:mb-spacing-04
                    prose-h3:font-electrolize prose-h3:uppercase prose-h3:tracking-wide prose-h3:text-h5 prose-h3:text-offwhite-100/70 prose-h3:mt-spacing-07 prose-h3:mb-spacing-03
                    
                    /* Body & Paragraphs */
                    prose-p:font-doto prose-p:text-body prose-p:leading-relaxed prose-p:text-offwhite-100/60 prose-p:mb-spacing-06
                    prose-strong:text-offwhite-100 prose-strong:font-bold
                    
                    /* Lists */
                    prose-ul:list-none prose-ul:pl-0 prose-ul:mb-spacing-06
                    prose-li:font-doto prose-li:text-body prose-li:text-offwhite-100/50 prose-li:mb-spacing-03
                    prose-li:before:content-['•'] prose-li:before:mr-4 prose-li:before:text-vermelion
                    
                    /* Hr & Spacing */
                    prose-hr:border-white/10 prose-hr:my-spacing-10
                ">
                    {children}
                </article>
            </div>
        </div>
    );
}
