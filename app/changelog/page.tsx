import ReactMarkdown from "react-markdown";

export default async function ChangelogPage() {
    const res = await fetch(
        "https://raw.githubusercontent.com/simulatedcode/pseudomemories/main-v1/CHANGELOG.md",
        { next: { revalidate: 300 } }
    );

    const markdown = await res.text();

    return <ReactMarkdown>{markdown}</ReactMarkdown>;
}
