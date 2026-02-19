import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

export const dynamic = "force-dynamic";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return (
    <div className="p-8 h-screen bg-background">
      <div className="h-full overflow-hidden rounded-lg border border-white/10 shadow-md">
        <NextStudio config={config} />
      </div>
    </div>
  );
}
