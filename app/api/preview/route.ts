import { draftMode } from "next/headers";

export async function GET(): Promise<Response> {
    const draft = await draftMode();
    draft.enable();

    return new Response("Preview mode enabled");
}