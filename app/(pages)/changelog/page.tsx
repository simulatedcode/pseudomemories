import ChangelogViewer from "./components/ChangelogViewer";

export default async function ChangelogPage() {
    const res = await fetch(
        "https://raw.githubusercontent.com/simulatedcode/pseudomemories/main/CHANGELOG.md",
        { next: { revalidate: 300 } }
    );

    const markdown = await res.text();

    return <ChangelogViewer content={markdown} />;
}
